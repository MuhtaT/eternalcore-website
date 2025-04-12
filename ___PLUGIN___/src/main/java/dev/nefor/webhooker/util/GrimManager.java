package dev.nefor.webhooker.util;

import dev.nefor.webhooker.Main;

/**
 * Класс для интеграции с античитом Grim
 */
public class GrimManager {
    
    private final Main plugin;
    private final WebhookManager webhookManager;
    private boolean enabled;
    private int minLevel;
    
    /**
     * Создает новый экземпляр GrimManager
     * @param plugin главный класс плагина
     * @param webhookManager менеджер вебхуков
     */
    public GrimManager(Main plugin, WebhookManager webhookManager) {
        this.plugin = plugin;
        this.webhookManager = webhookManager;
        this.enabled = plugin.getConfig().getBoolean("anticheat.enabled", true);
        this.minLevel = plugin.getConfig().getInt("anticheat.min_level", 1);
    }
    
    /**
     * Проверяет, включена ли интеграция с античитом
     * @return true если интеграция включена
     */
    public boolean isEnabled() {
        return enabled;
    }
    
    /**
     * Устанавливает состояние интеграции
     * @param enabled состояние включено/выключено
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Устанавливает минимальный уровень детекта для отправки
     * @param minLevel минимальный уровень
     */
    public void setMinLevel(int minLevel) {
        this.minLevel = minLevel;
    }
    
    /**
     * Получает минимальный уровень детекта для отправки
     * @return минимальный уровень
     */
    public int getMinLevel() {
        return minLevel;
    }
    
    /**
     * Обрабатывает детект античита от Grim
     * @param playerName имя игрока
     * @param hackType тип чита
     * @param description описание детекта
     * @param level уровень серьезности
     * @param action предпринятое действие
     * @return true если детект был отправлен
     */
    public boolean handleCheatDetection(String playerName, String hackType, String description, int level, String action) {
        if (!isEnabled() || level < minLevel) {
            return false;
        }
        
        return webhookManager.sendAnticheatDetection(playerName, hackType, description, level, action);
    }
}
