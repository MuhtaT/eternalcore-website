package dev.nefor.webhooker.listeners.litebans;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.LitebansManager;
import litebans.api.Entry;
import litebans.api.Events;
import org.bukkit.Bukkit;
import org.bukkit.event.Listener;

import java.util.UUID;

/**
 * Слушатель события кика через Litebans
 * Этот класс работает при наличии плагина Litebans на сервере
 */
public class KickEventListener implements Listener {
    
    private final Main plugin;
    private final LitebansManager litebansManager;
    
    /**
     * Создает новый слушатель событий кика
     * @param plugin главный класс плагина
     * @param litebansManager менеджер Litebans
     */
    public KickEventListener(Main plugin, LitebansManager litebansManager) {
        this.plugin = plugin;
        this.litebansManager = litebansManager;
        
        // Регистрируем слушатель событий LiteBans
        registerLitebansListener();
    }
    
    /**
     * Регистрирует слушатель событий LiteBans API
     */
    private void registerLitebansListener() {
        plugin.getLogger().info("Регистрация слушателя событий LiteBans для киков...");
        
        // Добавляем обработчик событий кика в LiteBans API
        Events.get().register(new Events.Listener() {
            @Override
            public void entryAdded(Entry entry) {
                // Обрабатываем только события кика
                if (entry.getType().equals("kick")) {
                    // Получаем информацию о кике
                    String executorName = entry.getExecutorName() != null ? entry.getExecutorName() : "Console";
                    String playerName = getPlayerNameFromEntry(entry);
                    String reason = entry.getReason() != null ? entry.getReason() : "Не указана";
                    
                    // Используем обычный Java Thread вместо планировщика Bukkit
                    new Thread(() -> {
                        try {
                            litebansManager.handleKick(executorName, playerName, reason);
                            plugin.getLogger().info("Обработан кик игрока " + playerName + " администратором " + executorName);
                        } catch (Exception e) {
                            plugin.getLogger().warning("Ошибка при обработке кика: " + e.getMessage());
                            e.printStackTrace();
                        }
                    }).start();
                }
            }
        });
    }
    
    /**
     * Получает имя игрока из объекта Entry
     * @param entry объект данных LiteBans
     * @return имя игрока или "Unknown" если не найдено
     */
    private String getPlayerNameFromEntry(Entry entry) {
        // Получаем UUID игрока
        String uuidString = entry.getUuid();
        
        // Если UUID не существует, попробуем использовать IP
        if (uuidString == null || uuidString.isEmpty()) {
            return "IP: " + (entry.getIp() != null ? entry.getIp() : "Unknown");
        }
        
        try {
            // Пытаемся получить оффлайн игрока по UUID
            UUID uuid = UUID.fromString(uuidString);
            if (Bukkit.getOfflinePlayer(uuid).getName() != null) {
                return Bukkit.getOfflinePlayer(uuid).getName();
            }
        } catch (IllegalArgumentException e) {
            plugin.getLogger().warning("Некорректный UUID игрока в событии кика: " + uuidString);
        }
        
        // Если мы не смогли получить имя игрока, возвращаем UUID
        return "UUID: " + uuidString;
    }
}
