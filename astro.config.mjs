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
							],
						},
					],
				},
				{
					label: 'لغة C++',
					translations: { en: 'The C++ Language' },
					items: [{ autogenerate: { directory: 'cpp' } }],
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
