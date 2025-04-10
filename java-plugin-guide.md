# Руководство по разработке плагина для интеграции с сайтом EternalCore

Это руководство поможет вам создать Java-плагин для интеграции вашего Minecraft-сервера с веб-сайтом EternalCore.

Создайте новый проект для Spigot/Paper-плагина. Вы можете использовать Maven или Gradle.

### Maven pom.xml (фрагмент)

```xml
<dependencies>
    <!-- Spigot API -->
    <dependency>
        <groupId>org.spigotmc</groupId>
        <artifactId>spigot-api</artifactId>
        <version>1.19.4-R0.1-SNAPSHOT</version>
        <scope>provided</scope>
    </dependency>
    
    <!-- Apache HttpClient для HTTP-запросов -->
    <dependency>
        <groupId>org.apache.httpcomponents</groupId>
        <artifactId>httpclient</artifactId>
        <version>4.5.14</version>
    </dependency>
    
    <!-- JSON-обработка -->
    <dependency>
        <groupId>com.google.code.gson</groupId>
        <artifactId>gson</artifactId>
        <version>2.10.1</version>
    </dependency>
</dependencies>
```

### plugin.yml

```yaml
name: EternalCoreIntegration
version: 1.0.0
main: ru.eternalcore.integration.EternalCoreIntegration
api-version: 1.19
author: [YourName]
description: Интеграция сервера с сайтом EternalCore
commands:
  eternalintegration:
    description: Команды для управления интеграцией
    aliases: [eci]
    permission: eternalcore.admin
```

## 2. Класс для API-аутентификации

Создайте класс для обработки API-аутентификации:

```java
package ru.eternalcore.integration.api;

import org.apache.http.client.utils.URIBuilder;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.Formatter;
import java.util.HashMap;
import java.util.Map;

public class ApiAuth {
    private final String apiSecretKey;
    private final String webhookSecretKey;
    
    public ApiAuth(String apiSecretKey, String webhookSecretKey) {
        this.apiSecretKey = apiSecretKey;
        this.webhookSecretKey = webhookSecretKey;
    }
    
    /**
     * Генерирует HMAC подпись для запроса
     */
    public String generateSignature(String payload, long timestamp, String key) {
        String data = timestamp + "." + payload;
        
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            
            // Форматирование в HEX
            try (Formatter formatter = new Formatter()) {
                for (byte b : hmacData) {
                    formatter.format("%02x", b);
                }
                return formatter.toString();
            }
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Ошибка при генерации подписи", e);
        }
    }
    
    /**
     * Создает заголовки для API запроса
     */
    public Map<String, String> createAuthHeaders(String queryParams) {
        long timestamp = Instant.now().getEpochSecond();
        String signature = generateSignature(queryParams, timestamp, webhookSecretKey);
        
        Map<String, String> headers = new HashMap<>();
        headers.put("x-eternalcore-signature", signature);
        headers.put("x-eternalcore-timestamp", String.valueOf(timestamp));
        headers.put("Content-Type", "application/json");
        
        return headers;
    }
    
    /**
     * Создает URL с параметрами запроса
     */
    public String createRequestUrl(String baseUrl, Map<String, String> params) {
        try {
            URIBuilder builder = new URIBuilder(baseUrl);
            
            // Добавляем все параметры
            for (Map.Entry<String, String> entry : params.entrySet()) {
                builder.addParameter(entry.getKey(), entry.getValue());
            }
            
            return builder.build().toString();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при создании URL", e);
        }
    }
}
```

## 3. Класс для HTTP-запросов

