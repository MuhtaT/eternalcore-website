package dev.nefor.webhooker;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

/**
 * Обработчик команд плагина WebHooker
 */
public class WebhookerCommand implements CommandExecutor {
    
    private final Main plugin;
    private final Gson gson;
    
    /**
     * Создает новый обработчик команд
     * @param plugin главный класс плагина
     */
    public WebhookerCommand(Main plugin) {
        this.plugin = plugin;
        this.gson = new GsonBuilder().setPrettyPrinting().create();
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        if (args.length == 0) {
            showHelp(sender);
            return true;
        }
        
        switch (args[0].toLowerCase()) {
            case "reload":
                handleReload(sender);
                break;
                
            case "test":
                if (args.length < 2) {
                    sender.sendMessage(ChatColor.RED + "Использование: /webhooker test <тип>");
                    sender.sendMessage(ChatColor.GRAY + "Доступные типы: online, anticheat, staffactivity, all");
                    return true;
                }
                
                handleTest(sender, args[1]);
                break;
                
            case "getdata":
                if (args.length < 2) {
                    sender.sendMessage(ChatColor.RED + "Использование: /webhooker getdata <тип>");
                    sender.sendMessage(ChatColor.GRAY + "Доступные типы: donate_packages, privileges, online_metrics, anticheat, staff_activity, staff_connections, all");
                    return true;
                }
                
                handleGetData(sender, args[1]);
                break;
                
            case "profile":
                if (args.length < 2) {
                    sender.sendMessage(ChatColor.RED + "Использование: /webhooker profile <enable|disable|update|status>");
                    return true;
                }
                
                handleProfile(sender, args[1], args.length > 2 ? args[2] : null);
                break;
                
            default:
                showHelp(sender);
                break;
        }
        
        return true;
    }
    
    /**
     * Отображает справку по командам
     * @param sender отправитель команды
     */
    private void showHelp(CommandSender sender) {
        sender.sendMessage(ChatColor.GOLD + "=== WebHooker ===");
        sender.sendMessage(ChatColor.YELLOW + "/webhooker reload " + ChatColor.WHITE + "- Перезагрузить конфигурацию");
        sender.sendMessage(ChatColor.YELLOW + "/webhooker test <тип> " + ChatColor.WHITE + "- Тестировать отправку данных");
        sender.sendMessage(ChatColor.YELLOW + "/webhooker getdata <тип> " + ChatColor.WHITE + "- Получить данные с сайта");
        sender.sendMessage(ChatColor.YELLOW + "/webhooker profile <enable|disable|update|status> " + ChatColor.WHITE + "- Управление интеграцией профилей");
    }
    
    /**
     * Обрабатывает команду перезагрузки
     * @param sender отправитель команды
     */
    private void handleReload(CommandSender sender) {
        plugin.reloadConfig();
        plugin.reloadPlugin();
        sender.sendMessage(ChatColor.GREEN + "Конфигурация плагина WebHooker перезагружена!");
    }
    
