package dev.nefor.webhooker.listeners.bukkit;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.ProfileManager;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;

/**
 * Слушатель событий для обновления профилей игроков на сайте
 */
public class ProfileUpdateListener implements Listener {
    
    private final Main plugin;
    private final ProfileManager profileManager;
    
    /**
     * Создает новый слушатель профилей
     * @param plugin главный класс плагина
     * @param profileManager менеджер профилей
     */
    public ProfileUpdateListener(Main plugin, ProfileManager profileManager) {
        this.plugin = plugin;
        this.profileManager = profileManager;
    }
    
    /**
     * Обработчик события входа игрока
     * Запускает асинхронное обновление профиля через некоторое время после входа
     * @param event событие входа
     */
    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        
        // Обновляем профиль с задержкой, чтобы дать время другим плагинам загрузить данные игрока
        plugin.getServer().getScheduler().runTaskLaterAsynchronously(plugin, () -> {
            if (player.isOnline()) {
                profileManager.updatePlayerProfile(player);
                plugin.getLogger().fine("Отправлено обновление профиля при входе игрока " + player.getName());
            }
        }, 60L); // 3 секунды (60 тиков)
    }
    
    /**
     * Обработчик события выхода игрока
     * Обновляет профиль игрока перед выходом
     * @param event событие выхода
     */
    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerQuit(PlayerQuitEvent event) {
        Player player = event.getPlayer();
        
        // Асинхронно обновляем профиль
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            profileManager.updatePlayerProfile(player);
            plugin.getLogger().fine("Отправлено обновление профиля при выходе игрока " + player.getName());
        });
    }
} 