```java
package ru.eternalcore.integration.api;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Map;

public class ApiClient {
    private final String baseUrl;
    private final ApiAuth apiAuth;
    private final HttpClient httpClient;
    
    public ApiClient(String baseUrl, ApiAuth apiAuth) {
        this.baseUrl = baseUrl;
        this.apiAuth = apiAuth;
        this.httpClient = HttpClients.createDefault();
    }
    
    /**
     * Отправляет POST запрос
     */
    public String sendPostRequest(String endpoint, Map<String, String> params) throws IOException {
        String url = baseUrl + endpoint;
        String queryString = apiAuth.createRequestUrl("", params).substring(1); // Убираем начальный "?"
        Map<String, String> headers = apiAuth.createAuthHeaders(queryString);
        
        HttpPost httpPost = new HttpPost(url + "?" + queryString);
        
        // Добавляем заголовки аутентификации
        for (Map.Entry<String, String> header : headers.entrySet()) {
            httpPost.addHeader(header.getKey(), header.getValue());
        }
        
        HttpResponse response = httpClient.execute(httpPost);
        return EntityUtils.toString(response.getEntity());
    }
    
    /**
     * Отправляет GET запрос
     */
    public String sendGetRequest(String endpoint, Map<String, String> params) throws IOException {
        String queryString = apiAuth.createRequestUrl("", params).substring(1); // Убираем начальный "?"
        String url = baseUrl + endpoint + "?" + queryString;
        Map<String, String> headers = apiAuth.createAuthHeaders(queryString);
        
        HttpGet httpGet = new HttpGet(url);
        
        // Добавляем заголовки аутентификации
        for (Map.Entry<String, String> header : headers.entrySet()) {
            httpGet.addHeader(header.getKey(), header.getValue());
        }
        
        HttpResponse response = httpClient.execute(httpGet);
        return EntityUtils.toString(response.getEntity());
    }
}
```

## 4. Основной класс плагина

