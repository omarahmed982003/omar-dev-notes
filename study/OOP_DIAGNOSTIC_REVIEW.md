# مراجعة خاصة — OOP Diagnostic Assessment 0.1

> هذا الملف مادة دراسة خاصة، وليس درسًا عامًا للنشر. يحتوي على إجابات الطالب وملاحظات التقييم.

## الهدف

قياس الفهم الحالي لمفاهيم OOP قبل بدء المنهج، وتحديد النقاط التي تحتاج إلى تثبيت. هذه المراجعة لا تمثل نتيجة نهائية؛ الـCheckpoint ما زال `In Progress` إلى أن يتم تقييمه باستخدام معايير معلنة وتمرين عملي واضح.

## 1. Class وObject

### السؤال

ما الفرق بين `Class` و`Object`؟ وهل يمكن إنشاء أكثر من Object من نفس Class ولكل واحد State مختلفة؟

### إجابة الطالب

> الكلاس هي الـblueprint، والـObject نسخة مستقلة منها. كل Object مستقل بالـState الخاصة به، ويمكن إنشاء عدد كبير من Objects من نفس Class.

### المراجعة والشرح

الإجابة صحيحة. الـ`Class` يعرّف شكل الـState والـBehavior المتاح، بينما الـ`Object` كيان فعلي له `Identity` و`State` خاصة به. تشبيه الـBlueprint مفيد كبداية، لكنه غير كامل؛ فالـClass لا يصف البيانات فقط، بل يحدد السلوك والقواعد أيضًا.

## 2. Inheritance وInterface والعلاقات

### السؤال

ما الفرق بين `Inheritance` و`Interface`؟ ومتى نستخدم كلًا منهما؟

### إجابة الطالب

> الـInheritance وراثة، والـInterface صفة مكتسبة. لو العلاقة `is-a` نستخدم Inheritance، ولو `has-a` نستخدم Interface.

### المراجعة والشرح

تم التعرف بصورة صحيحة على ارتباط `Inheritance` بعلاقة `is-a`، لكن احتاجت الإجابة إلى التصحيحات التالية:

- الـ`Interface` ليس علاقة `has-a`؛ هو `Contract` أو قدرة يلتزم الـClass بتنفيذها.
- علاقة `has-a` تعبّر غالبًا عن `Composition` أو `Dependency`.
- وجود علاقة لغوية من نوع `is-a` لا يكفي وحده لاختيار الوراثة؛ يجب أن يستطيع الـChild الحلول مكان الـParent من دون كسر العقد أو السلوك المتوقع.

مثال: `StripeGateway implements PaymentGateway` يعني أن Stripe يحقق عقد الدفع. أما `OrderService has-a PaymentGateway` فتعني أن الخدمة تعتمد على مكوّن دفع.

## 3. Dependency Injection وTight Coupling

### السؤال

هل ينشئ `OrderService` كائن `StripeGateway` داخله، أم يستقبل `PaymentGateway` من الخارج؟

### إجابة الطالب

> يستقبل الـContract في الـconstructor، حتى لا يعتمد على Payment Object معين ويمكن تغييره لاحقًا.

### المراجعة والشرح

الإجابة صحيحة. استقبال الـdependency من الخارج هو `Dependency Injection`، واستخدام الـInterface يسمح باستبدال التنفيذ. لكن مجرد تعريف Interface لا يحقق Loose Coupling إذا ظل `OrderService` ينشئ `StripeGateway` بنفسه.

اختيار وإنشاء التنفيذ يتمان في كود خارجي يسمى غالبًا `Composition Root`. قد يستخدم هذا الكود `Factory` أو DI Container، لكن وجود Factory ليس شرطًا دائمًا.

## 4. الوراثة غير المناسبة

### السؤال

هل `Penguin extends Bird` تصميم مناسب إذا كان `Bird` يفرض method اسمها `fly()`؟

### إجابة الطالب

> لا، يمكن جعل `fly` Interface، والذي لديه هذه القدرة ينفذها.

### المراجعة والشرح

