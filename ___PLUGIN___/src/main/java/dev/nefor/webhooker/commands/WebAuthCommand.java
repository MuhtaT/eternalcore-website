package dev.nefor.webhooker.commands;

import dev.nefor.webhooker.Main;
import dev.nefor.webhooker.util.ProfileManager;
import com.google.gson.JsonObject;
import org.bukkit.ChatColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

/**
 * Обработчик команды /webauth для привязки аккаунта к сайту
 */
public class WebAuthCommand implements CommandExecutor {
    
    private final Main plugin;
    private final ProfileManager profileManager;
    
    /**
     * Создает новый обработчик команды webauth
     * @param plugin главный класс плагина
     * @param profileManager менеджер профилей
     */
    public WebAuthCommand(Main plugin, ProfileManager profileManager) {
        this.plugin = plugin;
        this.profileManager = profileManager;
    }
    
    @Override
    public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
        // Проверяем, что команду выполняет игрок
        if (!(sender instanceof Player)) {
            sender.sendMessage(ChatColor.RED + "Эта команда может использоваться только игроками!");
            return true;
        }
        
        Player player = (Player) sender;
        
        // Проверяем, правильный ли формат команды
        if (args.length != 1) {
            showUsage(player);
            return true;
        }
        
        // Получаем код авторизации, введенный игроком
        String authCode = args[0];
        
        // Отправляем запрос асинхронно
        plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
            // Выполняем запрос на проверку кода
            JsonObject result = profileManager.verifyAuthCode(player, authCode);
            
            // Отправляем ответ обратно в основной поток
            plugin.getServer().getScheduler().runTask(plugin, () -> {
                if (result.has("success") && result.get("success").getAsBoolean()) {
                    // Код верный, аккаунт привязан
                    player.sendMessage(ChatColor.GREEN + "Аккаунт успешно привязан к сайту EternalCore!");
                    
                    if (result.has("message")) {
                        player.sendMessage(ChatColor.GREEN + result.get("message").getAsString());
                    }
                    
                    // После успешной привязки обновляем профиль игрока на сайте
                    plugin.getServer().getScheduler().runTaskAsynchronously(plugin, () -> {
                        profileManager.updatePlayerProfile(player);
                    });
                } else {
                    // Ошибка при привязке
                    player.sendMessage(ChatColor.RED + "Не удалось привязать аккаунт к сайту.");
                    
                    if (result.has("message")) {
                        player.sendMessage(ChatColor.RED + result.get("message").getAsString());
                    }
                    
                    player.sendMessage(ChatColor.YELLOW + "Убедитесь, что вы правильно ввели код с сайта.");
                    player.sendMessage(ChatColor.YELLOW + "Код действителен в течение 15 минут после генерации.");
                }
            });
        });
        
        return true;
    }
    
    /**
     * Показывает подсказку по использованию команды
     * @param player игрок, которому нужно показать подсказку
     */
    private void showUsage(Player player) {
        player.sendMessage(ChatColor.RED + "Использование: /webauth <код>");
        player.sendMessage(ChatColor.GRAY + "Пример: /webauth ABC123");
        player.sendMessage(ChatColor.GRAY + "Код можно получить на сайте EternalCore.ru в личном кабинете.");
    }
} 