<script setup lang="ts">
import type { Plot } from '@/types';
import VegPlot from '@/Components/VegPlot.vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import { provide } from 'vue';

defineOptions({
    layout: AppLayout,
});

const props = defineProps<{
    plots: Plot;
}>();

provide('plots', props.plots);
</script>

<template>
    <PageContainer title="Plot" :show-footer="false">
        <VegPlot
            :plots="props.plots"
        />
    </PageContainer>
</template>
