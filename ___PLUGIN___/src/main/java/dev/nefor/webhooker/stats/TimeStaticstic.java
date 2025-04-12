package dev.nefor.webhooker.stats;

import dev.nefor.webhooker.Main;
import org.bukkit.entity.Player;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Класс для отслеживания времени онлайна игроков
 */
public class TimeStaticstic {
    
    private final Main plugin;
    private final Map<UUID, Long> joinTimes;
    
    /**
     * Создает новый экземпляр статистики времени онлайна
     * @param plugin главный класс плагина
     */
    public TimeStaticstic(Main plugin) {
        this.plugin = plugin;
        this.joinTimes = new HashMap<>();
    }
    
    /**
     * Регистрирует вход игрока на сервер
     * @param player игрок, совершивший вход
     */
    public void registerJoin(Player player) {
        joinTimes.put(player.getUniqueId(), System.currentTimeMillis());
    }
    
    /**
     * Регистрирует выход игрока с сервера и возвращает время пребывания онлайн
     * @param player игрок, совершивший выход
     * @return время пребывания онлайн в миллисекундах или -1, если игрок не был зарегистрирован
     */
    public long registerQuit(Player player) {
        UUID uuid = player.getUniqueId();
        
        if (!joinTimes.containsKey(uuid)) {
            return -1;
        }
        
        long joinTime = joinTimes.get(uuid);
        long quitTime = System.currentTimeMillis();
        long sessionTime = quitTime - joinTime;
        
        joinTimes.remove(uuid);
        
        return sessionTime;
    }
    
    /**
     * Получает текущее время сессии игрока
     * @param player игрок
     * @return время текущей сессии в миллисекундах или -1, если игрок не был зарегистрирован
     */
    public long getCurrentSessionTime(Player player) {
        UUID uuid = player.getUniqueId();
        
        if (!joinTimes.containsKey(uuid)) {
            return -1;
        }
        
        long joinTime = joinTimes.get(uuid);
        long currentTime = System.currentTimeMillis();
        
        return currentTime - joinTime;
    }
    
    /**
     * Форматирует время сессии в удобочитаемый формат
     * @param milliseconds время в миллисекундах
     * @return отформатированная строка
     */
    public static String formatSessionTime(long milliseconds) {
        if (milliseconds < 0) {
            return "неизвестно";
        }
        
        long seconds = milliseconds / 1000;
        long minutes = seconds / 60;
        long hours = minutes / 60;
        long days = hours / 24;
        
        seconds %= 60;
        minutes %= 60;
        hours %= 24;
        
        StringBuilder sb = new StringBuilder();
        
        if (days > 0) {
            sb.append(days).append("д ");
        }
        
        if (hours > 0 || days > 0) {
            sb.append(hours).append("ч ");
        }
        
        if (minutes > 0 || hours > 0 || days > 0) {
            sb.append(minutes).append("м ");
        }
        
        sb.append(seconds).append("с");
        
        return sb.toString();
    }
}
