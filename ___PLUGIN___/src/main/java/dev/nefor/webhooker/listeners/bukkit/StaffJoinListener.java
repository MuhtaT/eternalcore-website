package dev.nefor.webhooker.listeners.bukkit;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.StaffLogger;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

/**
 * Слушатель события входа персонала на сервер
 */
public class StaffJoinListener implements Listener {
    
    private final Main plugin;
    private final StaffLogger staffLogger;
    
    /**
     * Создает новый слушатель входа персонала
     * @param plugin главный класс плагина
     * @param staffLogger логгер персонала
     */
    public StaffJoinListener(Main plugin, StaffLogger staffLogger) {
        this.plugin = plugin;
        this.staffLogger = staffLogger;
    }
    
    /**
     * Обрабатывает событие входа игрока на сервер
     * @param event событие входа
     */
    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        
        // Проверяем, является ли игрок персоналом и отправляем данные асинхронно
        if (staffLogger.isStaff(player)) {
            plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                staffLogger.logStaffJoin(player);
            });
        }
    }
}
