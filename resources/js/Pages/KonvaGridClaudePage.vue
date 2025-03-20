<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import KonvaGridClaude from '../Components/KonvaGridClaude.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="KonvaGridClaude" :show-footer="false">
        <KonvaGridClaude />
    </PageContainer>
</template>
