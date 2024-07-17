<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
    href?: string;
    as?: 'button' | 'a';
}>();
</script>

<template>
    <div>
        <button v-if="as === 'button'" type="submit" class="block w-full px-4 py-2 text-start text-base leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
            <slot />
        </button>

        <a v-else-if="as === 'a'" :href="href" class="block px-4 py-2 text-base leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
            <slot />
        </a>

        <Link v-else-if="!!href" :href="href" class="block px-4 py-2 text-base leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
            <slot />
        </Link>
    </div>
</template>
