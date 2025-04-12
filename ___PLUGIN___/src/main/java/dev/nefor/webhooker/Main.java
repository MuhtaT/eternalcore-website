package dev.nefor.webhooker;

import dev.nefor.webhooker.commands.WebAuthCommand;
import dev.nefor.webhooker.listeners.bukkit.LuckPermsListener;
import dev.nefor.webhooker.listeners.bukkit.PlayerPointsListener;
import dev.nefor.webhooker.listeners.bukkit.ProfileUpdateListener;
import dev.nefor.webhooker.listeners.bukkit.StaffJoinListener;
import dev.nefor.webhooker.listeners.bukkit.StaffLeaveListener;
import dev.nefor.webhooker.listeners.grim.BanListener;
import dev.nefor.webhooker.listeners.grim.DetectListener;
import dev.nefor.webhooker.listeners.grim.KickListener;
import dev.nefor.webhooker.listeners.litebans.BanEventListener;
import dev.nefor.webhooker.listeners.litebans.KickEventListener;
import dev.nefor.webhooker.listeners.litebans.MuteEventListener;
import dev.nefor.webhooker.listeners.litebans.WarnEventListener;
import dev.nefor.webhooker.util.GrimManager;
import dev.nefor.webhooker.util.LitebansManager;
import dev.nefor.webhooker.util.ProfileManager;
import dev.nefor.webhooker.util.StaffLogger;
import dev.nefor.webhooker.util.WebhookManager;
import net.luckperms.api.LuckPerms;
import net.luckperms.api.LuckPermsProvider;
import org.black_ixx.playerpoints.PlayerPoints;
import org.black_ixx.playerpoints.PlayerPointsAPI;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.PluginManager;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitTask;

/**
 * Основной класс плагина WebHooker
 */
public class Main extends JavaPlugin {

    private WebhookManager webhookManager;
    private StaffLogger staffLogger;
    private LitebansManager litebansManager;
    private GrimManager grimManager;
    private ProfileManager profileManager;
    private BukkitTask metricsTask;
    private BukkitTask profileUpdateTask;
    
    // Интеграция с другими плагинами
    private PlayerPointsAPI playerPointsAPI;
    private LuckPerms luckPermsAPI;
    private boolean playerPointsEnabled = false;
    private boolean luckPermsEnabled = false;
    
    @Override
    public void onEnable() {
        // Сохраняем конфигурацию по умолчанию, если её нет
        saveDefaultConfig();
        
        // Подключаемся к другим плагинам
        setupPlayerPoints();
        setupLuckPerms();
        
        // Инициализируем менеджеры
        initializeManagers();
        
        // Регистрируем обработчики событий
        registerEventListeners();
        
        // Регистрируем команды
        registerCommands();
        
        // Запускаем периодическую отправку метрик
        startMetricsTask();
        
        // Запускаем периодическое обновление профилей
        startProfileUpdateTask();
        
        getLogger().info("WebHooker плагин успешно запущен!");
        getLogger().info("Разработано для сервера EternalCore.ru");
    }

    @Override
    public void onDisable() {
        // Обновляем профили всех онлайн-игроков перед выключением сервера
        if (profileManager != null && profileManager.isEnabled()) {
            getLogger().info("Обновление профилей всех игроков перед выключением сервера...");
            profileManager.updateAllOnlineProfiles();
        }
        
        // Останавливаем задачи
        if (metricsTask != null) {
            metricsTask.cancel();
        }
        
        if (profileUpdateTask != null) {
            profileUpdateTask.cancel();
        }
        
        getLogger().info("WebHooker плагин отключен!");
    }
    