الإجابة قوية. البطريق طائر في التصنيف الواقعي، لكنه لا يستطيع الالتزام بعقد `fly()`. لذلك قد تفشل قابلية الاستبدال. فصل القدرة في `Flyable` يجعل العقد متاحًا فقط للأنواع القادرة فعلًا على الطيران.

## 5. Object References وCloning

### السؤال

ما الفرق بين إسناد Object إلى متغير آخر وبين استخدام `clone`؟

### إجابة الطالب

> في الإسناد، المتغيران يشيران إلى نفس الـObject. مع `clone` يصبح لكل متغير Object مختلف.

### المراجعة والشرح

الإجابة صحيحة. تعديل الـState من خلال أحد المتغيرين بعد الإسناد يظهر من الآخر لأنهما يشيران إلى نفس الـObject. أما `clone` فينشئ Object جديدًا. مع ذلك، `clone` في PHP يعمل افتراضيًا كـ`Shallow Copy`؛ فالـObjects المتداخلة قد تظل مشتركة.

## 6. Equality وIdentity

### السؤال

ما الفرق بين `==` و`===` عند مقارنة Objects في PHP؟

### إجابة الطالب

> لم أكن أعرف الفرق في البداية.

وبعد الشرح، تم التعرف على أن Object مستنسخًا بنفس القيم يحقق `==` ولا يحقق `===`.

### المراجعة والشرح

- `==` يقارن الـClass وقيم الـproperties.
- `===` يتحقق من أن المتغيرين يشيران إلى نفس الـObject بالضبط.

كانت هناك محاولة أولى اعتبرت أن متغيرين يشيران إلى نفس Object قد يفشلان في `==`، ثم تم تصحيحها: إذا تحقق `===` بين Objectين فسيتحقق `==` أيضًا.

## 7. Encapsulation

### السؤال

هل جعل كل properties خاصة وإضافة getters وsetters لها يحقق Encapsulation جيدًا تلقائيًا؟

### إجابة الطالب

> لا، هذه Data Hiding، وهي مفهوم ضمن Encapsulation.

### المراجعة والشرح

الإجابة صحيحة. `Encapsulation` لا يعني إخفاء البيانات شكليًا فقط؛ بل يعني أن يمتلك الـObject بياناته ويحمي قواعده أو `Invariants`. لذلك يفضل أن تعرض `Wallet` سلوكًا مثل `deposit()` و`withdraw()` بدل `setBalance()` يسمح بوضع أي قيمة.

## 8. Abstract Class وInterface

### السؤال

ما الفرق بينهما من ناحية الـState والتنفيذ وعدد ما يمكن للClass أن يرثه أو يطبقه؟

### إجابة الطالب

> الـClass ترث Class واحدة ويمكنها تنفيذ أكثر من Interface. معنى State لم يكن واضحًا.

### المراجعة والشرح

جزء العدد كان صحيحًا. المقصود بالـState هو البيانات الحالية داخل كل Object، مثل `balance` و`status`.

في PHP 8.3، تستطيع `abstract class` الاحتفاظ بـproperties وتوفير methods مكتملة إلى جانب abstract methods. أما `interface` فيعرّف Contract بلا instance state أو تنفيذ سلوكي عادي. اختلاف State بين implementations ليس وحده سبب اختيار Interface؛ السبب الأقوى هو الحاجة إلى Contract قابل للتبديل من دون افتراض أصل عائلي مشترك.

## 9. توزيع المسؤوليات

### السؤال

ما المشكلة في `OrderService` يقوم بالـvalidation وحساب الإجمالي وتنفيذ SQL والدفع وإرسال البريد والـlogging؟

### إجابة الطالب

> الـClass يفعل كل شيء. يمكن فصل validation، وجعل الدفع والبريد والـlogging في Classes منفصلة، واستخدام Event للبريد.

### المراجعة والشرح

تم اكتشاف المسؤوليات المختلطة بصورة صحيحة. توجد تفاصيل تحتاج إلى مزيد من التدريب:

- قواعد حساب الإجمالي قد تنتمي إلى `Order` نفسه أو Domain Service مناسب، وليس تلقائيًا إلى `OrderService`.
- التخزين خلف `OrderRepository` أفضل من تنفيذ SQL داخل الخدمة.
- الـvalidation غالبًا يقع عند حدود دخول الطلب.
- الـEvents مناسبة لبعض الآثار الجانبية، لكن الإفراط فيها قد يخفي مسار التنفيذ.

