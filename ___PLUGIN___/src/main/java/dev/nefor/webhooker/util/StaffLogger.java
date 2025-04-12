package dev.nefor.webhooker.util;

import dev.nefor.webhooker.Main;
import org.bukkit.entity.Player;

/**
 * Класс для отслеживания действий персонала
 */
public class StaffLogger {
    
    private final Main plugin;
    private final WebhookManager webhookManager;
    
    /**
     * Создает новый экземпляр StaffLogger
     * @param plugin главный класс плагина
     * @param webhookManager менеджер вебхуков
     */
    public StaffLogger(Main plugin, WebhookManager webhookManager) {
        this.plugin = plugin;
        this.webhookManager = webhookManager;
    }
    
    /**
     * Проверяет, является ли игрок персоналом
     * @param player игрок для проверки
     * @return true если игрок является персоналом
     */
    public boolean isStaff(Player player) {
        String permission = plugin.getConfig().getString("staff.permission", "webhooker.staff");
        return player.hasPermission(permission);
    }
    
    /**
     * Отправляет информацию о подключении персонала
     * @param player игрок, совершивший вход
     * @return true если операция успешна
     */
    public boolean logStaffJoin(Player player) {
        if (!isStaff(player)) {
            return false;
        }
        
        if (!plugin.getConfig().getBoolean("staff.track_connections", true)) {
            return false;
        }
        
        return webhookManager.sendStaffConnection(player.getName(), true);
    }
    
    /**
     * Отправляет информацию о отключении персонала
     * @param player игрок, совершивший выход
     * @return true если операция успешна
     */
    public boolean logStaffLeave(Player player) {
        if (!isStaff(player)) {
            return false;
        }
        
        if (!plugin.getConfig().getBoolean("staff.track_connections", true)) {
            return false;
        }
        
        return webhookManager.sendStaffConnection(player.getName(), false);
    }
    
    /**
     * Отправляет информацию о действии персонала
     * @param staffName имя сотрудника
     * @param actionType тип действия
     * @param targetName имя цели
     * @param duration продолжительность (опционально)
     * @param reason причина (опционально)
     * @return true если операция успешна
     */
    public boolean logStaffActivity(String staffName, String actionType, String targetName, String duration, String reason) {
        if (!plugin.getConfig().getBoolean("staff.track_activity", true)) {
            return false;
        }
        
        return webhookManager.sendStaffActivity(staffName, actionType, targetName, duration, reason);
    }
}
