// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
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
					items: [{ autogenerate: { directory: 'programming-basics' } }],
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
