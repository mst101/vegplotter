<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps<{
    href: string;
    active: boolean;
}>();

const classes = computed(() => {
    return props.active
        ? 'inline-flex items-center px-4 border-green-400 font-medium leading-5 text-gray-900 focus:outline-none focus:border-green-700 transition duration-150 ease-in-out'
        : 'inline-flex items-center px-4 font-medium leading-5 text-gray-500 hover:bg-gray-200 focus:outline-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:rounded focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out';
});
</script>

<template>
    <Link :href="href" :class="classes">
        <slot />
    </Link>
</template>
