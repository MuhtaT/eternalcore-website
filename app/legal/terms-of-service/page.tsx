import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, FileText, Server, Database, Clock } from 'lucide-react'

export default function TermsOfServicePage() {
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
            <h1 className="max-w-[500px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Пользовательское соглашение
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Условия использования сервера EternalCore
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Введение</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Настоящее Пользовательское соглашение (далее "Соглашение") регулирует отношения между EternalCore (далее "мы", "нас" или "наш") и пользователями (далее "вы" или "ваш") нашего Minecraft сервера и связанных с ним веб-сайтов и сервисов.
                  </p>
                  <p className="text-muted-foreground">
                    Используя наш сервер и сервисы, вы соглашаетесь с условиями данного Соглашения. Если вы не согласны с условиями, пожалуйста, не используйте наш сервер и сервисы.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Условия использования</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">1. Регистрация и учетная запись</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        1.1. Для использования нашего сервера вам необходимо иметь лицензионную копию игры Minecraft.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        1.2. Вы несете ответственность за сохранение конфиденциальности вашей учетной записи и пароля.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        1.3. Вы соглашаетесь немедленно уведомить нас о любом несанкционированном использовании вашей учетной записи или любом другом нарушении безопасности.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">2. Правила поведения</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        2.1. Вы соглашаетесь соблюдать все правила сервера, опубликованные на нашем веб-сайте или в игре.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        2.2. Вы соглашаетесь не использовать сервер для любых незаконных целей или в нарушение любых местных, государственных, национальных или международных законов.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2.3. Вы соглашаетесь не использовать читы, хаки или другие модификации, которые дают нечестное преимущество или нарушают работу сервера.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">3. Контент пользователя</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        3.1. Вы сохраняете все права на любой контент, который вы создаете на сервере, при условии соблюдения наших прав на сервер и сервисы.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        3.2. Вы предоставляете нам неисключительную, бесплатную, сублицензируемую лицензию на использование, воспроизведение, изменение, адаптацию, публикацию и отображение такого контента в связи с нашими услугами.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        3.3. Вы заявляете и гарантируете, что ваш контент не нарушает права третьих лиц и соответствует нашим правилам.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Server className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Донат и платежи</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">4. Донат-услуги</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        4.1. Мы предлагаем различные донат-услуги, которые предоставляют дополнительные возможности или преимущества на сервере.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        4.2. Все цены указаны в рублях и включают все применимые налоги.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        4.3. Донат-услуги предоставляются на условиях "как есть" и могут быть изменены или удалены в любое время без предварительного уведомления.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">5. Платежи и возвраты</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        5.1. Все платежи обрабатываются через наших платежных партнеров и подлежат их условиям.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        5.2. Все продажи являются окончательными, и возврат средств не производится, за исключением случаев, когда это требуется по закону.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        5.3. В случае технических проблем с донат-услугами, мы приложим все усилия для их исправления или предоставления альтернативной услуги.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Ограничение ответственности</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">6. Отказ от гарантий</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        6.1. Наш сервер и сервисы предоставляются на условиях "как есть" и "как доступно" без каких-либо гарантий, явных или подразумеваемых.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        6.2. Мы не гарантируем, что наш сервер будет работать бесперебойно, своевременно, безопасно или без ошибок.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        6.3. Мы не гарантируем, что результаты, которые могут быть получены от использования сервера, будут точными или надежными.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">7. Ограничение ответственности</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        7.1. Мы не несем ответственности за любые прямые, косвенные, случайные, особые или последующие убытки, возникающие в результате использования или невозможности использования нашего сервера или сервисов.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        7.2. Мы не несем ответственности за действия других пользователей, включая потерю игровых предметов, разрушение построек или другой ущерб, причиненный в игре.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        7.3. Наша максимальная ответственность перед вами за любые убытки, ущерб и основания для иска ограничивается суммой, уплаченной вами за донат-услуги, если таковые имеются.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Database className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Прекращение и изменения</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">8. Прекращение</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        8.1. Мы можем прекратить или приостановить ваш доступ к нашему серверу немедленно, без предварительного уведомления или ответственности, по любой причине, включая, без ограничений, нарушение условий настоящего Соглашения.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        8.2. После прекращения ваше право на использование сервера немедленно прекращается.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">9. Изменения в условиях</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        9.1. Мы оставляем за собой право, по нашему усмотрению, изменять или заменять эти условия в любое время.
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        9.2. Если изменение является существенным, мы постараемся уведомить вас за 30 дней до вступления в силу новых условий.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        9.3. Продолжая использовать наш сервер после внесения изменений, вы соглашаетесь с новыми условиями.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">Общие положения</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">10. Применимое право</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        10.1. Настоящее Соглашение регулируется и толкуется в соответствии с законодательством Российской Федерации, без учета его коллизионных норм.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        10.2. Любые споры, возникающие из или в связи с настоящим Соглашением, подлежат разрешению в компетентных судах Российской Федерации.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">11. Разделимость</h3>
                      <p className="text-sm text-muted-foreground">
                        11.1. Если какое-либо положение настоящего Соглашения будет признано недействительным или неисполнимым, такое положение будет изменено и истолковано для достижения целей этого положения в максимально возможной степени в соответствии с применимым законодательством, а остальные положения будут продолжать действовать в полной мере.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">12. Полнота соглашения</h3>
                      <p className="text-sm text-muted-foreground">
                        12.1. Настоящее Соглашение представляет собой полное соглашение между вами и нами относительно нашего сервера и заменяет все предыдущие соглашения и договоренности, устные или письменные, относительно сервера.
                      </p>
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
                    <h2 className="text-xl font-bold">Контактная информация</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Если у вас есть вопросы или предложения относительно нашего Пользовательского соглашения, пожалуйста, свяжитесь с нами:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>По электронной почте: support@eternalcore.ru</li>
                    <li>Через Discord: в канале #поддержка</li>
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
