package dev.nefor.webhooker.util;

import dev.nefor.webhooker.Main;

/**
 * Класс для интеграции с плагином LiteBans
 */
public class LitebansManager {
    
    private final Main plugin;
    private final WebhookManager webhookManager;
    private final StaffLogger staffLogger;
    private boolean enabled;
    
    /**
     * Создает новый экземпляр LitebansManager
     * @param plugin главный класс плагина
     * @param webhookManager менеджер вебхуков
     * @param staffLogger логгер персонала
     */
    public LitebansManager(Main plugin, WebhookManager webhookManager, StaffLogger staffLogger) {
        this.plugin = plugin;
        this.webhookManager = webhookManager;
        this.staffLogger = staffLogger;
        this.enabled = plugin.getConfig().getBoolean("litebans.enabled", true);
    }
    
    /**
     * Проверяет, включена ли интеграция
     * @return true если интеграция включена
     */
    public boolean isEnabled() {
        return enabled;
    }
    
    /**
     * Включает/выключает интеграцию
     * @param enabled состояние (включено/выключено)
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Обрабатывает событие бана
     * @param staffName имя сотрудника, выдавшего бан
     * @param targetName имя игрока, получившего бан
     * @param reason причина бана
     * @param duration продолжительность бана
     */
    public void handleBan(String staffName, String targetName, String reason, String duration) {
        if (!isEnabled()) {
            return;
        }
        
        staffLogger.logStaffActivity(staffName, "ban", targetName, duration, reason);
    }
    
    /**
     * Обрабатывает событие мута
     * @param staffName имя сотрудника, выдавшего мут
     * @param targetName имя игрока, получившего мут
     * @param reason причина мута
     * @param duration продолжительность мута
     */
    public void handleMute(String staffName, String targetName, String reason, String duration) {
        if (!isEnabled()) {
            return;
        }
        
        staffLogger.logStaffActivity(staffName, "mute", targetName, duration, reason);
    }
    
    /**
     * Обрабатывает событие кика
     * @param staffName имя сотрудника, выполнившего кик
     * @param targetName имя кикнутого игрока
     * @param reason причина кика
     */
    public void handleKick(String staffName, String targetName, String reason) {
        if (!isEnabled()) {
            return;
        }
        
        staffLogger.logStaffActivity(staffName, "kick", targetName, null, reason);
    }
    
    /**
     * Обрабатывает событие предупреждения
     * @param staffName имя сотрудника, выдавшего предупреждение
     * @param targetName имя игрока, получившего предупреждение
     * @param reason причина предупреждения
     */
    public void handleWarn(String staffName, String targetName, String reason) {
        if (!isEnabled()) {
            return;
        }
        
        staffLogger.logStaffActivity(staffName, "warn", targetName, null, reason);
    }
}
