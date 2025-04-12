package dev.nefor.webhooker.listeners.grim;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.GrimManager;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

/**
 * Слушатель события автоматического кика от Grim
 * Примечание: этот класс работает только при наличии плагина Grim на сервере
 */
public class KickListener implements Listener {
    
    private final Main plugin;
    private final GrimManager grimManager;
    
    /**
     * Создает новый слушатель киков от античита
     * @param plugin главный класс плагина
     * @param grimManager менеджер Grim
     */
    public KickListener(Main plugin, GrimManager grimManager) {
        this.plugin = plugin;
        this.grimManager = grimManager;
    }
    
    /**
     * Обработчик события кика от Grim
     * Будет реализован при подключении плагина Grim
     * Примерная схема:
     * 
     * @EventHandler
     * public void onGrimKick(GrimKickEvent event) {
     *     // Получаем информацию о кике
     *     String playerName = event.getPlayerName();
     *     String hackType = event.getHackType();
     *     String description = event.getReason();
     *     
     *     // Асинхронно отправляем данные о кике
     *     plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
     *         grimManager.handleCheatDetection(playerName, hackType, description, 5, "KICK");
     *     });
     * }
     */
}
