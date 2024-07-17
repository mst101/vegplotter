<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps<{
    href: string;
}>();
</script>

<template>
    <Link
        class="rounded-md px-2 py-1 text-sm text-purple-800 outline-none hover:text-purple-900 hover:underline focus:ring-2 focus:ring-green-500"
        :href="href"
    >
        <slot />
    </Link>
</template>
