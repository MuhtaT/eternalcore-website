package dev.nefor.webhooker.listeners.litebans;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.LitebansManager;
import litebans.api.Entry;
import litebans.api.Events;
import org.bukkit.Bukkit;
import org.bukkit.event.Listener;

import java.util.UUID;

/**
 * Слушатель события мута через Litebans
 * Этот класс работает при наличии плагина Litebans на сервере
 */
public class MuteEventListener implements Listener {
    
    private final Main plugin;
    private final LitebansManager litebansManager;
    
    /**
     * Создает новый слушатель событий мута
     * @param plugin главный класс плагина
     * @param litebansManager менеджер Litebans
     */
    public MuteEventListener(Main plugin, LitebansManager litebansManager) {
        this.plugin = plugin;
        this.litebansManager = litebansManager;
        
        // Регистрируем слушатель событий LiteBans
        registerLitebansListener();
    }
    
    /**
     * Регистрирует слушатель событий LiteBans API
     */
    private void registerLitebansListener() {
        plugin.getLogger().info("Регистрация слушателя событий LiteBans для мутов...");
        
        // Добавляем обработчик событий мута в LiteBans API
        Events.get().register(new Events.Listener() {
            @Override
            public void entryAdded(Entry entry) {
                // Обрабатываем только события мута
                if (entry.getType().equals("mute")) {
                    // Получаем информацию о муте
                    String executorName = entry.getExecutorName() != null ? entry.getExecutorName() : "Console";
                    String playerName = getPlayerNameFromEntry(entry);
                    String reason = entry.getReason() != null ? entry.getReason() : "Не указана";
                    long durationInSeconds = entry.getDuration();
                    
                    // Форматируем продолжительность
                    String duration = formatDuration(durationInSeconds);
                    
                    // Используем обычный Java Thread вместо планировщика Bukkit
                    new Thread(() -> {
                        try {
                            litebansManager.handleMute(executorName, playerName, reason, duration);
                            plugin.getLogger().info("Обработан мут игрока " + playerName + " администратором " + executorName);
                        } catch (Exception e) {
                            plugin.getLogger().warning("Ошибка при обработке мута: " + e.getMessage());
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
            plugin.getLogger().warning("Некорректный UUID игрока в событии мута: " + uuidString);
        }
        
        // Если мы не смогли получить имя игрока, возвращаем UUID
        return "UUID: " + uuidString;
    }
    
    /**
     * Форматирует продолжительность в удобочитаемый формат
     * @param seconds продолжительность в секундах
     * @return строка с форматированной продолжительностью
     */
    private String formatDuration(long seconds) {
        if (seconds <= 0) {
            return "permanent";
        }
        
        long days = seconds / 86400;
        long hours = (seconds % 86400) / 3600;
        long minutes = (seconds % 3600) / 60;
        long remainingSeconds = seconds % 60;
        
        StringBuilder result = new StringBuilder();
        
        if (days > 0) {
            result.append(days).append("d ");
        }
        
        if (hours > 0 || days > 0) {
            result.append(hours).append("h ");
        }
        
        if (minutes > 0 || hours > 0 || days > 0) {
            result.append(minutes).append("m ");
        }
        
        if (remainingSeconds > 0 || result.length() == 0) {
            result.append(remainingSeconds).append("s");
        }
        
        return result.toString().trim();
    }
}
