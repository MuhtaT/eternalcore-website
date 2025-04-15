import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Eye, Server, Database, Clock } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
              Юридическая информация
            </Badge>
            <h1 className="max-w-[700px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Политика конфиденциальности
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Информация о том, как мы собираем, используем и защищаем ваши данные
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Введение</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Настоящая Политика конфиденциальности описывает, как EternalCore (далее "мы", "нас" или "наш") собирает, использует и раскрывает информацию, полученную от пользователей (далее "вы" или "ваш") нашего Minecraft сервера и связанных с ним веб-сайтов и сервисов.
                  </p>
                  <p className="text-muted-foreground">
                    Используя наш сервер и сервисы, вы соглашаетесь с условиями данной Политики конфиденциальности. Если вы не согласны с условиями, пожалуйста, не используйте наш сервер и сервисы.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Собираемая информация</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Мы можем собирать следующие типы информации:
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Lock className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Личная информация</h3>
                        <p className="text-sm text-muted-foreground">
                          Мы можем собирать личную информацию, такую как ваш Minecraft никнейм, адрес электронной почты (при регистрации на форуме или в Discord), IP-адрес и другую информацию, которую вы предоставляете добровольно.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Server className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Игровые данные</h3>
                        <p className="text-sm text-muted-foreground">
                          Мы собираем информацию о вашей активности на сервере, включая время входа и выхода, игровые действия, чат-сообщения, взаимодействия с другими игроками и использование игровых функций.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Eye className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">Технические данные</h3>
                        <p className="text-sm text-muted-foreground">
                          Мы автоматически собираем определенную техническую информацию, когда вы используете наш сервер или веб-сайт, включая IP-адрес, тип устройства, версию Minecraft, информацию о браузере и операционной системе, а также данные о производительности.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Использование информации</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Мы используем собранную информацию для следующих целей:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Обеспечение безопасности и стабильности сервера, включая выявление и предотвращение нарушений правил, читерства и вредоносной активности
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Server className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Улучшение игрового опыта, оптимизация производительности сервера и разработка новых функций
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Database className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Обработка транзакций и управление донат-привилегиями
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Eye className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Связь с вами по вопросам, связанным с сервером, включая уведомления, обновления и ответы на запросы
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Защита информации</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Мы принимаем разумные меры для защиты вашей информации от несанкционированного доступа, использования или раскрытия. Однако, помните, что ни один метод передачи через Интернет или метод электронного хранения не является 100% безопасным.
                  </p>
                  <p className="text-muted-foreground">
                    Мы используем следующие меры безопасности:
                  </p>
                  <ul className="space-y-2 text-muted-foreground mt-4">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Lock className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Шифрование данных при передаче и хранении
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Регулярное обновление систем безопасности и мониторинг угроз
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Server className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Ограниченный доступ к личной информации только для авторизованного персонала
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Раскрытие информации</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Мы не продаем, не обмениваем и не передаем вашу личную информацию третьим лицам без вашего согласия, за исключением следующих случаев:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Когда это необходимо для соблюдения закона, судебного приказа или юридического процесса
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Lock className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Для защиты наших прав, собственности или безопасности, а также прав, собственности или безопасности наших пользователей или других лиц
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Server className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        С доверенными поставщиками услуг, которые помогают нам в работе нашего сервера и веб-сайта (эти стороны обязаны сохранять конфиденциальность и использовать информацию только для предоставления запрошенных услуг)
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Ваши права</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    В отношении вашей личной информации вы имеете следующие права:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Eye className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Право на доступ к вашей личной информации, которую мы храним
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Database className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Право на исправление неточной или неполной информации
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Lock className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Право на удаление вашей личной информации при определенных обстоятельствах
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Shield className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Право на ограничение обработки вашей личной информации
                      </span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    Для осуществления этих прав, пожалуйста, свяжитесь с нами по адресу support@eternalcore.ru.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Хранение данных</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Мы храним вашу личную информацию только до тех пор, пока это необходимо для целей, описанных в этой Политике конфиденциальности, или в соответствии с требованиями законодательства.
                  </p>
                  <p className="text-muted-foreground">
                    Игровые данные, такие как история действий и чат-логи, могут храниться до 6 месяцев для целей модерации и безопасности. Данные учетной записи хранятся до тех пор, пока вы активно используете наш сервер, и могут быть удалены по вашему запросу.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Изменения в политике конфиденциальности</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Мы можем обновлять нашу Политику конфиденциальности время от времени. Мы уведомим вас о любых изменениях, разместив новую Политику конфиденциальности на этой странице и обновив дату "Последнее обновление" внизу страницы.
                  </p>
                  <p className="text-muted-foreground">
                    Рекомендуем периодически проверять эту Политику конфиденциальности на предмет изменений. Изменения в этой Политике конфиденциальности вступают в силу с момента их публикации на этой странице.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Контактная информация</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Если у вас есть вопросы или предложения относительно нашей Политики конфиденциальности, пожалуйста, свяжитесь с нами:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>По электронной почте: <a href="mailto:support@eternalcore.ru" className="text-[#FB0D68] hover:underline">support@eternalcore.ru</a></li>
                    <li>Через Discord: <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">https://discord.gg/eternalcore</a> в канале #поддержка</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl mt-8 bg-muted/30 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">
                Последнее обновление: 10 апреля 2025 г.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