    /**
     * Подключаемся к плагину PlayerPoints
     */
    private void setupPlayerPoints() {
        try {
            Plugin playerPointsPlugin = getServer().getPluginManager().getPlugin("PlayerPoints");
            if (playerPointsPlugin != null && playerPointsPlugin.isEnabled()) {
                playerPointsAPI = PlayerPoints.getInstance().getAPI();
                playerPointsEnabled = true;
                getLogger().info("Интеграция с PlayerPoints успешно подключена");
            } else {
                getLogger().warning("Плагин PlayerPoints не найден или отключен. Функции баланса будут недоступны.");
            }
        } catch (Exception e) {
            getLogger().warning("Ошибка при подключении к PlayerPoints: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Подключаемся к плагину LuckPerms
     */
    private void setupLuckPerms() {
        try {
            Plugin luckPermsPlugin = getServer().getPluginManager().getPlugin("LuckPerms");
            if (luckPermsPlugin != null && luckPermsPlugin.isEnabled()) {
                luckPermsAPI = LuckPermsProvider.get();
                luckPermsEnabled = true;
                getLogger().info("Интеграция с LuckPerms успешно подключена");
            } else {
                getLogger().warning("Плагин LuckPerms не найден или отключен. Функции привилегий будут недоступны.");
            }
        } catch (Exception e) {
            getLogger().warning("Ошибка при подключении к LuckPerms: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Инициализирует менеджеры плагина
     */
    private void initializeManagers() {
        // Создаем менеджер вебхуков
        webhookManager = new WebhookManager(this);
        
        // Создаем логгер персонала
        staffLogger = new StaffLogger(this, webhookManager);
        
        // Создаем менеджер Litebans
        litebansManager = new LitebansManager(this, webhookManager, staffLogger);
        
        // Создаем менеджер Grim
        grimManager = new GrimManager(this, webhookManager);
        
        // Создаем менеджер профилей
        profileManager = new ProfileManager(this, webhookManager.getApiClient());
    }
    
    /**
     * Регистрирует обработчики событий
     */
    private void registerEventListeners() {
        PluginManager pluginManager = getServer().getPluginManager();
        
        // Регистрируем события входа/выхода персонала
        pluginManager.registerEvents(new StaffJoinListener(this, staffLogger), this);
        pluginManager.registerEvents(new StaffLeaveListener(this, staffLogger), this);
        
        // Регистрируем Litebans слушатели, если включено
        if (getConfig().getBoolean("litebans.enabled", true)) {
            // Проверяем наличие плагина LiteBans
            if (getServer().getPluginManager().getPlugin("LiteBans") != null) {
                pluginManager.registerEvents(new BanEventListener(this, litebansManager), this);
                pluginManager.registerEvents(new MuteEventListener(this, litebansManager), this);
                pluginManager.registerEvents(new KickEventListener(this, litebansManager), this);
                pluginManager.registerEvents(new WarnEventListener(this, litebansManager), this);
                getLogger().info("Интеграция с LiteBans успешно включена");
            } else {
                getLogger().warning("Плагин LiteBans не найден, интеграция не будет работать");
            }
        }
        
        // Регистрируем Grim слушатели, если включен античит
        if (getConfig().getBoolean("anticheat.enabled", true)) {
            pluginManager.registerEvents(new DetectListener(this, grimManager), this);
            pluginManager.registerEvents(new BanListener(this, grimManager), this);
            pluginManager.registerEvents(new KickListener(this, grimManager), this);
        }
        
        // Регистрируем слушатель обновления профилей
        if (getConfig().getBoolean("profile.enabled", true)) {
            // Основной слушатель для обновления профилей при входе/выходе
            pluginManager.registerEvents(new ProfileUpdateListener(this, profileManager), this);
            
            // Регистрируем слушатель PlayerPoints, если плагин доступен
            if (isPlayerPointsEnabled() && getConfig().getBoolean("profile.playerpoints.enabled", true)) {
                pluginManager.registerEvents(new PlayerPointsListener(this, profileManager), this);
                getLogger().info("Слушатель изменения баланса PlayerPoints зарегистрирован");
            }
            
            // Регистрируем слушатель LuckPerms, если плагин доступен
            if (isLuckPermsEnabled() && getConfig().getBoolean("profile.luckperms.enabled", true)) {
                // LuckPerms слушатель сам регистрируется в LuckPerms API
                new LuckPermsListener(this, profileManager);
                getLogger().info("Слушатель изменения групп LuckPerms зарегистрирован");
            }
            
            getLogger().info("Интеграция профилей с сайтом активирована");
        }
    }
    
    /**
     * Регистрирует команды плагина
     */
    private void registerCommands() {
        getCommand("webhooker").setExecutor(new WebhookerCommand(this));
        
        // Регистрируем команду привязки аккаунта
        if (getConfig().getBoolean("profile.enabled", true)) {
            getCommand("webauth").setExecutor(new WebAuthCommand(this, profileManager));
            getLogger().info("Команда привязки аккаунта /webauth зарегистрирована");
        }
    }
    
    /**
     * Запускает периодическую отправку метрик
     */
    private void startMetricsTask() {
        FileConfiguration config = getConfig();
        
        if (!config.getBoolean("metrics.enabled", true)) {
            getLogger().info("Отправка метрик отключена в конфигурации");
            return;
        }
        
        int interval = config.getInt("metrics.interval", 60);
        
        // Конвертируем секунды в тики (20 тиков = 1 секунда)
        long ticks = interval * 20L;
        
        // Запускаем задачу с небольшой задержкой в 20 тиков (1 секунда)
        metricsTask = getServer().getScheduler().runTaskTimerAsynchronously(this, () -> {
            try {
                webhookManager.sendOnlineMetrics();
            } catch (Exception e) {
                getLogger().warning("Ошибка при отправке метрик онлайна: " + e.getMessage());
            }
        }, 20L, ticks);
        
        getLogger().info("Запущена отправка метрик каждые " + interval + " секунд");
    }
    
    /**
     * Запускает периодическое обновление профилей игроков
     */
    private void startProfileUpdateTask() {
        FileConfiguration config = getConfig();
        
        if (!config.getBoolean("profile.enabled", true)) {
            getLogger().info("Обновление профилей отключено в конфигурации");
            return;
        }
        
        int interval = config.getInt("profile.bulk_update_interval", 900);
        
        // Конвертируем секунды в тики (20 тиков = 1 секунда)
        long ticks = interval * 20L;
        
        // Запускаем задачу с задержкой в 120 тиков (6 секунд)
        profileUpdateTask = getServer().getScheduler().runTaskTimerAsynchronously(this, () -> {
            try {
                profileManager.updateAllOnlineProfiles();
            } catch (Exception e) {
                getLogger().warning("Ошибка при массовом обновлении профилей: " + e.getMessage());
            }
        }, 120L, ticks);
        
        getLogger().info("Запущено периодическое обновление профилей каждые " + interval + " секунд");
    }
    
    /**
     * Перезагружает настройки плагина
     */
    public void reloadPlugin() {
        // Перезагружаем конфигурацию
        reloadConfig();
        
        // Обновляем настройки менеджеров
        profileManager.setEnabled(getConfig().getBoolean("profile.enabled", true));
        
        // Перезапускаем задачу отправки метрик
        if (metricsTask != null) {
            metricsTask.cancel();
        }
        
        // Перезапускаем задачу обновления профилей
        if (profileUpdateTask != null) {
            profileUpdateTask.cancel();
        }
        
        // Запускаем задачи снова
        startMetricsTask();
        startProfileUpdateTask();
        
        getLogger().info("Плагин успешно перезагружен");
    }
    
    /**
     * Получает менеджер вебхуков
     * @return менеджер вебхуков
     */
    public WebhookManager getWebhookManager() {
        return webhookManager;
    }
    
    /**
     * Получает логгер персонала
     * @return логгер персонала
     */
    public StaffLogger getStaffLogger() {
        return staffLogger;
    }
    
    /**
     * Получает менеджер Litebans
     * @return менеджер Litebans
     */
    public LitebansManager getLitebansManager() {
        return litebansManager;
    }
    
    /**
     * Получает менеджер Grim
     * @return менеджер Grim
     */
    public GrimManager getGrimManager() {
        return grimManager;
    }
    
    /**
     * Получает менеджер профилей
     * @return менеджер профилей
     */
    public ProfileManager getProfileManager() {
        return profileManager;
    }
    
    /**
     * Проверяет, подключен ли PlayerPoints
     * @return true если PlayerPoints подключен и работает
     */
    public boolean isPlayerPointsEnabled() {
        return playerPointsEnabled;
    }
    
    /**
     * Получает API PlayerPoints
     * @return API PlayerPoints или null, если плагин не подключен
     */
    public PlayerPointsAPI getPlayerPointsAPI() {
        return playerPointsAPI;
    }
    
    /**
     * Проверяет, подключен ли LuckPerms
     * @return true если LuckPerms подключен и работает
     */
    public boolean isLuckPermsEnabled() {
        return luckPermsEnabled;
    }
    
    /**
     * Получает API LuckPerms
     * @return API LuckPerms или null, если плагин не подключен
     */
    public LuckPerms getLuckPermsAPI() {
        return luckPermsAPI;
    }
} 