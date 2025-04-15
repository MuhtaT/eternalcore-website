import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  HelpCircle, 
  Server, 
  CreditCard, 
  ShieldCheck, 
  Users, 
  Gift, 
  AlertTriangle, 
  Clock,
  Gamepad,
  MessageSquare,
  RefreshCw,
  Info,
  Banknote
} from 'lucide-react'
import Link from "next/link"

export default function FaqPage() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20">
          <div className="h-[500px] w-[500px] rounded-full bg-gradient-to-r from-[#DF2456]/20 to-[#FB0D68]/20 blur-3xl" />
        </div>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <Badge className="px-3.5 py-1.5 text-base bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-white">
              Помощь игрокам
            </Badge>
            <h1 className="max-w-[700px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Часто задаваемые вопросы
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Ответы на популярные вопросы о сервере EternalCore и его функциях
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto">
            {/* Раздел: Общие вопросы */}
            <Card className="w-full border-[#DF2456]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Info className="h-6 w-6 text-[#DF2456]" />
                  <h2 className="text-2xl font-bold">Общие вопросы</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Что такое EternalCore?</h3>
                    </div>
                    <p className="text-muted-foreground pl-7">
                      EternalCore — это уникальный Minecraft сервер на версии 1.16.5 с собственными плагинами, режимами игры и активным сообществом игроков. Мы предлагаем разнообразный игровой опыт, регулярные обновления контента и дружественную атмосферу.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Как начать играть на сервере?</h3>
                    </div>
                    <div className="text-muted-foreground pl-7 space-y-2">
                      <p>Чтобы начать играть на EternalCore, выполните следующие шаги:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Установите лицензионный Minecraft Java Edition версии 1.16.5 или выше</li>
                        <li>Запустите игру и перейдите в раздел "Мультиплеер"</li>
                        <li>Нажмите "Добавить сервер" и введите IP-адрес: play.eternalcore.ru</li>
                        <li>Подключитесь к серверу и наслаждайтесь игрой!</li>
                      </ol>
                      <p className="mt-2">
                        Более подробную инструкцию вы можете найти в разделе <Link href="/" className="text-[#FB0D68] hover:underline">Как начать играть</Link> на главной странице.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Какая версия Minecraft нужна для игры?</h3>
                    </div>
                    <p className="text-muted-foreground pl-7">
                      Наш сервер работает на версии Minecraft 1.16.5, но поддерживает подключение с более новых версий (до 1.20.x). Для наилучшего игрового опыта мы рекомендуем использовать именно версию 1.16.5.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Раздел: Донат и привилегии */}
            <Card className="w-full border-[#DF2456]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Gift className="h-6 w-6 text-[#DF2456]" />
                  <h2 className="text-2xl font-bold">Донат и привилегии</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Какие преимущества дает донат?</h3>
                    </div>
                    <p className="text-muted-foreground pl-7">
                      Донат на сервере EternalCore предоставляет различные игровые привилегии и возможности, включая: доступ к дополнительным командам, косметические предметы, особые возможности для игрового процесса, приоритетный вход на сервер и многое другое. Все доступные привилегии подробно описаны в разделе <Link href="/donate" className="text-[#FB0D68] hover:underline">Донат</Link>.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Как приобрести донат-пакет или привилегию?</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p>Для приобретения донат-пакета или привилегии:</p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Перейдите в раздел <Link href="/donate" className="text-[#FB0D68] hover:underline">Донат</Link> на нашем сайте</li>
                        <li>Выберите интересующий вас пакет или привилегию</li>
                        <li>Укажите ваш игровой никнейм</li>
                        <li>Выберите удобный способ оплаты и следуйте инструкциям</li>
                      </ol>
                      <p className="mt-2">
                        После успешной оплаты привилегия автоматически активируется на сервере.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Политика возврата средств</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p className="font-medium">Условия возврата:</p>
                      <p className="mb-2">
                        Вы можете запросить возврат средств, если полученные услуги были некачественными или не предоставлены в соответствии с условиями заказа.
                      </p>
                      
                      <p className="font-medium">Процедура возврата:</p>
                      <p className="mb-2">
                        Для запроса возврата свяжитесь с нашей службой поддержки через почту <a href="mailto:support@eternalcore.ru" className="text-[#FB0D68] hover:underline">support@eternalcore.ru</a>, официальный <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">Discord-сервер</a> или форму обратной связи на сайте. Укажите причину возврата, ваш игровой никнейм и данные платежа. Мы рассмотрим ваш запрос и произведем возврат средств на вашу карту/кошелек.
                      </p>
                      
                      <p className="font-medium">Сроки возврата:</p>
                      <p>
                        Мы постараемся рассмотреть ваш запрос в кратчайшие сроки, обычно не более 3-5 рабочих дней. Средства возвращаются на ваш счет в течение 5-14 банковских дней в зависимости от платежной системы.
                      </p>
                      
                      <p className="mt-3">
                        Более подробную информацию вы можете найти в <Link href="/legal/offer-agreement" className="text-[#FB0D68] hover:underline">Договоре оферты</Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Раздел: Технические вопросы */}
            <Card className="w-full border-[#DF2456]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Server className="h-6 w-6 text-[#DF2456]" />
                  <h2 className="text-2xl font-bold">Технические вопросы</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Что делать, если я не могу подключиться к серверу?</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p>Если у вас возникли проблемы при подключении к серверу, попробуйте следующие решения:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Убедитесь, что вы правильно ввели IP-адрес: play.eternalcore.ru</li>
                        <li>Проверьте ваше интернет-соединение</li>
                        <li>Перезапустите Minecraft и лаунчер</li>
                        <li>Убедитесь, что используете поддерживаемую версию Minecraft (1.16.5 или выше)</li>
                        <li>Проверьте, не заблокирован ли доступ вашим брандмауэром или антивирусом</li>
                      </ul>
                      <p className="mt-2">
                        Если проблема сохраняется, обратитесь в нашу <Link href="/contacts" className="text-[#FB0D68] hover:underline">техническую поддержку</Link>.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gamepad className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Рекомендуемые моды и ресурспаки</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p>
                        Для комфортной игры на нашем сервере мы рекомендуем следующие клиентские моды (по желанию):
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>OptiFine — для улучшения производительности и графики</li>
                        <li>JourneyMap или Xaero's Minimap — для навигации по миру</li>
                        <li>Sodium и Lithium — альтернативные оптимизационные моды</li>
                      </ul>
                      <p className="mt-2">
                        Обратите внимание, что читы и моды, дающие нечестное преимущество в игре, запрещены и могут привести к бану.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Раздел: Правила и безопасность */}
            <Card className="w-full border-[#DF2456]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldCheck className="h-6 w-6 text-[#DF2456]" />
                  <h2 className="text-2xl font-bold">Правила и безопасность</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Основные правила сервера</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p>Основные правила, которые необходимо соблюдать на сервере EternalCore:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Уважайте других игроков, не оскорбляйте и не провоцируйте их</li>
                        <li>Запрещено использование читов, эксплойтов и любых других нечестных преимуществ</li>
                        <li>Не распространяйте вредоносное ПО, ссылки на фишинг или вирусы</li>
                        <li>Не рекламируйте другие проекты без разрешения администрации</li>
                        <li>Не выдавайте себя за членов администрации или модерации</li>
                      </ul>
                      <p className="mt-2">
                        Полный список правил сервера вы можете найти в разделе <Link href="/rules" className="text-[#FB0D68] hover:underline">Правила</Link>.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Как сообщить о нарушении правил?</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p>Если вы стали свидетелем нарушения правил сервера, вы можете сообщить об этом несколькими способами:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Написать команде модерации на сервере через команду /report</li>
                        <li>Связаться с администрацией через <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">Discord</a></li>
                        <li>Отправить электронное письмо на адрес <a href="mailto:report@eternalcore.ru" className="text-[#FB0D68] hover:underline">report@eternalcore.ru</a></li>
                      </ul>
                      <p className="mt-2">
                        Пожалуйста, предоставьте как можно больше информации о нарушении: никнеймы игроков, время, скриншоты или видео, если это возможно.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Раздел: Сообщество */}
            <Card className="w-full border-[#DF2456]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Users className="h-6 w-6 text-[#DF2456]" />
                  <h2 className="text-2xl font-bold">Сообщество</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Как связаться с другими игроками?</h3>
                    </div>
                    <div className="text-muted-foreground pl-7">
                      <p>Вы можете общаться с другими игроками несколькими способами:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Через внутриигровой чат на сервере</li>
                        <li>В нашем официальном <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">Discord-сервере</a></li>
                        <li>В наших группах в социальных сетях (ссылки находятся на странице <Link href="/contacts" className="text-[#FB0D68] hover:underline">Контакты</Link>)</li>
                      </ul>
                      <p className="mt-2">
                        Discord является основной платформой для общения нашего сообщества, где вы можете найти друзей для игры, обсудить проект и получить помощь.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#DF2456]" />
                      <h3 className="text-xl font-semibold">Когда проводятся события на сервере?</h3>
                    </div>
                    <p className="text-muted-foreground pl-7">
                      Мы регулярно проводим различные игровые события, турниры и конкурсы для наших игроков. Информация о предстоящих событиях публикуется в нашем <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">Discord-сервере</a> и на странице сервера в социальных сетях. Также внутри игры есть специальные объявления о ближайших мероприятиях.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Дополнительная помощь */}
            <div className="w-full pt-8 text-center">
              <p className="text-muted-foreground mb-4">
                Не нашли ответ на свой вопрос? Свяжитесь с нами!
              </p>
              <Link 
                href="/contacts" 
                className="bg-gradient-to-r from-[#DF2456] to-[#FB0D68] hover:from-[#DF2456]/90 hover:to-[#FB0D68]/90 text-white font-medium rounded-md px-6 py-2.5 inline-flex items-center"
              >
                Написать в поддержку
                <MessageSquare className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 