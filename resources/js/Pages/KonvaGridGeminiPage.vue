<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import KonvaGridGemini from '../Components/KonvaGridGemini.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="KonvaGridGemini" :show-footer="false">
        <KonvaGridGemini />
    </PageContainer>
</template>
