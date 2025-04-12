package dev.nefor.webhooker.listeners.bukkit;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.ProfileManager;
import org.black_ixx.playerpoints.event.PlayerPointsChangeEvent;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;

import java.util.UUID;

/**
 * Слушатель событий для отслеживания изменений баланса PlayerPoints
 */
public class PlayerPointsListener implements Listener {
    
    private final Main plugin;
    private final ProfileManager profileManager;
    
    /**
     * Создает новый слушатель PlayerPoints
     * @param plugin главный класс плагина
     * @param profileManager менеджер профилей
     */
    public PlayerPointsListener(Main plugin, ProfileManager profileManager) {
        this.plugin = plugin;
        this.profileManager = profileManager;
    }
    
    /**
     * Обработчик события изменения баланса игрока
     * @param event событие изменения баланса
     */
    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onPointsChange(PlayerPointsChangeEvent event) {
        // Проверяем, включено ли обновление профиля при изменении баланса
        if (!plugin.getConfig().getBoolean("profile.playerpoints.update_on_change", true)) {
            return;
        }
        
        // Получаем UUID игрока
        UUID playerId = event.getPlayerId();
        
        // Получаем онлайн-игрока по UUID
        Player player = Bukkit.getPlayer(playerId);
        
        // Если игрок онлайн, обновляем его профиль
        if (player != null && player.isOnline()) {
            // Асинхронно обновляем профиль
            plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                try {
                    profileManager.updatePlayerProfile(player);
                    plugin.getLogger().fine("Отправлено обновление профиля после изменения баланса игрока " + player.getName());
                } catch (Exception e) {
                    plugin.getLogger().warning("Ошибка при обновлении профиля игрока " + player.getName() + " после изменения баланса: " + e.getMessage());
                }
            });
        }
    }
} 