## 10. Class مليئة بـStatic Helpers

### السؤال

هل نقل مجموعة functions إلى `OrderHelper` كـstatic methods يجعل التصميم Object-Oriented؟

### إجابة الطالب

> لا، وجود Class لا يجعله OOP.

### المراجعة والشرح

الإجابة الأساسية صحيحة، لكن تفسير البديل احتاج إلى توجيه. التصميم الكائني يهتم بـObjects تمتلك State وسلوكًا يحميها، ومسؤوليات واضحة، وتعاون بين Objects. ومع ذلك، ليس مطلوبًا أن يمتلك كل Service State؛ قد توجد خدمة بلا State إذا كانت تؤدي مسؤولية منطقية واضحة.

## 11. تمرين تصميم Checkout

### المطلوب

تصميم عملية تدفع Order ثم ترسل تأكيدًا للعميل، مع تحديد Classes وInterfaces ومسؤولية كل منها.

### إجابة الطالب

> `Payable` interface، وPayment Methods مثل Wallet وStripe تنفذ `pay()`. كانت هناك صعوبة في تركيب باقي الـObjects معًا.

ثم كتب الطالب pseudo-code يوضح:

- `PaymentGateway` contract يحتوي `pay()`.
- `CheckoutService` يستقبل العقد في الـconstructor.
- `checkout()` يفوض عملية الدفع إلى الـGateway.

### المراجعة والشرح

الفكرة الأساسية في الـpseudo-code صحيحة: Contract وConstructor Injection وDelegation. الصعوبة الحقيقية ظهرت في اكتشاف المجموعة الكاملة من المتعاونين وتحديد حدود مسؤولياتهم بصورة مستقلة.

تصور تعليمي مبدئي:

- `Order`: يمتلك بيانات الطلب وقواعد حالته.
- `PaymentGateway`: عقد تنفيذ الدفع.
- `StripeGateway` و`WalletGateway`: implementations للعقد.
- `OrderRepository`: عقد حفظ واسترجاع الطلبات.
- `OrderConfirmationSender`: عقد إرسال التأكيد.
- `CheckoutService`: ينسق الـuse case ولا ينفذ تفاصيل الدفع أو التخزين أو الإرسال بنفسه.

اسم `Payable` قد يوحي بأن الـObject نفسه قابل للدفع، بينما `PaymentGateway` أو `PaymentProcessor` أوضح لمكوّن ينفذ عملية الدفع.

## نقاط القوة المثبتة

- فهم الفرق الأساسي بين Class وObject.
- فهم استقلال State بين Objects.
- اكتشاف Tight Coupling والحاجة إلى Dependency Injection.
- فهم Interface كعقد قابل للتبديل بعد التصحيح.
- اكتشاف الوراثة غير المناسبة في مثال Penguin.
- فهم الفرق الأساسي بين الإسناد و`clone`.
- فهم أن Data Hiding وحدها لا تكفي لتحقيق Encapsulation.
- اكتشاف Classes ذات المسؤوليات المختلطة.

## نقاط تحتاج إلى تثبيت

- تصميم تعاون كامل بين Objects انطلاقًا من use case.
- تحديد موضع Business Rules بدل وضعها تلقائيًا في Service.
- التمييز الدقيق بين Association وDependency وComposition.
- معايير الاختيار بين `abstract class` و`interface`.
- Equality وIdentity في PHP.
- Composition Root وحدوده مقارنة بـFactory وDI Container.

## حالة التقييم

- Checkpoint: `0.1 — Diagnostic Assessment`
- Status: `In Progress`
- Final Score: `Pending`
- السبب: التقييم السابق لم يستخدم Rubric معلنًا قبل الأسئلة، لذلك أُلغي الرقم بدل استبداله برقم تقديري آخر.
- الخطوة التالية: عند طلب الطالب الاستمرار، يُعرض Rubric واضح أولًا ثم يُجرى تمرين تصميم عملي مستقل قبل تسجيل النتيجة النهائية.
