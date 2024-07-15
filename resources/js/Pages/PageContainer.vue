<script setup lang="ts">
import { Head } from '@inertiajs/vue3';

defineProps<{
    title: string;
}>();
</script>

<template>
    <Head :title="title" />

    <!-- Page Heading -->
    <header v-if="$slots.header" class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <slot name="header" />
        </div>
    </header>

    <slot />
</template>
