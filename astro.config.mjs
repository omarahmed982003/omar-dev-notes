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
				ar: 'ملاحظات عمر البرمجية',
				en: 'Omar Dev Notes',
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
					label: 'أساسيات البرمجة',
					translations: { en: 'Programming Basics' },
					items: [
						{
							label: 'أساسيات الكمبيوتر والبرمجة',
							translations: { en: 'Computer & Programming Fundamentals' },
							items: [{ autogenerate: { directory: 'programming-basics/computer-fundamentals' } }],
						},
						{
							label: 'الرياضيات والمنطق وحل المشكلات',
							translations: { en: 'Math, Logic & Problem Solving' },
							items: [
								{
									label: 'التفكير البرمجي والخوارزميات',
									translations: { en: 'Problem Solving & Algorithms' },
									link: 'programming-basics/08-problem-solving-algorithms',
								},
								{ autogenerate: { directory: 'programming-basics/math-problem-solving' } },
							],
						},
						{
							label: 'أساسيات الشبكات والويب',
							translations: { en: 'Networking & Web Fundamentals' },
							items: [
								{ label: 'الإنترنت والويب ودورة الطلب', translations: { en: 'The Web & Request Flow' }, link: 'programming-basics/01-web-and-request-flow' },
								{ label: 'DNS وعناوين IP', translations: { en: 'DNS & IP Addresses' }, link: 'programming-basics/02-dns-and-ip' },
								{ label: 'TCP وUDP والحزم', translations: { en: 'TCP, UDP & Packets' }, link: 'programming-basics/03-tcp-udp-packets' },
								{ label: 'URL والمنافذ وHTTP', translations: { en: 'URLs, Ports & HTTP' }, link: 'programming-basics/04-url-ports-http' },
								{ label: 'رسائل HTTP والحالة', translations: { en: 'HTTP Messages & State' }, link: 'programming-basics/05-http-messages-state' },
								{ label: 'HTTPS وTLS والشهادات', translations: { en: 'HTTPS, TLS & Certificates' }, link: 'programming-basics/06-https-tls-certificates' },
								{ label: 'داخل الخادم', translations: { en: 'Inside the Server' }, link: 'programming-basics/07-server-side-path' },
								{ label: 'عرض الصفحة وDevTools', translations: { en: 'Browser Rendering & DevTools' }, link: 'programming-basics/09-browser-rendering-devtools' },
								{ label: 'التخزين المؤقت والضغط', translations: { en: 'HTTP Caching & Compression' }, link: 'programming-basics/10-http-caching-compression' },
								{ label: 'Same-Origin وCORS', translations: { en: 'Same-Origin & CORS' }, link: 'programming-basics/11-same-origin-cors' },
								{ label: 'الاتصال اللحظي وWebhooks', translations: { en: 'Realtime & Webhooks' }, link: 'programming-basics/12-realtime-webhooks' },
								{ label: 'تصميم APIs', translations: { en: 'API Design' }, link: 'programming-basics/13-api-design' },
								{ label: 'طبقات الشبكة وEthernet وARP', translations: { en: 'Network Layers, Ethernet & ARP' }, link: 'programming-basics/14-network-layers-lan-ethernet-arp' },
								{ label: 'DHCP وNAT وRouting وIPv6', translations: { en: 'DHCP, NAT, Routing & IPv6' }, link: 'programming-basics/15-addressing-dhcp-nat-routing-ipv6' },
								{ label: 'HTTP/2 وHTTP/3 وQUIC', translations: { en: 'HTTP/2, HTTP/3 & QUIC' }, link: 'programming-basics/16-http2-http3-quic' },
								{ label: 'Proxy وCDN وWAF والمراقبة', translations: { en: 'Proxies, CDN, WAF & Observability' }, link: 'programming-basics/17-proxies-cdn-waf-observability' },
							],
						},
					],
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
						{ label: '9. المدخلات وقواعد العمل', translations: { en: '9. Input & business rules' }, link: 'cpp/conditions-projects/01-input-business-rules' },
						{ label: '10. مشروع الطلب الإلكتروني', translations: { en: '10. Online order project' }, link: 'cpp/conditions-projects/05-online-order-project' },
						{ label: '11. if وelse والتحقق والتداخل', translations: { en: '11. if, else, validation & nesting' }, link: 'cpp/conditions-projects/06-if-else-validation-nesting' },
						{ label: '12. switch وتدفق التحكم والحاسبة', translations: { en: '12. switch, control flow & calculator' }, link: 'cpp/conditions-projects/07-switch-control-flow' },
						{ label: '13. مشروع المركز التدريبي', translations: { en: '13. Training center project' }, link: 'cpp/conditions-projects/08-training-center-project' },
						{ label: '14. البرمجة التنافسية ومنصات التدريب', translations: { en: '14. Competitive programming platforms' }, link: 'cpp/loops-competitive/02-competitive-programming' },
						{ label: '15. مسائل الشروط والصيغ', translations: { en: '15. Conditions & formula problems' }, link: 'cpp/loops-competitive/03-conditions-codeforces' },
						{ label: '16. الحلقات وأنماط التكرار', translations: { en: '16. Loops & repetition patterns' }, link: 'cpp/loops-competitive/04-loops-counters-accumulators' },
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
					label: 'البرمجة كائنية التوجه',
					translations: { en: 'Object-Oriented Programming' },
					items: [{ autogenerate: { directory: 'oop' } }],
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
