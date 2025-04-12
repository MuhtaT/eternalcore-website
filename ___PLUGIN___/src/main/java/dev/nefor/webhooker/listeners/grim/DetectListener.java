package dev.nefor.webhooker.listeners.grim;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.GrimManager;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

/**
 * Слушатель события детекта чита от Grim
 * Примечание: этот класс работает только при наличии плагина Grim на сервере
 */
public class DetectListener implements Listener {
    
    private final Main plugin;
    private final GrimManager grimManager;
    
    /**
     * Создает новый слушатель детектов
     * @param plugin главный класс плагина
     * @param grimManager менеджер Grim
     */
    public DetectListener(Main plugin, GrimManager grimManager) {
        this.plugin = plugin;
        this.grimManager = grimManager;
    }
    
    /**
     * Обработчик события детекта от Grim
     * Будет реализован при подключении плагина Grim
     * Примерная схема:
     * 
     * @EventHandler
     * public void onGrimDetection(GrimDetectionEvent event) {
     *     // Получаем информацию о детекте
     *     String playerName = event.getPlayer().getName();
     *     String hackType = event.getHackType();
     *     String description = event.getDescription();
     *     int level = event.getLevel();
     *     String action = event.getAction(); // "NONE", "KICK", "BAN", etc.
     *     
     *     // Асинхронно отправляем данные о детекте
     *     plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
     *         grimManager.handleCheatDetection(playerName, hackType, description, level, action);
     *     });
     * }
     */
}