```java
package ru.eternalcore.integration;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;
import ru.eternalcore.integration.api.ApiAuth;
import ru.eternalcore.integration.api.ApiClient;
import ru.eternalcore.integration.commands.AdminCommand;

import java.io.IOException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;

public class EternalCoreIntegration extends JavaPlugin implements Listener {
    private ApiAuth apiAuth;
    private ApiClient apiClient;
    private final Gson gson = new Gson();
    
    @Override
    public void onEnable() {
        // Сохраняем файл конфигурации, если его нет
        saveDefaultConfig();
        FileConfiguration config = getConfig();
        
        // Инициализация API клиента
        String apiUrl = config.getString("api.url", "https://eternalcore.ru/api");
        String apiKey = config.getString("api.key", "");
        String webhookKey = config.getString("api.webhook_key", "");
        
        if (apiKey.isEmpty() || webhookKey.isEmpty()) {
            getLogger().severe("API ключи не настроены в конфигурации! Плагин не будет работать корректно.");
        }
        
        apiAuth = new ApiAuth(apiKey, webhookKey);
        apiClient = new ApiClient(apiUrl, apiAuth);
        
        // Регистрация обработчиков событий
        getServer().getPluginManager().registerEvents(this, this);
        
        // Регистрация команд
        getCommand("eternalintegration").setExecutor(new AdminCommand(this));
        
        // Запуск задачи отправки метрик онлайна
        startOnlineMetricsTask();
        
        getLogger().info("Плагин интеграции EternalCore успешно запущен!");
    }
    
    @Override
    public void onDisable() {
        getLogger().info("Плагин интеграции EternalCore выключен.");
    }
    
    /**
     * Начинает отправку метрик онлайна на сайт
     */
    private void startOnlineMetricsTask() {
        int interval = getConfig().getInt("metrics.interval", 60); // Интервал в секундах
        
        new BukkitRunnable() {
            @Override
            public void run() {
                try {
                    sendOnlineMetrics();
                } catch (Exception e) {
                    getLogger().log(Level.WARNING, "Ошибка при отправке метрик онлайна", e);
                }
            }
        }.runTaskTimerAsynchronously(this, 20 * 10, 20 * interval); // Запуск через 10 секунд, повтор каждые interval секунд
    }
    
    /**
     * Отправляет текущий онлайн на сайт
     */
    public void sendOnlineMetrics() throws IOException {
        int onlinePlayers = getServer().getOnlinePlayers().size();
        long timestamp = Instant.now().getEpochSecond();
        
        Map<String, String> params = new HashMap<>();
        params.put("online", String.valueOf(onlinePlayers));
        params.put("timestamp", String.valueOf(timestamp));
        
        String response = apiClient.sendPostRequest("/webhook/metrics/online", params);
        JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
        
        if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
            getLogger().fine("Метрики онлайна успешно отправлены: " + onlinePlayers + " игроков");
        } else {
            getLogger().warning("Ошибка при отправке метрик онлайна: " + response);
        }
    }
    
    /**
     * Отправляет информацию о детекте античита
     */
    public void sendAnticheatDetection(String player, String type, String description, int level, String action) {
        try {
            long timestamp = Instant.now().getEpochSecond();
            
            Map<String, String> params = new HashMap<>();
            params.put("player", player);
            params.put("type", type);
            params.put("description", description);
            params.put("level", String.valueOf(level));
            params.put("timestamp", String.valueOf(timestamp));
            params.put("action", action);
            
            String response = apiClient.sendPostRequest("/webhook/detect", params);
            getLogger().info("Отправлен детект античита: " + response);
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Ошибка при отправке детекта античита", e);
        }
    }
    
    /**
     * Отправляет информацию о действии персонала (бан, мут, кик и т.д.)
     */
    public void sendStaffActivity(String staff, String type, String target, String duration, String reason) {
        try {
            long timestamp = Instant.now().getEpochSecond();
            
            Map<String, String> params = new HashMap<>();
            params.put("staff", staff);
            params.put("type", type);
            params.put("target", target);
            params.put("timestamp", String.valueOf(timestamp));
            
            if (duration != null) {
                params.put("duration", duration);
            }
            
            if (reason != null) {
                params.put("reason", reason);
            }
            
            String response = apiClient.sendPostRequest("/webhook/staffwork/activity", params);
            getLogger().info("Отправлена активность персонала: " + response);
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Ошибка при отправке активности персонала", e);
        }
    }
    
    /**
     * Отправляет информацию о входе/выходе персонала
     */
    public void sendStaffConnection(String name, boolean isJoin) {
        try {
            long timestamp = Instant.now().getEpochSecond();
            String action = isJoin ? "join" : "leave";
            
            Map<String, String> params = new HashMap<>();
            params.put("name", name);
            params.put("timestamp", String.valueOf(timestamp));
            
            String response = apiClient.sendPostRequest("/webhook/staffwork/" + action, params);
            getLogger().info("Отправлено " + action + " персонала: " + response);
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Ошибка при отправке " + (isJoin ? "входа" : "выхода") + " персонала", e);
        }
    }
    
    /**
     * Отправляет лог сервера
     */
    public void sendServerLog(String type, Map<String, String> logData) {
        try {
            long timestamp = Instant.now().getEpochSecond();
            
            Map<String, String> params = new HashMap<>(logData);
            params.put("type", type);
            params.put("timestamp", String.valueOf(timestamp));
            
            String response = apiClient.sendPostRequest("/webhook/logs", params);
            getLogger().fine("Отправлен лог сервера: " + response);
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Ошибка при отправке лога сервера", e);
        }
    }
    
    /**
     * Получает данные с сайта
     */
    public String getDataFromWebsite(String dataType) {
        try {
            Map<String, String> params = new HashMap<>();
            params.put("type", dataType);
            
            return apiClient.sendGetRequest("/server/data", params);
        } catch (Exception e) {
            getLogger().log(Level.WARNING, "Ошибка при получении данных с сайта", e);
            return null;
        }
    }
    
    // Обработчики событий для демонстрации
    
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        // Проверяем, является ли игрок персоналом
        if (event.getPlayer().hasPermission("eternalcore.staff")) {
            // Асинхронно отправляем данные о входе персонала
            getServer().getScheduler().runTaskAsynchronously(this, () -> {
                sendStaffConnection(event.getPlayer().getName(), true);
            });
        }
    }
    
    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        // Проверяем, является ли игрок персоналом
        if (event.getPlayer().hasPermission("eternalcore.staff")) {
            // Асинхронно отправляем данные о выходе персонала
            getServer().getScheduler().runTaskAsynchronously(this, () -> {
                sendStaffConnection(event.getPlayer().getName(), false);
            });
        }
    }
    
    // Геттеры
    public ApiClient getApiClient() {
        return apiClient;
    }
}
```

## 5. Класс команды администратора

