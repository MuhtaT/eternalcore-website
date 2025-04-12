package dev.nefor.webhooker.listeners.bukkit;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.StaffLogger;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerQuitEvent;

/**
 * Слушатель события выхода персонала с сервера
 */
public class StaffLeaveListener implements Listener {
    
    private final Main plugin;
    private final StaffLogger staffLogger;
    
    /**
     * Создает новый слушатель выхода персонала
     * @param plugin главный класс плагина
     * @param staffLogger логгер персонала
     */
    public StaffLeaveListener(Main plugin, StaffLogger staffLogger) {
        this.plugin = plugin;
        this.staffLogger = staffLogger;
    }
    
    /**
     * Обрабатывает событие выхода игрока с сервера
     * @param event событие выхода
     */
    @EventHandler
    public void onPlayerQuit(PlayerQuitEvent event) {
        Player player = event.getPlayer();
        
        // Проверяем, является ли игрок персоналом и отправляем данные асинхронно
        if (staffLogger.isStaff(player)) {
            plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                staffLogger.logStaffLeave(player);
            });
        }
    }
}
