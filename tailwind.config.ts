import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './vendor/laravel/jetstream/**/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            colors: {
                'true-white': '#fff',
                'true-black': '#000',
                'nav': {
                    50: 'hsl(var(--color-nav-50) / <alpha-value>)',
                    100: 'hsl(var(--color-nav-100) / <alpha-value>)',
                    200: 'hsl(var(--color-nav-200) / <alpha-value>)',
                    300: 'hsl(var(--color-nav-300) / <alpha-value>)',
                    400: 'hsl(var(--color-nav-400) / <alpha-value>)',
                    500: 'hsl(var(--color-nav-500) / <alpha-value>)',
                    600: 'hsl(var(--color-nav-600) / <alpha-value>)',
                    700: 'hsl(var(--color-nav-700) / <alpha-value>)',
                    800: 'hsl(var(--color-nav-800) / <alpha-value>)',
                    900: 'hsl(var(--color-nav-900) / <alpha-value>)',
                    950: 'hsl(var(--color-nav-950) / <alpha-value>)',
                },
                'white': 'hsl(var(--color-white) / <alpha-value>)',
                'black': 'hsl(var(--color-black) / <alpha-value>)',
                'slate': {
                    50: 'hsl(var(--color-slate-50) / <alpha-value>)',
                    100: 'hsl(var(--color-slate-100) / <alpha-value>)',
                    200: 'hsl(var(--color-slate-200) / <alpha-value>)',
                    300: 'hsl(var(--color-slate-300) / <alpha-value>)',
                    400: 'hsl(var(--color-slate-400) / <alpha-value>)',
                    500: 'hsl(var(--color-slate-500) / <alpha-value>)',
                    600: 'hsl(var(--color-slate-600) / <alpha-value>)',
                    700: 'hsl(var(--color-slate-700) / <alpha-value>)',
                    800: 'hsl(var(--color-slate-800) / <alpha-value>)',
                    900: 'hsl(var(--color-slate-900) / <alpha-value>)',
                    950: 'hsl(var(--color-slate-950) / <alpha-value>)',
                },
                'gray': {
                    50: 'hsl(var(--color-gray-50) / <alpha-value>)',
                    100: 'hsl(var(--color-gray-100) / <alpha-value>)',
                    200: 'hsl(var(--color-gray-200) / <alpha-value>)',
                    300: 'hsl(var(--color-gray-300) / <alpha-value>)',
                    400: 'hsl(var(--color-gray-400) / <alpha-value>)',
                    500: 'hsl(var(--color-gray-500) / <alpha-value>)',
                    600: 'hsl(var(--color-gray-600) / <alpha-value>)',
                    700: 'hsl(var(--color-gray-700) / <alpha-value>)',
                    800: 'hsl(var(--color-gray-800) / <alpha-value>)',
                    900: 'hsl(var(--color-gray-900) / <alpha-value>)',
                    950: 'hsl(var(--color-gray-950) / <alpha-value>)',
                },
                'zinc': {
                    50: 'hsl(var(--color-zinc-50) / <alpha-value>)',
                    100: 'hsl(var(--color-zinc-100) / <alpha-value>)',
                    200: 'hsl(var(--color-zinc-200) / <alpha-value>)',
                    300: 'hsl(var(--color-zinc-300) / <alpha-value>)',
                    400: 'hsl(var(--color-zinc-400) / <alpha-value>)',
                    500: 'hsl(var(--color-zinc-500) / <alpha-value>)',
                    600: 'hsl(var(--color-zinc-600) / <alpha-value>)',
                    700: 'hsl(var(--color-zinc-700) / <alpha-value>)',
                    800: 'hsl(var(--color-zinc-800) / <alpha-value>)',
                    900: 'hsl(var(--color-zinc-900) / <alpha-value>)',
                    950: 'hsl(var(--color-zinc-950) / <alpha-value>)',
                },
                'neutral': {
                    50: 'hsl(var(--color-neutral-50) / <alpha-value>)',
                    100: 'hsl(var(--color-neutral-100) / <alpha-value>)',
                    200: 'hsl(var(--color-neutral-200) / <alpha-value>)',
                    300: 'hsl(var(--color-neutral-300) / <alpha-value>)',
                    400: 'hsl(var(--color-neutral-400) / <alpha-value>)',
                    500: 'hsl(var(--color-neutral-500) / <alpha-value>)',
                    600: 'hsl(var(--color-neutral-600) / <alpha-value>)',
                    700: 'hsl(var(--color-neutral-700) / <alpha-value>)',
                    800: 'hsl(var(--color-neutral-800) / <alpha-value>)',
                    900: 'hsl(var(--color-neutral-900) / <alpha-value>)',
                    950: 'hsl(var(--color-neutral-950) / <alpha-value>)',
                },
                'stone': {
                    50: 'hsl(var(--color-stone-50) / <alpha-value>)',
                    100: 'hsl(var(--color-stone-100) / <alpha-value>)',
                    200: 'hsl(var(--color-stone-200) / <alpha-value>)',
                    300: 'hsl(var(--color-stone-300) / <alpha-value>)',
                    400: 'hsl(var(--color-stone-400) / <alpha-value>)',
                    500: 'hsl(var(--color-stone-500) / <alpha-value>)',
                    600: 'hsl(var(--color-stone-600) / <alpha-value>)',
                    700: 'hsl(var(--color-stone-700) / <alpha-value>)',
                    800: 'hsl(var(--color-stone-800) / <alpha-value>)',
                    900: 'hsl(var(--color-stone-900) / <alpha-value>)',
                    950: 'hsl(var(--color-stone-950) / <alpha-value>)',
                },
                'red': {
                    50: 'hsl(var(--color-red-50) / <alpha-value>)',
                    100: 'hsl(var(--color-red-100) / <alpha-value>)',
                    200: 'hsl(var(--color-red-200) / <alpha-value>)',
                    300: 'hsl(var(--color-red-300) / <alpha-value>)',
                    400: 'hsl(var(--color-red-400) / <alpha-value>)',
                    500: 'hsl(var(--color-red-500) / <alpha-value>)',
                    600: 'hsl(var(--color-red-600) / <alpha-value>)',
                    700: 'hsl(var(--color-red-700) / <alpha-value>)',
                    800: 'hsl(var(--color-red-800) / <alpha-value>)',
                    900: 'hsl(var(--color-red-900) / <alpha-value>)',
                    950: 'hsl(var(--color-red-950) / <alpha-value>)',
                },
                'orange': {
                    50: 'hsl(var(--color-gray-50) / <alpha-value>)',
                    100: 'hsl(var(--color-gray-100) / <alpha-value>)',
                    200: 'hsl(var(--color-gray-200) / <alpha-value>)',
                    300: 'hsl(var(--color-gray-300) / <alpha-value>)',
                    400: 'hsl(var(--color-gray-400) / <alpha-value>)',
                    500: 'hsl(var(--color-gray-500) / <alpha-value>)',
                    600: 'hsl(var(--color-gray-600) / <alpha-value>)',
                    700: 'hsl(var(--color-gray-700) / <alpha-value>)',
                    800: 'hsl(var(--color-gray-800) / <alpha-value>)',
                    900: 'hsl(var(--color-gray-900) / <alpha-value>)',
                    950: 'hsl(var(--color-gray-950) / <alpha-value>)',
                },
                'amber': {
                    50: 'hsl(var(--color-amber-50) / <alpha-value>)',
                    100: 'hsl(var(--color-amber-100) / <alpha-value>)',
                    200: 'hsl(var(--color-amber-200) / <alpha-value>)',
                    300: 'hsl(var(--color-amber-300) / <alpha-value>)',
                    400: 'hsl(var(--color-amber-400) / <alpha-value>)',
                    500: 'hsl(var(--color-amber-500) / <alpha-value>)',
                    600: 'hsl(var(--color-amber-600) / <alpha-value>)',
                    700: 'hsl(var(--color-amber-700) / <alpha-value>)',
                    800: 'hsl(var(--color-amber-800) / <alpha-value>)',
                    900: 'hsl(var(--color-amber-900) / <alpha-value>)',
                    950: 'hsl(var(--color-amber-950) / <alpha-value>)',
                },
                'yellow': {
                    50: 'hsl(var(--color-yellow-50) / <alpha-value>)',
                    100: 'hsl(var(--color-yellow-100) / <alpha-value>)',
                    200: 'hsl(var(--color-yellow-200) / <alpha-value>)',
                    300: 'hsl(var(--color-yellow-300) / <alpha-value>)',
                    400: 'hsl(var(--color-yellow-400) / <alpha-value>)',
                    500: 'hsl(var(--color-yellow-500) / <alpha-value>)',
                    600: 'hsl(var(--color-yellow-600) / <alpha-value>)',
                    700: 'hsl(var(--color-yellow-700) / <alpha-value>)',
                    800: 'hsl(var(--color-yellow-800) / <alpha-value>)',
                    900: 'hsl(var(--color-yellow-900) / <alpha-value>)',
                    950: 'hsl(var(--color-yellow-950) / <alpha-value>)',
                },
                'lime': {
                    50: 'hsl(var(--color-lime-50) / <alpha-value>)',
                    100: 'hsl(var(--color-lime-100) / <alpha-value>)',
                    200: 'hsl(var(--color-lime-200) / <alpha-value>)',
                    300: 'hsl(var(--color-lime-300) / <alpha-value>)',
                    400: 'hsl(var(--color-lime-400) / <alpha-value>)',
                    500: 'hsl(var(--color-lime-500) / <alpha-value>)',
                    600: 'hsl(var(--color-lime-600) / <alpha-value>)',
                    700: 'hsl(var(--color-lime-700) / <alpha-value>)',
                    800: 'hsl(var(--color-lime-800) / <alpha-value>)',
                    900: 'hsl(var(--color-lime-900) / <alpha-value>)',
                    950: 'hsl(var(--color-lime-950) / <alpha-value>)',
                },
                'green': {
                    50: 'hsl(var(--color-green-50) / <alpha-value>)',
                    100: 'hsl(var(--color-green-100) / <alpha-value>)',
                    200: 'hsl(var(--color-green-200) / <alpha-value>)',
                    300: 'hsl(var(--color-green-300) / <alpha-value>)',
                    400: 'hsl(var(--color-green-400) / <alpha-value>)',
                    500: 'hsl(var(--color-green-500) / <alpha-value>)',
                    600: 'hsl(var(--color-green-600) / <alpha-value>)',
                    700: 'hsl(var(--color-green-700) / <alpha-value>)',
                    800: 'hsl(var(--color-green-800) / <alpha-value>)',
                    900: 'hsl(var(--color-green-900) / <alpha-value>)',
                    950: 'hsl(var(--color-green-950) / <alpha-value>)',
                },
                'emerald': {
                    50: 'hsl(var(--color-emerald-50) / <alpha-value>)',
                    100: 'hsl(var(--color-emerald-100) / <alpha-value>)',
                    200: 'hsl(var(--color-emerald-200) / <alpha-value>)',
                    300: 'hsl(var(--color-emerald-300) / <alpha-value>)',
                    400: 'hsl(var(--color-emerald-400) / <alpha-value>)',
                    500: 'hsl(var(--color-emerald-500) / <alpha-value>)',
                    600: 'hsl(var(--color-emerald-600) / <alpha-value>)',
                    700: 'hsl(var(--color-emerald-700) / <alpha-value>)',
                    800: 'hsl(var(--color-emerald-800) / <alpha-value>)',
                    900: 'hsl(var(--color-emerald-900) / <alpha-value>)',
                    950: 'hsl(var(--color-emerald-950) / <alpha-value>)',
                },
                'teal': {
                    50: 'hsl(var(--color-teal-50) / <alpha-value>)',
                    100: 'hsl(var(--color-teal-100) / <alpha-value>)',
                    200: 'hsl(var(--color-teal-200) / <alpha-value>)',
                    300: 'hsl(var(--color-teal-300) / <alpha-value>)',
                    400: 'hsl(var(--color-teal-400) / <alpha-value>)',
                    500: 'hsl(var(--color-teal-500) / <alpha-value>)',
                    600: 'hsl(var(--color-teal-600) / <alpha-value>)',
                    700: 'hsl(var(--color-teal-700) / <alpha-value>)',
                    800: 'hsl(var(--color-teal-800) / <alpha-value>)',
                    900: 'hsl(var(--color-teal-900) / <alpha-value>)',
                    950: 'hsl(var(--color-teal-950) / <alpha-value>)',
                },
                'cyan': {
                    50: 'hsl(var(--color-cyan-50) / <alpha-value>)',
                    100: 'hsl(var(--color-cyan-100) / <alpha-value>)',
                    200: 'hsl(var(--color-cyan-200) / <alpha-value>)',
                    300: 'hsl(var(--color-cyan-300) / <alpha-value>)',
                    400: 'hsl(var(--color-cyan-400) / <alpha-value>)',
                    500: 'hsl(var(--color-cyan-500) / <alpha-value>)',
                    600: 'hsl(var(--color-cyan-600) / <alpha-value>)',
                    700: 'hsl(var(--color-cyan-700) / <alpha-value>)',
                    800: 'hsl(var(--color-cyan-800) / <alpha-value>)',
                    900: 'hsl(var(--color-cyan-900) / <alpha-value>)',
                    950: 'hsl(var(--color-cyan-950) / <alpha-value>)',
                },
                'sky': {
                    50: 'hsl(var(--color-sky-50) / <alpha-value>)',
                    100: 'hsl(var(--color-sky-100) / <alpha-value>)',
                    200: 'hsl(var(--color-sky-200) / <alpha-value>)',
                    300: 'hsl(var(--color-sky-300) / <alpha-value>)',
                    400: 'hsl(var(--color-sky-400) / <alpha-value>)',
                    500: 'hsl(var(--color-sky-500) / <alpha-value>)',
                    600: 'hsl(var(--color-sky-600) / <alpha-value>)',
                    700: 'hsl(var(--color-sky-700) / <alpha-value>)',
                    800: 'hsl(var(--color-sky-800) / <alpha-value>)',
                    900: 'hsl(var(--color-sky-900) / <alpha-value>)',
                    950: 'hsl(var(--color-sky-950) / <alpha-value>)',
                },
                'blue': {
                    50: 'hsl(var(--color-blue-50) / <alpha-value>)',
                    100: 'hsl(var(--color-blue-100) / <alpha-value>)',
                    200: 'hsl(var(--color-blue-200) / <alpha-value>)',
                    300: 'hsl(var(--color-blue-300) / <alpha-value>)',
                    400: 'hsl(var(--color-blue-400) / <alpha-value>)',
                    500: 'hsl(var(--color-blue-500) / <alpha-value>)',
                    600: 'hsl(var(--color-blue-600) / <alpha-value>)',
                    700: 'hsl(var(--color-blue-700) / <alpha-value>)',
                    800: 'hsl(var(--color-blue-800) / <alpha-value>)',
                    900: 'hsl(var(--color-blue-900) / <alpha-value>)',
                    950: 'hsl(var(--color-blue-950) / <alpha-value>)',
                },
                'indigo': {
                    50: 'hsl(var(--color-indigo-50) / <alpha-value>)',
                    100: 'hsl(var(--color-indigo-100) / <alpha-value>)',
                    200: 'hsl(var(--color-indigo-200) / <alpha-value>)',
                    300: 'hsl(var(--color-indigo-300) / <alpha-value>)',
                    400: 'hsl(var(--color-indigo-400) / <alpha-value>)',
                    500: 'hsl(var(--color-indigo-500) / <alpha-value>)',
                    600: 'hsl(var(--color-indigo-600) / <alpha-value>)',
                    700: 'hsl(var(--color-indigo-700) / <alpha-value>)',
                    800: 'hsl(var(--color-indigo-800) / <alpha-value>)',
                    900: 'hsl(var(--color-indigo-900) / <alpha-value>)',
                    950: 'hsl(var(--color-indigo-950) / <alpha-value>)',
                },
                'violet': {
                    50: 'hsl(var(--color-violet-50) / <alpha-value>)',
                    100: 'hsl(var(--color-violet-100) / <alpha-value>)',
                    200: 'hsl(var(--color-violet-200) / <alpha-value>)',
                    300: 'hsl(var(--color-violet-300) / <alpha-value>)',
                    400: 'hsl(var(--color-violet-400) / <alpha-value>)',
                    500: 'hsl(var(--color-violet-500) / <alpha-value>)',
                    600: 'hsl(var(--color-violet-600) / <alpha-value>)',
                    700: 'hsl(var(--color-violet-700) / <alpha-value>)',
                    800: 'hsl(var(--color-violet-800) / <alpha-value>)',
                    900: 'hsl(var(--color-violet-900) / <alpha-value>)',
                    950: 'hsl(var(--color-violet-950) / <alpha-value>)',
                },
                'purple': {
                    50: 'hsl(var(--color-purple-50) / <alpha-value>)',
                    100: 'hsl(var(--color-purple-100) / <alpha-value>)',
                    200: 'hsl(var(--color-purple-200) / <alpha-value>)',
                    300: 'hsl(var(--color-purple-300) / <alpha-value>)',
                    400: 'hsl(var(--color-purple-400) / <alpha-value>)',
                    500: 'hsl(var(--color-purple-500) / <alpha-value>)',
                    600: 'hsl(var(--color-purple-600) / <alpha-value>)',
                    700: 'hsl(var(--color-purple-700) / <alpha-value>)',
                    800: 'hsl(var(--color-purple-800) / <alpha-value>)',
                    900: 'hsl(var(--color-purple-900) / <alpha-value>)',
                    950: 'hsl(var(--color-purple-950) / <alpha-value>)',
                },
                'fuchsia': {
                    50: 'hsl(var(--color-fuchsia-50) / <alpha-value>)',
                    100: 'hsl(var(--color-fuchsia-100) / <alpha-value>)',
                    200: 'hsl(var(--color-fuchsia-200) / <alpha-value>)',
                    300: 'hsl(var(--color-fuchsia-300) / <alpha-value>)',
                    400: 'hsl(var(--color-fuchsia-400) / <alpha-value>)',
                    500: 'hsl(var(--color-fuchsia-500) / <alpha-value>)',
                    600: 'hsl(var(--color-fuchsia-600) / <alpha-value>)',
                    700: 'hsl(var(--color-fuchsia-700) / <alpha-value>)',
                    800: 'hsl(var(--color-fuchsia-800) / <alpha-value>)',
                    900: 'hsl(var(--color-fuchsia-900) / <alpha-value>)',
                    950: 'hsl(var(--color-fuchsia-950) / <alpha-value>)',
                },
                'pink': {
                    50: 'hsl(var(--color-pink-50) / <alpha-value>)',
                    100: 'hsl(var(--color-pink-100) / <alpha-value>)',
                    200: 'hsl(var(--color-pink-200) / <alpha-value>)',
                    300: 'hsl(var(--color-pink-300) / <alpha-value>)',
                    400: 'hsl(var(--color-pink-400) / <alpha-value>)',
                    500: 'hsl(var(--color-pink-500) / <alpha-value>)',
                    600: 'hsl(var(--color-pink-600) / <alpha-value>)',
                    700: 'hsl(var(--color-pink-700) / <alpha-value>)',
                    800: 'hsl(var(--color-pink-800) / <alpha-value>)',
                    900: 'hsl(var(--color-pink-900) / <alpha-value>)',
                    950: 'hsl(var(--color-pink-950) / <alpha-value>)',
                },
                'rose': {
                    50: 'hsl(var(--color-rose-50) / <alpha-value>)',
                    100: 'hsl(var(--color-rose-100) / <alpha-value>)',
                    200: 'hsl(var(--color-rose-200) / <alpha-value>)',
                    300: 'hsl(var(--color-rose-300) / <alpha-value>)',
                    400: 'hsl(var(--color-rose-400) / <alpha-value>)',
                    500: 'hsl(var(--color-rose-500) / <alpha-value>)',
                    600: 'hsl(var(--color-rose-600) / <alpha-value>)',
                    700: 'hsl(var(--color-rose-700) / <alpha-value>)',
                    800: 'hsl(var(--color-rose-800) / <alpha-value>)',
                    900: 'hsl(var(--color-rose-900) / <alpha-value>)',
                    950: 'hsl(var(--color-rose-950) / <alpha-value>)',
                },
            },
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms, typography],
} satisfies Config;