    /**
     * Обрабатывает команду тестирования
     * @param sender отправитель команды
     * @param testType тип теста
     */
    private void handleTest(CommandSender sender, String testType) {
        sender.sendMessage(ChatColor.YELLOW + "Тестирование WebHooker: " + testType);
        
        // Запускаем тестирование асинхронно
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            try {
                boolean success = false;
                
                switch (testType.toLowerCase()) {
                    case "online":
                        success = plugin.getWebhookManager().sendOnlineMetrics();
                        break;
                        
                    case "anticheat":
                        String playerName = sender instanceof Player ? sender.getName() : "Console";
                        success = plugin.getWebhookManager().sendAnticheatDetection(
                                playerName, 
                                "TEST", 
                                "Тестовый детект античита", 
                                5, 
                                "NONE");
                        break;
                        
                    case "staffactivity":
                        String staffName = sender instanceof Player ? sender.getName() : "Console";
                        success = plugin.getWebhookManager().sendStaffActivity(
                                staffName, 
                                "TEST", 
                                "TestTarget", 
                                "0", 
                                "Тестовая активность персонала");
                        break;
                        
                    case "profile":
                        if (sender instanceof Player) {
                            Player player = (Player) sender;
                            success = plugin.getProfileManager().updatePlayerProfile(player);
                            if (success) {
                                sender.sendMessage(ChatColor.GREEN + "Тестовое обновление профиля успешно отправлено на сайт.");
                            }
                        } else {
                            sender.sendMessage(ChatColor.RED + "Эта команда может использоваться только игроками.");
                            return;
                        }
                        break;
                        
                    case "all":
                        sender.sendMessage(ChatColor.GRAY + "Тестирование всех типов данных...");
                        handleTest(sender, "online");
                        handleTest(sender, "anticheat");
                        handleTest(sender, "staffactivity");
                        if (sender instanceof Player) {
                            handleTest(sender, "profile");
                        }
                        return;
                        
                    default:
                        sender.sendMessage(ChatColor.RED + "Неизвестный тип теста: " + testType);
                        sender.sendMessage(ChatColor.GRAY + "Доступные типы: online, anticheat, staffactivity, profile, all");
                        return;
                }
                
                if (success) {
                    sender.sendMessage(ChatColor.GREEN + "Тест успешно выполнен!");
                } else {
                    sender.sendMessage(ChatColor.RED + "Ошибка при выполнении теста. Проверьте консоль для подробностей.");
                }
            } catch (Exception e) {
                sender.sendMessage(ChatColor.RED + "Ошибка при тестировании: " + e.getMessage());
                e.printStackTrace();
            }
        });
    }
    
    /**
     * Обрабатывает команду получения данных
     * @param sender отправитель команды
     * @param dataType тип данных
     */
    private void handleGetData(CommandSender sender, String dataType) {
        sender.sendMessage(ChatColor.YELLOW + "Получение данных с сайта...");
        
        // Запускаем получение данных асинхронно
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            try {
                String dataJson = plugin.getWebhookManager().getDataFromWebsite(dataType);
                
                if (dataJson != null) {
                    sender.sendMessage(ChatColor.GREEN + "Данные успешно получены!");
                    
                    // Пытаемся преобразовать JSON для лучшего отображения
                    try {
                        JsonObject jsonObject = gson.fromJson(dataJson, JsonObject.class);
                        dataJson = gson.toJson(jsonObject);
                    } catch (Exception ignored) {
                        // Если не удалось преобразовать, оставляем как есть
                    }
                    
                    // Показываем данные, если у отправителя есть права
                    if (sender.hasPermission("webhooker.admin.debug")) {
                        sender.sendMessage(ChatColor.GRAY + "Ответ: ");
                        
                        // Отправляем ответ по частям, чтобы не превысить лимит сообщения
                        for (String part : dataJson.split("(?<=\\G.{1000})")) {
                            sender.sendMessage(ChatColor.WHITE + part);
                        }
                    }
                } else {
                    sender.sendMessage(ChatColor.RED + "Не удалось получить данные. Проверьте консоль для подробностей.");
                }
            } catch (Exception e) {
                sender.sendMessage(ChatColor.RED + "Ошибка при получении данных: " + e.getMessage());
                e.printStackTrace();
            }
        });
    }
    
    /**
     * Обрабатывает команду управления профилями
     * @param sender отправитель команды
     * @param action действие (enable, disable, update, status)
     * @param playerName имя игрока (опционально)
     */
    private void handleProfile(CommandSender sender, String action, String playerName) {
        // Проверяем, что интеграция профилей возможна
        if (plugin.getProfileManager() == null) {
            sender.sendMessage(ChatColor.RED + "Ошибка: менеджер профилей не инициализирован.");
            return;
        }
        
        switch (action.toLowerCase()) {
            case "enable":
                plugin.getProfileManager().setEnabled(true);
                plugin.getConfig().set("profile.enabled", true);
                plugin.saveConfig();
                sender.sendMessage(ChatColor.GREEN + "Интеграция профилей включена.");
                break;
                
            case "disable":
                plugin.getProfileManager().setEnabled(false);
                plugin.getConfig().set("profile.enabled", false);
                plugin.saveConfig();
                sender.sendMessage(ChatColor.YELLOW + "Интеграция профилей отключена.");
                break;
                
            case "update":
                if (playerName != null) {
                    // Обновление профиля конкретного игрока
                    Player player = plugin.getServer().getPlayer(playerName);
                    if (player != null && player.isOnline()) {
                        sender.sendMessage(ChatColor.YELLOW + "Обновление профиля игрока " + player.getName() + "...");
                        
                        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                            boolean success = plugin.getProfileManager().updatePlayerProfile(player);
                            
                            plugin.getServer().getScheduler().runTask(plugin, () -> {
                                if (success) {
                                    sender.sendMessage(ChatColor.GREEN + "Профиль игрока " + player.getName() + " успешно обновлен.");
                                } else {
                                    sender.sendMessage(ChatColor.RED + "Не удалось обновить профиль игрока " + player.getName() + ".");
                                }
                            });
                        });
                    } else {
                        sender.sendMessage(ChatColor.RED + "Игрок " + playerName + " не найден или не в сети.");
                    }
                } else {
                    // Обновление профилей всех игроков
                    sender.sendMessage(ChatColor.YELLOW + "Обновление профилей всех онлайн-игроков...");
                    
                    plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                        plugin.getProfileManager().updateAllOnlineProfiles();
                        
                        plugin.getServer().getScheduler().runTask(plugin, () -> {
                            sender.sendMessage(ChatColor.GREEN + "Профили всех онлайн-игроков обновлены.");
                        });
                    });
                }
                break;
                
            case "status":
                boolean enabled = plugin.getProfileManager().isEnabled();
                int onlinePlayers = plugin.getServer().getOnlinePlayers().size();
                
                sender.sendMessage(ChatColor.GOLD + "=== Статус интеграции профилей ===");
                sender.sendMessage(ChatColor.YELLOW + "Состояние: " + 
                        (enabled ? ChatColor.GREEN + "Включено" : ChatColor.RED + "Отключено"));
                sender.sendMessage(ChatColor.YELLOW + "Игроков онлайн: " + ChatColor.WHITE + onlinePlayers);
                sender.sendMessage(ChatColor.YELLOW + "Интервал обновления: " + 
                        ChatColor.WHITE + (plugin.getConfig().getLong("profile.update_interval", 300000) / 1000) + " сек.");
                sender.sendMessage(ChatColor.YELLOW + "Массовое обновление: " + 
                        ChatColor.WHITE + "каждые " + plugin.getConfig().getInt("profile.bulk_update_interval", 900) + " сек.");
                break;
                
            default:
                sender.sendMessage(ChatColor.RED + "Неизвестное действие: " + action);
                sender.sendMessage(ChatColor.GRAY + "Доступные действия: enable, disable, update, status");
                break;
        }
    }
} 