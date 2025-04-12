package dev.nefor.webhooker.listeners.bukkit;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.ProfileManager;
import net.luckperms.api.event.EventBus;
import net.luckperms.api.event.user.UserDataRecalculateEvent;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;

import java.util.UUID;

/**
 * Слушатель событий для отслеживания изменений групп в LuckPerms
 */
public class LuckPermsListener implements Listener {
    
    private final Main plugin;
    private final ProfileManager profileManager;
    
    /**
     * Создает новый слушатель LuckPerms
     * @param plugin главный класс плагина
     * @param profileManager менеджер профилей
     */
    public LuckPermsListener(Main plugin, ProfileManager profileManager) {
        this.plugin = plugin;
        this.profileManager = profileManager;
        
        // Регистрируем слушатели событий LuckPerms, если плагин доступен
        if (plugin.isLuckPermsEnabled() && plugin.getLuckPermsAPI() != null) {
            registerLuckPermsEvents();
        }
    }
    
    /**
     * Регистрирует слушатели событий LuckPerms
     */
    private void registerLuckPermsEvents() {
        EventBus eventBus = plugin.getLuckPermsAPI().getEventBus();
        
        // Подписываемся на событие пересчета данных пользователя (включая изменение групп)
        eventBus.subscribe(plugin, UserDataRecalculateEvent.class, this::onUserDataRecalculate);
        
        plugin.getLogger().info("Слушатель событий LuckPerms зарегистрирован");
    }
    
    /**
     * Обработчик события пересчета данных пользователя LuckPerms
     * @param event событие пересчета данных
     */
    private void onUserDataRecalculate(UserDataRecalculateEvent event) {
        // Проверяем, включено ли обновление профиля при изменении группы
        if (!plugin.getConfig().getBoolean("profile.luckperms.update_on_change", true)) {
            return;
        }
        
        // Получаем UUID пользователя
        UUID playerId = event.getUser().getUniqueId();
        
        // Получаем онлайн-игрока по UUID
        Player player = Bukkit.getPlayer(playerId);
        
        // Если игрок онлайн, обновляем его профиль
        if (player != null && player.isOnline()) {
            // Асинхронно обновляем профиль
            // Необходимо запустить через Bukkit-планировщик для синхронизации с основным потоком
            plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                try {
                    profileManager.updatePlayerProfile(player);
                    plugin.getLogger().fine("Отправлено обновление профиля после изменения группы игрока " + player.getName());
                } catch (Exception e) {
                    plugin.getLogger().warning("Ошибка при обновлении профиля игрока " + player.getName() + " после изменения группы: " + e.getMessage());
                }
            });
        }
    }
} 