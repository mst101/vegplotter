<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import VegPlot from '@/Components/VegPlot.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="Dashboard" :show-footer="false">
        <VegPlot />
    </PageContainer>
</template>
