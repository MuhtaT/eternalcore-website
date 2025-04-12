package dev.nefor.webhooker.listeners.grim;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.GrimManager;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;

/**
 * Слушатель события автоматического бана от Grim
 * Примечание: этот класс работает только при наличии плагина Grim на сервере
 */
public class BanListener implements Listener {
    
    private final Main plugin;
    private final GrimManager grimManager;
    
    /**
     * Создает новый слушатель банов от античита
     * @param plugin главный класс плагина
     * @param grimManager менеджер Grim
     */
    public BanListener(Main plugin, GrimManager grimManager) {
        this.plugin = plugin;
        this.grimManager = grimManager;
    }
    
    /**
     * Обработчик события бана от Grim
     * Будет реализован при подключении плагина Grim
     * Примерная схема:
     * 
     * @EventHandler
     * public void onGrimBan(GrimBanEvent event) {
     *     // Получаем информацию о бане
     *     String playerName = event.getPlayerName();
     *     String hackType = event.getHackType();
     *     String description = event.getReason();
     *     
     *     // Асинхронно отправляем данные о бане
     *     plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
     *         grimManager.handleCheatDetection(playerName, hackType, description, 10, "BAN");
     *     });
     * }
     */
}
