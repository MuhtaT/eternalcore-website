package dev.nefor.webhooker.util;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dev.nefor.webhooker.Main;
import net.luckperms.api.model.user.User;
import org.bukkit.advancement.Advancement;
import org.bukkit.advancement.AdvancementProgress;
import org.bukkit.entity.Player;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;

/**
 * Менеджер для интеграции профилей игроков с сайтом
 */
public class ProfileManager {
    
    private final Main plugin;
    private final ApiClient apiClient;
    private final Gson gson;
    private final Map<String, Long> lastUpdateTime;
    private final Map<String, Integer> lastBalanceMap;
    private final Map<String, Integer> totalDonatedMap;
    private boolean enabled;
    
    /**
     * Создает новый экземпляр ProfileManager
     * @param plugin главный класс плагина
     * @param apiClient API клиент для отправки запросов
     */
    public ProfileManager(Main plugin, ApiClient apiClient) {
        this.plugin = plugin;
        this.apiClient = apiClient;
        this.gson = new Gson();
        this.lastUpdateTime = new ConcurrentHashMap<>();
        this.lastBalanceMap = new ConcurrentHashMap<>();
        this.totalDonatedMap = new ConcurrentHashMap<>();
        this.enabled = plugin.getConfig().getBoolean("profile.enabled", true);
    }
    
    /**
     * Проверяет, включена ли интеграция профилей
     * @return true если интеграция включена
     */
    public boolean isEnabled() {
        return enabled;
    }
    
    /**
     * Включает или выключает интеграцию профилей
     * @param enabled новое состояние
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Проверяет код авторизации и привязывает аккаунт Minecraft к аккаунту на сайте
     * @param player игрок Minecraft
     * @param authCode код авторизации, введенный игроком
     * @return результат проверки в формате JsonObject
     */
    public JsonObject verifyAuthCode(Player player, String authCode) {
        if (!isEnabled()) {
            JsonObject result = new JsonObject();
            result.addProperty("success", false);
            result.addProperty("message", "Интеграция профилей отключена на сервере");
            return result;
        }
        
        try {
            Map<String, String> params = new HashMap<>();
            params.put("code", authCode);
            params.put("username", player.getName());
            
            plugin.getLogger().info("Отправка запроса на проверку кода для игрока " + player.getName() + " с кодом " + authCode);
            
            String response = apiClient.sendGetRequest("/minecraft/auth/verify", params);
            
            plugin.getLogger().info("Ответ от сервера: " + response);
            
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            if (jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean()) {
                plugin.getLogger().info("Игрок " + player.getName() + " успешно привязал аккаунт к сайту");
            } else {
                if (jsonResponse.has("message")) {
                    plugin.getLogger().warning("Неудачная попытка привязки аккаунта для игрока " + player.getName() + ": " + jsonResponse.get("message").getAsString());
                } else {
                    plugin.getLogger().warning("Неудачная попытка привязки аккаунта для игрока " + player.getName() + " без указания причины");
                }
            }
            
            return jsonResponse;
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при проверке кода авторизации для игрока " + player.getName(), e);
            
            JsonObject result = new JsonObject();
            result.addProperty("success", false);
            result.addProperty("message", "Ошибка соединения с сайтом: " + e.getMessage());
            return result;
        }
    }
    
    /**
     * Обновляет данные игрока на сайте
     * @param player игрок, данные которого нужно обновить
     * @return true если обновление успешно, false в случае ошибки
     */
    public boolean updatePlayerProfile(Player player) {
        if (!isEnabled()) {
            return false;
        }
        
        // Проверяем, не слишком ли часто обновляем данные этого игрока
        String playerName = player.getName();
        long currentTime = System.currentTimeMillis();
        long updateInterval = plugin.getConfig().getLong("profile.update_interval", 300000); // 5 минут по умолчанию
        
        if (lastUpdateTime.containsKey(playerName)) {
            long lastUpdate = lastUpdateTime.get(playerName);
            if (currentTime - lastUpdate < updateInterval) {
                return true; // Слишком рано для обновления
            }
        }
        
        try {
            // Получаем данные игрока
            long lastOnline = System.currentTimeMillis() / 1000;
            int playtimeMinutes = getPlayerPlaytime(player);
            int achievementsCount = getPlayerAchievements(player);
            int balance = getPlayerBalance(player);
            String privilege = getPlayerPrivilege(player);
            int totalDonated = calculateTotalDonated(player, balance);
            
            // Формируем JSON с данными
            JsonObject data = new JsonObject();
            data.addProperty("minecraft_username", playerName);
            data.addProperty("last_online", lastOnline);
            data.addProperty("playtime_minutes", playtimeMinutes);
            data.addProperty("achievements_count", achievementsCount);
            data.addProperty("balance", balance);
            data.addProperty("privilege", privilege);
            data.addProperty("total_donated", totalDonated);
            
            String jsonBody = gson.toJson(data);
            String response = apiClient.sendPostRequest("/minecraft/update", jsonBody);
            JsonObject jsonResponse = gson.fromJson(response, JsonObject.class);
            
            boolean success = jsonResponse.has("success") && jsonResponse.get("success").getAsBoolean();
            
            if (success) {
                // Обновляем время последнего обновления
                lastUpdateTime.put(playerName, currentTime);
                // Обновляем последний известный баланс
                lastBalanceMap.put(playerName, balance);
                // Сохраняем общую сумму доната
                totalDonatedMap.put(playerName, totalDonated);
                
                plugin.getLogger().fine("Профиль игрока " + playerName + " успешно обновлен на сайте");
            } else {
                plugin.getLogger().warning("Не удалось обновить профиль игрока " + playerName + " на сайте: " + 
                                        (jsonResponse.has("message") ? jsonResponse.get("message").getAsString() : "неизвестная ошибка"));
            }
            
            return success;
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при обновлении профиля игрока " + playerName, e);
            return false;
        }
    }
    