```java
package ru.eternalcore.integration.commands;

import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import ru.eternalcore.integration.EternalCoreIntegration;

public class AdminCommand implements CommandExecutor {
    private final EternalCoreIntegration plugin;
    
    public AdminCommand(EternalCoreIntegration plugin) {
        this.plugin = plugin;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            showHelp(sender);
            return true;
        }
        
        switch (args[0].toLowerCase()) {
            case "reload":
                plugin.reloadConfig();
                sender.sendMessage(ChatColor.GREEN + "Конфигурация перезагружена!");
                break;
                
            case "test":
                if (args.length < 2) {
                    sender.sendMessage(ChatColor.RED + "Использование: /eci test <endpoint>");
                    return true;
                }
                
                testEndpoint(sender, args[1]);
                break;
                
            case "getdata":
                if (args.length < 2) {
                    sender.sendMessage(ChatColor.RED + "Использование: /eci getdata <тип>");
                    sender.sendMessage(ChatColor.GRAY + "Доступные типы: donate_packages, privileges, online_metrics, anticheat, staff_activity, staff_connections, all");
                    return true;
                }
                
                getDataFromWebsite(sender, args[1]);
                break;
                
            default:
                showHelp(sender);
                break;
        }
        
        return true;
    }
    
    private void showHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== EternalCore Integration ===");
        sender.sendMessage(ChatColor.YELLOW + "/eci reload " + ChatColor.WHITE + "- Перезагрузить конфигурацию");
        sender.sendMessage(ChatColor.YELLOW + "/eci test <endpoint> " + ChatColor.WHITE + "- Тестировать эндпоинт");
        sender.sendMessage(ChatColor.YELLOW + "/eci getdata <тип> " + ChatColor.WHITE + "- Получить данные с сайта");
    }
    
    private void testEndpoint(CommandSender sender, String endpoint) {
        sender.sendMessage(ChatColor.YELLOW + "Тестирование эндпоинта " + endpoint + "...");
        
        // Запуск асинхронно
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            try {
                switch (endpoint) {
                    case "online":
                        plugin.sendOnlineMetrics();
                        break;
                        
                    case "anticheat":
                        String playerName = sender instanceof Player ? sender.getName() : "Console";
                        plugin.sendAnticheatDetection(playerName, "TEST", "Тестовый детект", 1, "NONE");
                        break;
                        
                    case "staffactivity":
                        String staffName = sender instanceof Player ? sender.getName() : "Console";
                        plugin.sendStaffActivity(staffName, "TEST", "TestTarget", "0", "Тестовая активность");
                        break;
                        
                    default:
                        sender.sendMessage(ChatColor.RED + "Неизвестный эндпоинт: " + endpoint);
                        return;
                }
                
                sender.sendMessage(ChatColor.GREEN + "Тест успешно выполнен!");
            } catch (Exception e) {
                sender.sendMessage(ChatColor.RED + "Ошибка при тестировании: " + e.getMessage());
            }
        });
    }
    
    private void getDataFromWebsite(CommandSender sender, String dataType) {
        sender.sendMessage(ChatColor.YELLOW + "Получение данных с сайта...");
        
        // Запуск асинхронно
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            try {
                String data = plugin.getDataFromWebsite(dataType);
                
                if (data != null) {
                    sender.sendMessage(ChatColor.GREEN + "Данные успешно получены!");
                    if (sender.hasPermission("eternalcore.admin.debug")) {
                        sender.sendMessage(ChatColor.GRAY + "Ответ: " + data);
                    }
                } else {
                    sender.sendMessage(ChatColor.RED + "Не удалось получить данные. Проверьте консоль для подробностей.");
                }
            } catch (Exception e) {
                sender.sendMessage(ChatColor.RED + "Ошибка при получении данных: " + e.getMessage());
            }
        });
    }
}
```

## 6. Файлы конфигурации

### config.yml

```yaml
# Конфигурация плагина интеграции EternalCore

# Настройки API
api:
  # URL API сайта
  url: "https://eternalcore.ru/api"
  # API ключ для запросов
  key: "lYQOi8n0DJdQx9TwF1A4JpTrvfbsUEP7"
  webhook_key: "VnYswOTnL5N2YAkQ1TnKwqhkH3FgXmxb"

# Настройки метрик
metrics:
  # Интервал отправки метрик онлайна (в секундах)
  interval: 60

# Настройки персонала
staff:
  # Разрешение, определяющее персонал
  permission: "eternalcore.staff"
  # Отслеживать подключения/отключения персонала
  track_connections: true
  # Отслеживать активность персонала
  track_activity: true

# Настройки античита
anticheat:
  # Включить отправку детектов античита
  enabled: true
  # Минимальный уровень детекта для отправки
  min_level: 1
```
1. Используйте команду `/eci test online` для проверки отправки данных об онлайне.

## 10. Безопасность

- **Никогда не публикуйте ваши API-ключи** - они должны храниться в секрете.
- Используйте HTTPS для связи с вашим сайтом.
- Регулярно меняйте API-ключи, особенно если есть подозрения на компрометацию.
- Не выдавайте разрешение `eternalcore.admin` обычным игрокам.