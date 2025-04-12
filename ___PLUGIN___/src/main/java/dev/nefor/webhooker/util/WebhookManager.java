package dev.nefor.webhooker.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dev.nefor.webhooker.Main;
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
import java.util.logging.Level;

/**
 * Класс для управления вебхуками и API-запросами
 */
public class WebhookManager {

    private final Main plugin;
    private final ApiClient apiClient;
    private final Gson gson;
    
    /**
     * Создает новый WebhookManager
     * @param plugin ссылка на главный класс плагина
     */
    public WebhookManager(Main plugin) {
        this.plugin = plugin;
        this.gson = new Gson();
        
        String apiUrl = plugin.getConfig().getString("api.url", "https://eternalcore.ru/api");
        String apiKey = plugin.getConfig().getString("api.key", "");
        String webhookKey = plugin.getConfig().getString("api.webhook_key", "");
        
        if (apiKey.isEmpty() || webhookKey.isEmpty()) {
            plugin.getLogger().severe("API ключи не настроены в конфигурации! Плагин не будет работать корректно.");
        }
        
        ApiAuth apiAuth = new ApiAuth(apiKey, webhookKey, plugin);
        apiClient = new ApiClient(apiUrl, apiAuth);
    }
    
    /**
     * Отправляет текущий онлайн на сайт
     * @return true если успешно, false в случае ошибки
     */
    public boolean sendOnlineMetrics() {
        try {
            int onlinePlayers = plugin.getServer().getOnlinePlayers().size();
            long timestamp = Instant.now().getEpochSecond();
            
            Map<String, String> params = new HashMap<>();
            params.put("online", String.valueOf(onlinePlayers));
            params.put("timestamp", String.valueOf(timestamp));
            
            String response = apiClient.sendPostRequest("/webhook/metrics/online", params);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
                plugin.getLogger().fine("Метрики онлайна успешно отправлены: " + onlinePlayers + " игроков");
                return true;
            } else {
                plugin.getLogger().warning("Ошибка при отправке метрик онлайна: " + response);
                return false;
            }
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при отправке метрик онлайна", e);
            return false;
        }
    }
    
    /**
     * Отправляет информацию о детекте античита
     * @param player имя игрока
     * @param type тип нарушения
     * @param description описание
     * @param level уровень серьезности
     * @param action предпринятое действие
     * @return true если успешно, false в случае ошибки
     */
    public boolean sendAnticheatDetection(String player, String type, String description, int level, String action) {
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
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
                plugin.getLogger().info("Отправлен детект античита: " + type + " для игрока " + player);
                return true;
            } else {
                plugin.getLogger().warning("Ошибка при отправке детекта античита: " + response);
                return false;
            }
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при отправке детекта античита", e);
            return false;
        }
    }
    
    /**
     * Отправляет информацию о действии персонала
     * @param staff имя сотрудника
     * @param type тип действия
     * @param target цель действия
     * @param duration продолжительность
     * @param reason причина
     * @return true если успешно, false в случае ошибки
     */
    public boolean sendStaffActivity(String staff, String type, String target, String duration, String reason) {
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
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
                plugin.getLogger().info("Отправлена активность персонала: " + type + " от " + staff);
                return true;
            } else {
                plugin.getLogger().warning("Ошибка при отправке активности персонала: " + response);
                return false;
            }
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при отправке активности персонала", e);
            return false;
        }
    }
    
    /**
     * Отправляет информацию о входе/выходе персонала
     * @param name имя сотрудника
     * @param isJoin true если вход, false если выход
     * @return true если успешно, false в случае ошибки
     */
    public boolean sendStaffConnection(String name, boolean isJoin) {
        try {
            long timestamp = Instant.now().getEpochSecond();
            String action = isJoin ? "join" : "leave";
            
            Map<String, String> params = new HashMap<>();
            params.put("name", name);
            params.put("timestamp", String.valueOf(timestamp));
            
            String response = apiClient.sendPostRequest("/webhook/staffwork/" + action, params);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
                plugin.getLogger().info("Отправлено " + action + " персонала: " + name);
                return true;
            } else {
                plugin.getLogger().warning("Ошибка при отправке " + (isJoin ? "входа" : "выхода") + " персонала: " + response);
                return false;
            }
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при отправке " + (isJoin ? "входа" : "выхода") + " персонала", e);
            return false;
        }
    }
    
    /**
     * Отправляет лог сервера
     * @param type тип лога
     * @param logData данные лога
     * @return true если успешно, false в случае ошибки
     */
    public boolean sendServerLog(String type, Map<String, String> logData) {
        try {
            long timestamp = Instant.now().getEpochSecond();
            
            Map<String, String> params = new HashMap<>(logData);
            params.put("type", type);
            params.put("timestamp", String.valueOf(timestamp));
            
            String response = apiClient.sendPostRequest("/webhook/logs", params);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
                plugin.getLogger().fine("Отправлен лог сервера типа " + type);
                return true;
            } else {
                plugin.getLogger().warning("Ошибка при отправке лога сервера: " + response);
                return false;
            }
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при отправке лога сервера", e);
            return false;
        }
    }
    
    /**
     * Получает данные с сайта
     * @param dataType тип данных
     * @return полученные данные или null в случае ошибки
     */
    public String getDataFromWebsite(String dataType) {
        try {
            Map<String, String> params = new HashMap<>();
            params.put("type", dataType);
            
            return apiClient.sendGetRequest("/server/data", params);
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при получении данных с сайта", e);
            return null;
        }
    }
    
    /**
     * Получает API клиент
     * @return экземпляр API клиента
     */
    public ApiClient getApiClient() {
        return apiClient;
    }
}

/**
 * Класс для аутентификации API запросов
 */
class ApiAuth {
    private final String apiSecretKey;
    private final String webhookSecretKey;
    private final Main plugin;
    
    /**
     * Создает новый экземпляр ApiAuth
     * @param apiSecretKey ключ API
     * @param webhookSecretKey ключ вебхука
     * @param plugin главный класс плагина
     */
    public ApiAuth(String apiSecretKey, String webhookSecretKey, Main plugin) {
        this.apiSecretKey = apiSecretKey;
        this.webhookSecretKey = webhookSecretKey;
        this.plugin = plugin;
    }
    
    /**
     * Генерирует HMAC подпись для запроса
     * @param payload данные запроса
     * @param timestamp временная метка
     * @param key ключ для подписи
     * @return сгенерированная подпись
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
     * @param queryParams параметры запроса
     * @return заголовки запроса
     */
    public Map<String, String> createAuthHeaders(String queryParams) {
        long timestamp = Instant.now().getEpochSecond();
        String signature = generateSignature(queryParams, timestamp, webhookSecretKey);
        
        Map<String, String> headers = new HashMap<>();
        headers.put("x-eternalcore-signature", signature);
        headers.put("x-eternalcore-timestamp", String.valueOf(timestamp));
        headers.put("Content-Type", "application/json");
        
        // Добавим логирование для отладки
        plugin.getLogger().info("Создание заголовков авторизации:");
        plugin.getLogger().info("- Таймстамп: " + timestamp);
        plugin.getLogger().info("- Сигнатура: " + signature);
        plugin.getLogger().info("- Данные для подписи: " + queryParams);
        
        return headers;
    }
    
    /**
     * Создает URL с параметрами запроса
     * @param baseUrl базовый URL
     * @param params параметры запроса
     * @return полный URL с параметрами
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