    /**
     * Обновляет профили всех онлайн-игроков
     */
    public void updateAllOnlineProfiles() {
        if (!isEnabled()) {
            return;
        }
        
        plugin.getLogger().fine("Запуск обновления профилей всех онлайн-игроков...");
        
        plugin.getServer().getOnlinePlayers().forEach(player -> {
            try {
                updatePlayerProfile(player);
            } catch (Exception e) {
                plugin.getLogger().log(Level.WARNING, "Ошибка при обновлении профиля игрока " + player.getName(), e);
            }
        });
    }
    
    /**
     * Получает игровое время игрока в минутах
     * @param player игрок
     * @return игровое время в минутах
     */
    private int getPlayerPlaytime(Player player) {
        try {
            // Получение статистики через Bukkit API
            long ticksPlayed = player.getStatistic(org.bukkit.Statistic.PLAY_ONE_MINUTE); // В тиках
            return (int) (ticksPlayed / (20 * 60)); // Конвертируем в минуты (20 тиков = 1 секунда)
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при получении игрового времени для " + player.getName(), e);
            return 0;
        }
    }
    
    /**
     * Получает количество достижений (advancements) игрока в Minecraft
     * @param player игрок
     * @return количество полученных достижений
     */
    private int getPlayerAchievements(Player player) {
        try {
            AtomicInteger count = new AtomicInteger(0);
            
            // Итерируемся по всем достижениям и считаем выполненные
            plugin.getServer().advancementIterator().forEachRemaining(advancement -> {
                AdvancementProgress progress = player.getAdvancementProgress(advancement);
                if (progress.isDone()) {
                    // Увеличиваем счетчик, если достижение получено
                    count.incrementAndGet();
                }
            });
            
            return count.get();
        } catch (Exception e) {
            plugin.getLogger().log(Level.WARNING, "Ошибка при получении достижений для " + player.getName(), e);
            return 0;
        }
    }
    
    /**
     * Получает баланс игрока из плагина PlayerPoints
     * @param player игрок
     * @return баланс игрока или 0, если API недоступно
     */
    private int getPlayerBalance(Player player) {
        // Проверяем, подключен ли PlayerPoints
        if (plugin.isPlayerPointsEnabled() && plugin.getPlayerPointsAPI() != null) {
            try {
                // Получаем баланс через API PlayerPoints
                return plugin.getPlayerPointsAPI().look(player.getUniqueId());
            } catch (Exception e) {
                plugin.getLogger().log(Level.WARNING, "Ошибка при получении баланса PlayerPoints для " + player.getName(), e);
            }
        }
        
        // Если PlayerPoints не доступен или произошла ошибка, возвращаем 0
        return 0;
    }
    
    /**
     * Получает название привилегии (группы) игрока из LuckPerms
     * @param player игрок
     * @return название группы или "DEFAULT", если API недоступно
     */
    private String getPlayerPrivilege(Player player) {
        // Проверяем, подключен ли LuckPerms
        if (plugin.isLuckPermsEnabled() && plugin.getLuckPermsAPI() != null) {
            try {
                // Получаем пользователя LuckPerms
                User user = plugin.getLuckPermsAPI().getUserManager().getUser(player.getUniqueId());
                if (user != null) {
                    // Получаем основную группу
                    String primaryGroup = user.getPrimaryGroup();
                    if (primaryGroup != null && !primaryGroup.isEmpty()) {
                        return primaryGroup;
                    }
                }
            } catch (Exception e) {
                plugin.getLogger().log(Level.WARNING, "Ошибка при получении группы LuckPerms для " + player.getName(), e);
            }
        }
        
        // Если LuckPerms не доступен, группа не найдена или произошла ошибка, возвращаем DEFAULT
        return "default";
    }
    
    /**
     * Рассчитывает общую сумму доната игрока на основе изменений баланса
     * @param player игрок
     * @param currentBalance текущий баланс игрока
     * @return общая сумма доната
     */
    private int calculateTotalDonated(Player player, int currentBalance) {
        String playerName = player.getName();
        
        // Если у нас нет предыдущего баланса или общей суммы доната для этого игрока, инициализируем значения
        if (!lastBalanceMap.containsKey(playerName)) {
            lastBalanceMap.put(playerName, currentBalance);
            totalDonatedMap.put(playerName, 0);
            return 0;
        }
        
        // Получаем последний известный баланс
        int lastBalance = lastBalanceMap.get(playerName);
        // Получаем последнюю известную сумму доната
        int currentTotalDonated = totalDonatedMap.getOrDefault(playerName, 0);
        
        // Если текущий баланс больше предыдущего, добавляем разницу к общей сумме доната
        if (currentBalance > lastBalance) {
            int difference = currentBalance - lastBalance;
            currentTotalDonated += difference;
        }
        
        return currentTotalDonated;
    }
} 