<script setup lang="ts">
import { provide } from 'vue';
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import VegPlot from '@/Components/VegPlot.vue';
import type { Plot, PlotConfig } from '@/types';

defineOptions({
    layout: AppLayout,
});

const props = defineProps<{
    plots: Plot;
    config?: PlotConfig;
}>();

provide('plots', props.plots);
</script>

<template>
    <PageContainer title="Plot" :show-footer="false">
        <VegPlot
            :plots="props.plots"
            :config="{
                SCROLLBAR_SIZE: 12,
                UNIT_PIXELS: 100,
                SIDEPANEL_WIDTH: 224,
                VERTICAL_OFFSET: 118,
                PADDING_PIXELS: 50,
            }"
        />
    </PageContainer>
</template>
