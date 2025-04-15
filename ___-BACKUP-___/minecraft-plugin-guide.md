# Руководство по интеграции Minecraft плагина с веб-сайтом EternalCore

## Общий принцип работы API

Взаимодействие между сайтом eternalcore.ru и сервером Minecraft происходит через HTTP API. Для обеспечения безопасности все запросы и ответы подписываются с использованием HMAC SHA-256 на основе секретного ключа.

## Схема аутентификации

1. **Общий секретный ключ:** И сайт, и плагин Minecraft используют один и тот же секретный ключ `MINECRAFT_API_SECRET` для создания и проверки подписей.

2. **Заголовки запросов:**
   - `X-Timestamp`: Unix-время в миллисекундах (текущее время) 
   - `X-Signature`: HMAC SHA-256 подпись на основе временной метки и секретного ключа

3. **Формирование подписи:**
   ```java
   String createSignature(String timestamp, String secret) {
       try {
           Mac hmac = Mac.getInstance("HmacSHA256");
           SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
           hmac.init(secretKey);
           byte[] hash = hmac.doFinal(timestamp.getBytes(StandardCharsets.UTF_8));
           return bytesToHex(hash);
       } catch (Exception e) {
           e.printStackTrace();
           return "";
       }
   }
   
   String bytesToHex(byte[] bytes) {
       StringBuilder hexString = new StringBuilder();
       for (byte b : bytes) {
           String hex = Integer.toHexString(0xff & b);
           if (hex.length() == 1) hexString.append('0');
           hexString.append(hex);
       }
       return hexString.toString();
   }
   ```

4. **Проверка подписи:**
   ```java
   boolean verifySignature(String signature, String timestamp, String secret) {
       String expectedSignature = createSignature(timestamp, secret);
       return MessageDigest.isEqual(
           signature.getBytes(StandardCharsets.UTF_8),
           expectedSignature.getBytes(StandardCharsets.UTF_8)
       );
   }
   ```

## Эндпоинт /online

Этот эндпоинт возвращает количество онлайн игроков на сервере.

### Запрос от сайта к плагину

```
GET http://eternalcore.ru:25567/api/online
X-Timestamp: 1681234567890
X-Signature: a1b2c3d4e5f6...
```

### Ответ от плагина сайту

```json
{
  "online": 42,
  "server_name": "EternalCore",
  "server_version": "1.16.5"
}
```

### Заголовки ответа

```
X-Timestamp: 1681234567890
X-Signature: a1b2c3d4e5f6...
```

## Реализация плагина (пример на Java)

Ниже приведен пример класса для обработки API запросов в вашем Bukkit/Spigot плагине:

```java
package ru.eternalcore.plugin;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;
import org.json.simple.JSONObject;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

public class WebApiHandler {
    private final JavaPlugin plugin;
    private final HttpServer server;
    private final String apiSecret;

    public WebApiHandler(JavaPlugin plugin, String apiSecret, int port) throws IOException {
        this.plugin = plugin;
        this.apiSecret = apiSecret;
        this.server = HttpServer.create(new InetSocketAddress(port), 0);
        
        // Маршрутизация запросов
        server.createContext("/api/online", new OnlineHandler());
        
        // Настраиваем пул потоков для обработки запросов
        server.setExecutor(java.util.concurrent.Executors.newFixedThreadPool(4));
    }
    
    public void start() {
        server.start();
        plugin.getLogger().info("API Server started on port " + server.getAddress().getPort());
    }
    
    public void stop() {
        server.stop(0);
        plugin.getLogger().info("API Server stopped");
    }
    
    private String createSignature(String timestamp, String secret) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(timestamp.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hash);
        } catch (Exception e) {
            e.printStackTrace();
            return "";
        }
    }
    
    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
    
    private boolean verifySignature(String signature, String timestamp, String secret) {
        String expectedSignature = createSignature(timestamp, secret);
        return MessageDigest.isEqual(
            signature.getBytes(StandardCharsets.UTF_8),
            expectedSignature.getBytes(StandardCharsets.UTF_8)
        );
    }
    
    private class OnlineHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try {
                // Проверяем метод запроса
                if (!exchange.getRequestMethod().equals("GET")) {
                    sendResponse(exchange, 405, "Method Not Allowed");
                    return;
                }
                
                // Получаем и проверяем подпись
                String timestamp = exchange.getRequestHeaders().getFirst("X-Timestamp");
                String signature = exchange.getRequestHeaders().getFirst("X-Signature");
                
                if (timestamp == null || signature == null) {
                    sendResponse(exchange, 401, "Unauthorized");
                    return;
                }
                
                if (!verifySignature(signature, timestamp, apiSecret)) {
                    sendResponse(exchange, 401, "Unauthorized");
                    return;
                }
                
                // Формируем ответ с данными
                JSONObject response = new JSONObject();
                response.put("online", Bukkit.getOnlinePlayers().size());
                response.put("server_name", plugin.getServer().getName());
                response.put("server_version", Bukkit.getVersion());
                
                // Создаем подпись для ответа
                String responseTimestamp = String.valueOf(System.currentTimeMillis());
                String responseSignature = createSignature(responseTimestamp, apiSecret);
                
                // Отправляем ответ с подписью
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.getResponseHeaders().set("X-Timestamp", responseTimestamp);
                exchange.getResponseHeaders().set("X-Signature", responseSignature);
                
                sendResponse(exchange, 200, response.toJSONString());
                
            } catch (Exception e) {
                plugin.getLogger().severe("Error handling request: " + e.getMessage());
                e.printStackTrace();
                sendResponse(exchange, 500, "Internal Server Error");
            }
        }
        
        private void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
            exchange.sendResponseHeaders(statusCode, response.length());
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}
```

## Использование в основном классе плагина

```java
package ru.eternalcore.plugin;

import org.bukkit.plugin.java.JavaPlugin;

public class EternalCorePlugin extends JavaPlugin {
    private WebApiHandler apiHandler;

    @Override
    public void onEnable() {
        // Загружаем конфигурацию
        saveDefaultConfig();
        
        String apiSecret = getConfig().getString("api.secret", "your_super_secure_secret_key_change_in_production");
        int apiPort = getConfig().getInt("api.port", 25567);
        
        try {
            // Инициализируем и запускаем API сервер
            apiHandler = new WebApiHandler(this, apiSecret, apiPort);
            apiHandler.start();
            getLogger().info("Web API started on port " + apiPort);
        } catch (Exception e) {
            getLogger().severe("Failed to start Web API: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void onDisable() {
        // Останавливаем API сервер при выключении плагина
        if (apiHandler != null) {
            apiHandler.stop();
        }
    }
}
```

## Конфигурация плагина (config.yml)

```yaml
# Настройки API для связи с сайтом
api:
  # Секретный ключ (должен совпадать с ключом на сайте)
  secret: "your_super_secure_secret_key_change_in_production"
  # Порт для API (по умолчанию 25567)
  port: 25567
```

## Следующие шаги

1. Создайте новый плагин или добавьте код API в ваш существующий плагин.
2. Используйте приведенный выше код в качестве основы.
3. Создайте эндпоинт `/api/online` для возврата количества игроков онлайн.
4. Убедитесь, что секретный ключ в плагине совпадает с ключом на сайте.
5. Запустите плагин на порту 25567 (или другом, если предпочитаете).
6. Проверьте, что сайт может получать информацию о количестве игроков онлайн.

## Безопасность

1. Используйте сложный и уникальный секретный ключ.
2. Храните секретный ключ в безопасном месте.
3. Используйте файрвол, чтобы разрешить доступ к порту API только с IP-адреса вашего веб-сервера.
4. Регулярно проверяйте логи на подозрительную активность.
5. Обновляйте плагин при обнаружении уязвимостей. 