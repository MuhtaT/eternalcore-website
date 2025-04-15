import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Gavel, ScrollText, CreditCard, Check, Users, AlertTriangle, RefreshCw } from 'lucide-react'

export default function OfferAgreementPage() {
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
              Договор оферты
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Правовые условия предоставления услуг и приобретения игровых привилегий
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ScrollText className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">1. Общие положения</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    1.1. Настоящий документ является публичной офертой (далее - "Оферта") администрации проекта EternalCore (далее - "Администрация") и содержит все существенные условия предоставления услуг и привилегий на сервере Minecraft EternalCore (далее - "Сервер").
                  </p>
                  <p className="text-muted-foreground mb-4">
                    1.2. В соответствии с пунктом 2 статьи 437 Гражданского Кодекса Российской Федерации, настоящая Оферта является публичной офертой. Внося пожертвование или оплачивая услуги, предоставляемые Администрацией проекта, вы соглашаетесь с условиями настоящей Оферты в полном объеме и безоговорочно.
                  </p>
                  <p className="text-muted-foreground">
                    1.3. Оферта вступает в силу с момента ее размещения на веб-сайте EternalCore по адресу https://eternalcore.ru/legal/offer-agreement и действует до момента ее отзыва Администрацией проекта.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Gavel className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">2. Термины и определения</h2>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <FileText className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">2.1. Договор-оферта</h3>
                        <p className="text-sm text-muted-foreground">
                          Настоящий документ, опубликованный в сети Интернет по адресу https://eternalcore.ru/legal/offer-agreement.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Users className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">2.2. Акцепт оферты</h3>
                        <p className="text-sm text-muted-foreground">
                          Полное и безоговорочное принятие оферты путем осуществления Пользователем действий по оплате услуг или внесению пожертвования на сервер EternalCore.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <Check className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">2.3. Пользователь</h3>
                        <p className="text-sm text-muted-foreground">
                          Физическое лицо, осуществляющее акцепт оферты и получающее соответствующие игровые привилегии или услуги на сервере Minecraft EternalCore.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="rounded-full bg-[#DF2456]/10 p-2 h-fit">
                        <CreditCard className="h-5 w-5 text-[#DF2456]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">2.4. Донат-пакет/Привилегия</h3>
                        <p className="text-sm text-muted-foreground">
                          Набор виртуальных привилегий или возможностей, предоставляемых Пользователю на сервере Minecraft EternalCore в обмен на пожертвование или оплату.
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
                    <CreditCard className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">3. Предмет оферты</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    3.1. Предметом настоящей оферты является предоставление Пользователю возможности использования дополнительных виртуальных игровых возможностей (привилегий) на сервере Minecraft EternalCore в обмен на внесение пожертвования или оплаты услуг Администрации сервера.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    3.2. Все доступные привилегии, их стоимость и включенные возможности указаны в разделе "Донат" на официальном сайте проекта по адресу https://eternalcore.ru/donate.
                  </p>
                  <p className="text-muted-foreground">
                    3.3. При приобретении привилегии, Пользователь получает доступ к указанным возможностям на весь срок их действия, если иное не указано в описании конкретной привилегии или донат-пакета.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Check className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">4. Порядок заключения договора</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    4.1. Договор считается заключенным с момента поступления денежных средств от Пользователя на счет Администрации проекта.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    4.2. Для приобретения привилегии Пользователь должен выполнить следующие действия:
                  </p>
                  <ul className="space-y-2 text-muted-foreground mb-4">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Выбрать желаемую привилегию или донат-пакет на сайте проекта
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Указать свой игровой никнейм в Minecraft
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Выбрать способ оплаты и произвести оплату
                      </span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    4.3. После успешной оплаты привилегия активируется автоматически на сервере, и Пользователь получает соответствующее уведомление.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">5. Права и обязанности сторон</h2>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">5.1. Администрация обязуется:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Предоставить Пользователю доступ к выбранной и оплаченной привилегии
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Обеспечить функционирование сервера для использования приобретенных привилегий
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Предоставлять техническую поддержку по вопросам, связанным с использованием привилегий
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">5.2. Пользователь обязуется:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Соблюдать правила сервера Minecraft EternalCore
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Не передавать доступ к своему аккаунту третьим лицам
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Не использовать предоставленные привилегии в целях, противоречащих правилам сервера
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ScrollText className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">6. Ответственность сторон</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    6.1. Администрация проекта имеет право лишить Пользователя приобретенных привилегий без возврата денежных средств в случае нарушения Пользователем правил сервера или условий настоящей Оферты.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    6.2. Администрация не несет ответственности за возможные технические неполадки или временную недоступность сервера, если это вызвано причинами, не зависящими от Администрации.
                  </p>
                  <p className="text-muted-foreground">
                    6.3. Пользователь несет полную ответственность за сохранность своего аккаунта и пароля. Администрация не компенсирует утрату привилегий в случае взлома аккаунта Пользователя третьими лицами.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <RefreshCw className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">7. Политика возврата средств</h2>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">7.1. Условия возврата:</h3>
                    <p className="text-muted-foreground mb-4">
                      Вы можете запросить возврат средств в следующих случаях:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Если полученные услуги были некачественными или не соответствуют описанию
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Если привилегии не были предоставлены в соответствии с условиями заказа
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Если произошла техническая ошибка или двойная оплата
                        </span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">7.2. Процедура возврата:</h3>
                    <p className="text-muted-foreground mb-4">
                      Для запроса возврата свяжитесь с нашей службой поддержки одним из следующих способов:
                    </p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Отправьте email на адрес <a href="mailto:support@eternalcore.ru" className="text-[#FB0D68] hover:underline">support@eternalcore.ru</a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Обратитесь через наш официальный <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">Discord-сервер</a>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Используйте форму обратной связи на сайте в разделе <a href="/contacts" className="text-[#FB0D68] hover:underline">Контакты</a>
                        </span>
                      </li>
                    </ul>
                    <p className="text-muted-foreground">
                      При обращении необходимо указать: ваш игровой никнейм, дату и способ оплаты, причину запроса возврата и, если возможно, предоставить подтверждение оплаты (скриншот, номер транзакции).
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">7.3. Сроки возврата:</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Мы постараемся рассмотреть ваш запрос в кратчайшие сроки, обычно в течение 3-5 рабочих дней
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          В случае одобрения возврата, средства будут возвращены тем же способом, которым была произведена оплата
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-[#DF2456]" />
                        </div>
                        <span>
                          Время зачисления денежных средств на счет может занять от 5 до 14 банковских дней в зависимости от платежной системы
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Gavel className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">8. Заключительные положения</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    8.1. Администрация оставляет за собой право вносить изменения в настоящую Оферту в одностороннем порядке, публикуя новую редакцию на официальном сайте проекта.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    8.2. Все споры и разногласия, возникающие между сторонами по настоящей Оферте, разрешаются путем переговоров между ними. В случае невозможности разрешения споров путем переговоров, они подлежат разрешению в соответствии с действующим законодательством Российской Федерации.
                  </p>
                  <p className="text-muted-foreground">
                    8.3. Настоящая Оферта действует до момента ее отзыва Администрацией проекта.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl">
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-[#DF2456]" />
                    <h2 className="text-xl font-bold">9. Контактная информация</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    9.1. Связаться с Администрацией проекта EternalCore можно следующими способами:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Email: <a href="mailto:support@eternalcore.ru" className="text-[#FB0D68] hover:underline">support@eternalcore.ru</a>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Discord: <a href="https://discord.gg/eternalcore" className="text-[#FB0D68] hover:underline" target="_blank" rel="noopener noreferrer">https://discord.gg/eternalcore</a>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span>
                        Через форму обратной связи на официальном сайте проекта
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl pt-8">
              <p className="text-center text-sm text-muted-foreground">
                Дата последнего обновления: 14 апреля 2025 г.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 