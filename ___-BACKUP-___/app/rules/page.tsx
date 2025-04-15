import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Users, MessageCircle, Ban, Info, Mail } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function RulesPage() {
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
              Правила
            </Badge>
            <h1 className="max-w-[500px] text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none bg-gradient-to-r from-[#DF2456] to-[#FB0D68] text-transparent bg-clip-text">
              Правила сервера EternalCore
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Ознакомьтесь с правилами нашего сервера для комфортной игры всех участников
            </p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="w-full max-w-4xl bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-[#FB0D68]" />
                <h2 className="text-xl font-bold">Важное примечание</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                EternalCore - это сервер с минимальными ограничениями, ориентированный на анархию и свободу действий. Однако, для поддержания здоровой игровой среды, мы установили несколько базовых правил, которые необходимо соблюдать всем игрокам.
              </p>
              <p className="text-muted-foreground">
                Незнание правил не освобождает от ответственности. Регистрируясь на сервере, вы автоматически соглашаетесь с нижеприведенными правилами.
              </p>
            </div>

            <Tabs defaultValue="general" className="w-full max-w-4xl">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Общие правила</TabsTrigger>
                <TabsTrigger value="gameplay">Игровой процесс</TabsTrigger>
                <TabsTrigger value="chat">Общение</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-6">
                <Card className="border-[#DF2456]/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle>Общие правила сервера</CardTitle>
                    </div>
                    <CardDescription>
                      Базовые правила, обязательные для всех игроков
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-base font-medium">
                          1. Запрещено использование читов и хаков
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено использование любых модификаций, дающих нечестное преимущество в игре:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>X-Ray текстуры и моды</li>
                            <li>Читы для полёта (кроме полученных через донат)</li>
                            <li>Автоматические боты и макросы</li>
                            <li>Читы для PvP (килаура, автоклик и т.д.)</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Первое нарушение: бан на 7 дней</p>
                            <p className="text-sm">Повторное нарушение: перманентный бан</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-base font-medium">
                          2. Запрещены действия, направленные на нарушение работы сервера
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещены любые действия, направленные на нарушение стабильной работы сервера:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>DDoS-атаки</li>
                            <li>Намеренное создание лаг-машин</li>
                            <li>Эксплуатация уязвимостей сервера</li>
                            <li>Намеренное создание большой нагрузки на сервер</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Перманентный бан без права на обжалование</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-base font-medium">
                          3. Запрещено выдавать себя за администрацию сервера
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено любым способом выдавать себя за представителя администрации сервера:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Использование никнеймов, похожих на ники администраторов</li>
                            <li>Утверждение, что вы являетесь администратором/модератором</li>
                            <li>Попытки обмана других игроков, представляясь членом администрации</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Первое нарушение: бан на 14 дней</p>
                            <p className="text-sm">Повторное нарушение: перманентный бан</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-base font-medium">
                          4. Запрещена продажа игровых ценностей за реальные деньги
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещена любая торговля игровыми предметами, валютой или привилегиями за реальные деньги между игроками:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Продажа игровых предметов за реальные деньги</li>
                            <li>Продажа игровых аккаунтов</li>
                            <li>Перепродажа донат-привилегий</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Бан на 30 дней и конфискация всех игровых ценностей</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="gameplay" className="mt-6">
                <Card className="border-[#DF2456]/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle>Правила игрового процесса</CardTitle>
                    </div>
                    <CardDescription>
                      Правила, касающиеся игрового процесса и взаимодействия между игроками
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg mb-4 bg-[#DF2456]/5 border-[#DF2456]/20">
                      <h3 className="text-lg font-medium mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2 text-[#DF2456]" />
                        Особенности сервера
                      </h3>
                      <p className="text-muted-foreground">
                        EternalCore - это сервер с элементами анархии, где разрешены PvP, гриферство и рейды. Однако, некоторые ограничения всё же существуют для поддержания баланса.
                      </p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-base font-medium">
                          1. PvP и гриферство
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            На сервере разрешены:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>PvP в любой точке мира (кроме спавна)</li>
                            <li>Разрушение построек других игроков</li>
                            <li>Кража ресурсов из чужих сундуков</li>
                            <li>Создание ловушек для других игроков</li>
                          </ul>
                          <p className="mt-3">
                            Это часть игрового процесса, и администрация не вмешивается в подобные конфликты. Защищайте свои постройки и ресурсы самостоятельно.
                          </p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-base font-medium">
                          2. Защищенные территории
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            На сервере существуют защищенные территории:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Спавн и прилегающая территория (500x500 блоков)</li>
                            <li>Территории, защищенные через донат-привилегии</li>
                            <li>Официальные территории для мероприятий</li>
                          </ul>
                          <p className="mt-3">
                            Попытки обойти защиту этих территорий запрещены и наказываются.
                          </p>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Бан на срок от 3 до 14 дней в зависимости от тяжести нарушения</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-base font-medium">
                          3. Использование ресурсов сервера
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено чрезмерное использование ресурсов сервера:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Создание механизмов, вызывающих сильные лаги</li>
                            <li>Намеренное переполнение чанков сущностями</li>
                            <li>Создание механизмов с бесконечными циклами</li>
                          </ul>
                          <p className="mt-3">
                            Администрация оставляет за собой право удалять подобные механизмы без предупреждения.
                          </p>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Предупреждение и удаление механизма при первом нарушении</p>
                            <p className="text-sm">Бан на 3 дня при повторном нарушении</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-base font-medium">
                          4. Дюпы и эксплойты
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено использование дюпов (дублирование предметов) и эксплойтов:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Использование багов для дублирования предметов</li>
                            <li>Эксплуатация уязвимостей в плагинах сервера</li>
                            <li>Использование багов для получения запрещенных предметов</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Бан на 14 дней и конфискация всех дублированных предметов</p>
                            <p className="text-sm">Перманентный бан при повторном нарушении</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-6">
                <Card className="border-[#DF2456]/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-[#DF2456]" />
                      <CardTitle>Правила общения</CardTitle>
                    </div>
                    <CardDescription>
                      Правила поведения в чате и при общении с другими игроками
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-base font-medium">
                          1. Запрещены оскорбления и дискриминация
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещены любые формы оскорблений и дискриминации:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Оскорбления по расовому, национальному, религиозному признаку</li>
                            <li>Дискриминация по полу, возрасту, ориентации</li>
                            <li>Прямые оскорбления других игроков</li>
                            <li>Травля и целенаправленное преследование игроков</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Первое нарушение: мут на 24 часа</p>
                            <p className="text-sm">Повторное нарушение: мут на 7 дней</p>
                            <p className="text-sm">Систематические нарушения: бан на 14 дней</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-base font-medium">
                          2. Запрещен спам и флуд
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено засорение чата:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Многократное повторение одного и того же сообщения</li>
                            <li>Отправка бессмысленных символов</li>
                            <li>Чрезмерное использование CAPS LOCK</li>
                            <li>Реклама сторонних серверов и ресурсов</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Первое нарушение: мут на 1 час</p>
                            <p className="text-sm">Повторное нарушение: мут на 24 часа</p>
                            <p className="text-sm">Систематические нарушения: мут на 7 дней</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-3">
                        <AccordionTrigger className="text-base font-medium">
                          3. Запрещено распространение вредоносных ссылок
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено распространение:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Вредоносных ссылок</li>
                            <li>Фишинговых сайтов</li>
                            <li>Ссылок на ресурсы с вирусами</li>
                            <li>Ссылок на нелегальный контент</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Перманентный бан без права на обжалование</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="item-4">
                        <AccordionTrigger className="text-base font-medium">
                          4. Запрещено обсуждение политики
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          <p className="mb-2">
                            Запрещено обсуждение политических тем:
                          </p>
                          <ul className="list-disc pl-6 space-y-1">
                            <li>Обсуждение политических деятелей и партий</li>
                            <li>Обсуждение политических конфликтов</li>
                            <li>Политическая агитация</li>
                            <li>Провокационные высказывания на политические темы</li>
                          </ul>
                          <div className="mt-3 p-2 bg-[#FB0D68]/10 rounded-md">
                            <p className="text-sm font-medium">Наказание:</p>
                            <p className="text-sm">Первое нарушение: предупреждение</p>
                            <p className="text-sm">Повторное нарушение: мут на 24 часа</p>
                            <p className="text-sm">Систематические нарушения: мут на 7 дней</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="w-full max-w-4xl mt-8">
              <h2 className="text-xl font-bold mb-4">Система наказаний</h2>
              <Card className="border-[#DF2456]/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Ban className="h-5 w-5 text-[#FB0D68]" />
                    <CardTitle>Виды наказаний</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Предупреждение</h3>
                      <p className="text-sm text-muted-foreground">
                        Выдается за незначительные нарушения. Три предупреждения автоматически конвертируются в мут на 1 час.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Мут</h3>
                      <p className="text-sm text-muted-foreground">
                        Временное ограничение возможности писать в чат. Выдается за нарушения правил общения.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Временный бан</h3>
                      <p className="text-sm text-muted-foreground">
                        Временное ограничение доступа к серверу. Срок зависит от тяжести нарушения.
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Перманентный бан</h3>
                      <p className="text-sm text-muted-foreground">
                        Полное ограничение доступа к серверу без возможности восстановления. Выдается за серьезные нарушения.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl mt-4">
              <h2 className="text-xl font-bold mb-4">Обжалование наказаний</h2>
              <Card className="border-[#DF2456]/20">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    Если вы считаете, что наказание было выдано несправедливо, вы можете обжаловать его через следующие каналы:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <MessageCircle className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span className="text-muted-foreground">
                        Через Discord сервер в специальном канале #обжалование-наказаний
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="rounded-full bg-[#DF2456]/10 p-1 mr-3 mt-0.5">
                        <Mail className="h-4 w-4 text-[#DF2456]" />
                      </div>
                      <span className="text-muted-foreground">
                        По электронной почте support@eternalcore.ru с темой "Обжалование наказания"
                      </span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm">
                      <strong>Важно:</strong> При обжаловании укажите свой никнейм, дату и причину наказания, а также объяснение, почему вы считаете наказание несправедливым. Решение по обжалованию принимается в течение 48 часов.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-full max-w-4xl mt-8 bg-muted/30 rounded-lg p-6 text-center">
              <h2 className="text-xl font-bold mb-2">Изменение правил</h2>
              <p className="text-muted-foreground">
                Администрация оставляет за собой право изменять правила сервера без предварительного уведомления. Рекомендуем периодически проверять данную страницу для ознакомления с актуальной версией правил.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
