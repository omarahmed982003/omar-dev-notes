// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	server: {
		allowedHosts: ['precious-joseph-which-luck.trycloudflare.com'],
	},
	integrations: [
		starlight({
			customCss: ['./src/styles/custom.css'],
			title: {
				ar: 'مكتبة عمر للبرمجة',
				en: 'Omar Programming Library',
			},
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'العربية',
					lang: 'ar',
					dir: 'rtl',
				},
				en: { label: 'English' },
			},
			components: {
				Header: './src/components/DocsHeader.astro',
				Sidebar: './src/components/TrackSidebar.astro',
				MobileMenuFooter: './src/components/EmptyMobileMenuFooter.astro',
			},
			sidebar: [
{
  "label": "أساسيات الكمبيوتر والبرمجة والشبكات",
  "translations": {
    "en": "Computer, programming, and networking fundamentals"
  },
  "items": [
    {
      "label": "دليل الموضوعات",
      "translations": {
        "en": "Topic guide"
      },
      "link": "programming-basics"
    },
    {
      "label": "أساسيات المبرمج: الجهاز ونظام التشغيل",
      "translations": {
        "en": "Programmer foundations: hardware and operating systems"
      },
      "collapsed": false,
      "items": [
        {
          "label": "داخل الكمبيوتر وأدوات التطوير",
          "translations": {
            "en": "Computer internals and development tools"
          },
          "link": "programming-basics/computer-in-depth"
        },
        {
          "label": "مكوّنات الهاردوير واللوحة الأم",
          "translations": {
            "en": "Hardware components and motherboard architecture"
          },
          "link": "programming-basics/computer-in-depth/03-hardware-architecture"
        },
        {
          "label": "السوفتوير: من الكود لبرنامج شغال",
          "translations": {
            "en": "Software: from source code to a running program"
          },
          "link": "programming-basics/computer-in-depth/software-and-runtime"
        },
        {
          "label": "نظام التشغيل: البنية والأنواع وطريقة العمل",
          "translations": {
            "en": "Operating-system architecture and types"
          },
          "link": "programming-basics/computer-in-depth/06-operating-systems"
        },
        {
          "label": "كيف ينفّذ المعالج التعليمات؟",
          "translations": {
            "en": "How a processor executes instructions"
          },
          "link": "programming-basics/computer-in-depth/04-cpu-gpu"
        },
        {
          "label": "تمثيل الأعداد والحروف في الذاكرة",
          "translations": {
            "en": "Representing numbers and characters in memory"
          },
          "link": "programming-basics/computer-in-depth/03-binary-languages-algorithms"
        },
        {
          "label": "تمثيل الصور والصوت والفيديو ووحدات الحجم",
          "translations": {
            "en": "Images, audio, video, and size units"
          },
          "link": "programming-basics/computer-fundamentals/18-media-and-units"
        },
        {
          "label": "العناوين والذاكرة الافتراضية",
          "translations": {
            "en": "Addresses and virtual memory"
          },
          "link": "programming-basics/computer-in-depth/05-ram-memory-buffers"
        },
        {
          "label": "حجز الذاكرة وعمر البيانات",
          "translations": {
            "en": "Allocation and the lifetime of data"
          },
          "link": "programming-basics/computer-in-depth/12-memory-allocation"
        },
        {
          "label": "نقل البيانات ومتى يصبح الحفظ ثابتًا",
          "translations": {
            "en": "Moving data and making writes durable"
          },
          "link": "programming-basics/computer-in-depth/13-buffers-and-durability"
        },
        {
          "label": "اقرأ ملفاتك واكتبها بالطرفية",
          "translations": {
            "en": "Read and write files from a terminal"
          },
          "link": "programming-basics/computer-in-depth/05-os-terminal-files-git"
        },
        {
          "label": "قنوات الأوامر والصلاحيات والبيئة",
          "translations": {
            "en": "Command channels, permissions, and environment"
          },
          "link": "programming-basics/computer-in-depth/17-terminal-environment"
        },
        {
          "label": "إمتى يفيد تشغيل أعمال كثيرة معًا؟",
          "translations": {
            "en": "When does parallel work help?"
          },
          "link": "programming-basics/computer-in-depth/15-parallel-work"
        },
        {
          "label": "من خطوات الحل إلى برنامج يعمل",
          "translations": {
            "en": "From solution steps to running code"
          },
          "link": "programming-basics/computer-in-depth/14-running-code"
        },
        {
          "label": "اختبر السلوك وحدّد سبب الخطأ",
          "translations": {
            "en": "Test behavior and locate a defect"
          },
          "link": "programming-basics/computer-in-depth/16-testing-and-debugging"
        }
      ]
    },
    {
      "label": "الشبكات والويب",
      "translations": {
        "en": "Networking and the web"
      },
      "collapsed": true,
      "items": [
        {
          "label": "الشبكات والويب",
          "translations": {
            "en": "Networking and the web"
          },
          "link": "programming-basics/networking-next"
        },
        {
          "label": "المرور الأول — أساس الشبكات والويب",
          "translations": {
            "en": "First pass — network and web foundations"
          },
          "collapsed": false,
          "items": [
            {
              "label": "الإنترنت والويب ورحلة الطلب",
              "translations": {
                "en": "The internet, the web, and a request's journey"
              },
              "link": "programming-basics/01-web-and-request-flow"
            },
            {
              "label": "كيف تتواصل الأجهزة داخل الشبكة المحلية؟",
              "translations": {
                "en": "How devices communicate on a local network"
              },
              "link": "programming-basics/14-network-layers-lan-ethernet-arp"
            },
            {
              "label": "إعدادات عنوان الجهاز والاتصال",
              "translations": {
                "en": "Device addresses and connection settings"
              },
              "link": "programming-basics/15-addressing-dhcp-nat-routing-ipv6"
            },
            {
              "label": "كيف يتحول اسم الموقع إلى عنوان؟",
              "translations": {
                "en": "How a domain name becomes an address"
              },
              "link": "programming-basics/02-dns-and-ip"
            },
            {
              "label": "عنوان الويب والمنافذ وبروتوكول HTTP",
              "translations": {
                "en": "Web addresses, ports, and HTTP"
              },
              "link": "programming-basics/04-url-ports-http"
            },
            {
              "label": "الحروف والرموز داخل عنوان الويب",
              "translations": {
                "en": "Characters and encoding in web addresses"
              },
              "link": "programming-basics/21-url-encoding"
            },
            {
              "label": "TCP: الاتصال من أول SYN لحد الإغلاق",
              "translations": {
                "en": "TCP: from establishment to closure"
              },
              "link": "programming-basics/03-tcp-udp-packets"
            },
            {
              "label": "UDP: رسائل مستقلة",
              "translations": {
                "en": "UDP: independent messages"
              },
              "link": "programming-basics/udp"
            },
            {
              "label": "اقرأ طلب HTTP وردّه",
              "translations": {
                "en": "Read an HTTP request and response"
              },
              "link": "programming-basics/05-http-messages-state"
            },
            {
              "label": "تذكّر المستخدم وحماية التعديلات",
              "translations": {
                "en": "Remembering users and protecting updates"
              },
              "link": "programming-basics/22-http-state-and-updates"
            },
            {
              "label": "تشفير الاتصال وشهادات المواقع",
              "translations": {
                "en": "Connection encryption and website certificates"
              },
              "link": "programming-basics/06-https-tls-certificates"
            },
            {
              "label": "كيف يعرض المتصفح الصفحة؟",
              "translations": {
                "en": "How the browser displays a page"
              },
              "link": "programming-basics/09-browser-rendering-devtools"
            },
            {
              "label": "جهّز معمل الطلب والرد على جهازك",
              "translations": {
                "en": "Set up a local request-and-response lab"
              },
              "link": "programming-basics/32-local-network-lab"
            }
          ]
        },
        {
          "label": "ارجع بعد التطبيق — تعمق وتشخيص",
          "translations": {
            "en": "Return after practice — depth and diagnosis"
          },
          "collapsed": true,
          "items": [
            {
              "label": "تقسيم الشبكة ومنع دوران الإطارات",
              "translations": {
                "en": "Segment networks and prevent frame loops"
              },
              "link": "programming-basics/28-lan-segmentation"
            },
            {
              "label": "اتصل بشبكة Wi-Fi وافهم مشاكلها",
              "translations": {
                "en": "Connect to Wi-Fi and diagnose problems"
              },
              "link": "programming-basics/18-wifi-practical-basics"
            },
            {
              "label": "احسب حدود الشبكة من عنوانها",
              "translations": {
                "en": "Calculate a subnet from its address"
              },
              "link": "programming-basics/26-subnet-calculations"
            },
            {
              "label": "اختيار الطريق وقراءة عناوين IPv6",
              "translations": {
                "en": "Choose a route and read IPv6 addresses"
              },
              "link": "programming-basics/27-routing-and-ipv6"
            },
            {
              "label": "MTU: حجم الحزم وتشخيص المسار",
              "translations": {
                "en": "MTU: packet size and path diagnosis"
              },
              "link": "programming-basics/20-transport-diagnostics"
            },
            {
              "label": "تحميل البرامج وترتيب مهام المتصفح",
              "translations": {
                "en": "Load scripts and schedule browser tasks"
              },
              "link": "programming-basics/29-browser-scheduling"
            },
            {
              "label": "رحلة الطلب داخل الخادم",
              "translations": {
                "en": "A request's journey inside the server"
              },
              "link": "programming-basics/07-server-side-path"
            },
            {
              "label": "الخوادم الوسيطة وتوزيع الطلبات",
              "translations": {
                "en": "Proxies and request distribution"
              },
              "link": "programming-basics/08-server-proxy-api-gateway"
            },
            {
              "label": "توزيع الحمل وسياسات الوسيط",
              "translations": {
                "en": "Load distribution and proxy policies"
              },
              "link": "programming-basics/31-proxy-policies"
            },
            {
              "label": "التخزين المؤقت وضغط بيانات الويب",
              "translations": {
                "en": "Web caching and compression"
              },
              "link": "programming-basics/10-http-caching-compression"
            },
            {
              "label": "السماح بقراءة البيانات بين المواقع",
              "translations": {
                "en": "Controlling cross-origin data access"
              },
              "link": "programming-basics/11-same-origin-cors"
            },
            {
              "label": "سياسات تحميل الموارد وعزل النوافذ",
              "translations": {
                "en": "Resource loading and window isolation"
              },
              "link": "programming-basics/33-browser-isolation"
            },
            {
              "label": "اسأل دوريًا أو استقبل بثًا من الخادم",
              "translations": {
                "en": "Poll or receive a server stream"
              },
              "link": "programming-basics/12-realtime-webhooks"
            },
            {
              "label": "استقبل إشعار خادم وتعامل مع تكراره",
              "translations": {
                "en": "Receive a webhook and handle repeated delivery"
              },
              "link": "programming-basics/30-webhook-delivery"
            },
            {
              "label": "تصميم واجهات تبادل البيانات",
              "translations": {
                "en": "Designing data interfaces"
              },
              "link": "programming-basics/13-api-design"
            },
            {
              "label": "كيف يختلف HTTP/2 عن HTTP/3؟",
              "translations": {
                "en": "How HTTP/2 and HTTP/3 differ"
              },
              "link": "programming-basics/16-http2-http3-quic"
            },
            {
              "label": "وزّع المحتوى وافهم الخادم الأصلي",
              "translations": {
                "en": "Deliver content and understand the origin server"
              },
              "link": "programming-basics/17-proxies-cdn-waf-observability"
            },
            {
              "label": "حماية الطلبات وتحديد معدلها",
              "translations": {
                "en": "Protecting requests and limiting their rate"
              },
              "link": "programming-basics/24-request-protection"
            },
            {
              "label": "تتبّع الطلب وفسّر القياسات",
              "translations": {
                "en": "Trace requests and interpret measurements"
              },
              "link": "programming-basics/25-request-observation"
            }
          ]
        }
      ]
    },
    {
      "label": "الرياضيات وحل المشكلات",
      "translations": {
        "en": "Math and problem solving"
      },
      "collapsed": true,
      "items": [
        {
          "label": "الرياضيات وحل المشكلات",
          "translations": {
            "en": "Math and problem solving"
          },
          "link": "programming-basics/math-problem-solving"
        },
        {
          "label": "حسب الحاجة — الحساب والمنطق وخطوات الحل",
          "translations": {
            "en": "As needed — arithmetic, logic, and solution steps"
          },
          "collapsed": false,
          "items": [
            {
              "label": "النسب والمتوسط والقوى",
              "translations": {
                "en": "Ratios, averages, and powers"
              },
              "link": "programming-basics/math-problem-solving/01-arithmetic-foundations"
            },
            {
              "label": "القسمة والباقي ودقة الحساب",
              "translations": {
                "en": "Division, remainders, and numerical precision"
              },
              "link": "programming-basics/math-problem-solving/07-division-and-precision"
            },
            {
              "label": "المتغيرات والمعادلات والمنطق البولياني",
              "translations": {
                "en": "Variables, equations, and Boolean logic"
              },
              "link": "programming-basics/math-problem-solving/02-variables-equations-logic"
            },
            {
              "label": "المجموعات والعلاقات ومدخلات الدالة",
              "translations": {
                "en": "Sets, relations, and function inputs"
              },
              "link": "programming-basics/math-problem-solving/08-sets-relations"
            },
            {
              "label": "التفكير الحاسوبي وتحليل المتطلبات",
              "translations": {
                "en": "Computational thinking and requirements analysis"
              },
              "link": "programming-basics/math-problem-solving/04-computational-thinking"
            },
            {
              "label": "الخوارزميات وPseudocode وأشجار القرار",
              "translations": {
                "en": "Algorithms, pseudocode, and decision trees"
              },
              "link": "programming-basics/math-problem-solving/05-algorithms-pseudocode-decision-trees"
            },
            {
              "label": "المخططات الانسيابية والحلقات والتصحيح",
              "translations": {
                "en": "Flowcharts, loops, and debugging"
              },
              "link": "programming-basics/math-problem-solving/06-flowcharts-loops-debugging"
            }
          ]
        },
        {
          "label": "بعد أساس اللغة — تطبيقات وتعمق",
          "translations": {
            "en": "After language fundamentals — applications and depth"
          },
          "collapsed": true,
          "items": [
            {
              "label": "مقارنة الخوارزميات وطرق تنظيم البيانات",
              "translations": {
                "en": "Comparing algorithms and data structures"
              },
              "link": "programming-basics/08-problem-solving-algorithms"
            },
            {
              "label": "ليه الحلقة صحيحة وبتنتهي؟",
              "translations": {
                "en": "Why does a loop work and stop?"
              },
              "link": "programming-basics/math-problem-solving/13-loop-reasoning"
            },
            {
              "label": "حوّل أنماط الحل إلى خطوات",
              "translations": {
                "en": "Turn solution patterns into steps"
              },
              "link": "programming-basics/math-problem-solving/09-solution-patterns"
            },
            {
              "label": "اختَر بين الحل الجشع وحفظ النتائج",
              "translations": {
                "en": "Choose between greedy steps and saved results"
              },
              "link": "programming-basics/math-problem-solving/10-greedy-dynamic-programming"
            },
            {
              "label": "القياس والوحدات والأعداد الأولية",
              "translations": {
                "en": "Measurement, units, and prime numbers"
              },
              "link": "programming-basics/math-problem-solving/03-applied-math-graphs-primes"
            },
            {
              "label": "المتتابعات والعد والاحتمال",
              "translations": {
                "en": "Sequences, counting, and probability"
              },
              "link": "programming-basics/math-problem-solving/11-counting-probability"
            },
            {
              "label": "ارسم العلاقات وابحث عن طريق",
              "translations": {
                "en": "Draw relationships and search for a path"
              },
              "link": "programming-basics/math-problem-solving/12-graphs-and-search"
            }
          ]
        }
      ]
    }
  ]
},

				{
					label: 'لغة C++',
					translations: { en: 'The C++ Language' },
					items: [
						{ label: 'C++', link: 'cpp' },
						{ label: '1. حل المشكلات والمخططات والتصحيح', translations: { en: '1. Problem solving, diagrams & debugging' }, link: 'cpp/foundations/01-problem-solving-review' },
						{ label: '2. أنظمة الأعداد والكمبيوتر والذاكرة', translations: { en: '2. Number systems, computers & memory' }, link: 'cpp/foundations/02-number-systems-computer-internals' },
						{ label: '3. مقدمة C++ والأدوات وأول برنامج', translations: { en: '3. C++ introduction, tools & first program' }, link: 'cpp/foundations/03-setup-syntax-translation-output' },
						{ label: '4. الـCompiler ومراحل البناء والتشخيص', translations: { en: '4. Compiler, build pipeline & diagnostics' }, link: 'cpp/conditions-projects/02-compilation-pipeline-diagnostics' },
						{ label: '5. الأنواع والمتغيرات والنطاق والذاكرة', translations: { en: '5. Types, variables, scope & memory' }, link: 'cpp/foundations/04-types-variables-scope-encoding' },
						{ label: '6. ترميز النصوص والمحارف والتحويلات', translations: { en: '6. Text encoding, characters & casts' }, link: 'cpp/loops-competitive/01-encoding-casts-math' },
						{ label: '7. المعاملات والتعبيرات والعمليات البتية', translations: { en: '7. Operators, expressions & bitwise operations' }, link: 'cpp/foundations/05-operators-conversions-limits' },
						{ label: '8. الإدخال والتحويلات والحدود والرياضيات', translations: { en: '8. Input, conversions, limits & math' }, link: 'cpp/foundations/06-input-source-build-errors-math' },
						{ label: '9. if وelse والتحقق والتداخل', translations: { en: '9. if, else, validation & nesting' }, link: 'cpp/conditions-projects/06-if-else-validation-nesting' },
						{ label: '10. switch وتدفق التحكم والحاسبة', translations: { en: '10. switch, control flow & calculator' }, link: 'cpp/conditions-projects/07-switch-control-flow' },
						{ label: '11. الحلقات وأنماط التكرار', translations: { en: '11. Loops & repetition patterns' }, link: 'cpp/loops-competitive/04-loops-counters-accumulators' },
						{ label: '12. المدخلات وقواعد العمل', translations: { en: '12. Input & business rules' }, link: 'cpp/conditions-projects/01-input-business-rules' },
						{ label: '13. الدوال والحاويات والمراجع', translations: { en: '13. Functions, containers & references' }, link: 'cpp/advanced/01-functions-containers-references' },
						{ label: '14. الكائنات وSTL وRAII', translations: { en: '14. Objects, STL & RAII' }, link: 'cpp/advanced/02-objects-stl-raii-testing' },
					],
				},
				{
					label: 'PHP',
					items: [{ autogenerate: { directory: 'php' } }],
				},
				{
					label: 'تشغيل PHP وأدوات الإنتاج',
					translations: { en: 'PHP Runtime & Production' },
					items: [{ autogenerate: { directory: 'php-runtime' } }],
				},
				{
					label: 'الأمان والمصادقة والصلاحيات',
					translations: { en: 'Security, Authentication & Authorization' },
					items: [{ autogenerate: { directory: 'auth' } }],
				},
				{
					label: 'قواعد البيانات وPDO',
					translations: { en: 'Databases & PDO' },
					items: [{ autogenerate: { directory: 'database' } }],
				},
			],
		}),
	],
});
