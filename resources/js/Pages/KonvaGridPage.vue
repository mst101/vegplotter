<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import KonvaGrid from '../Components/KonvaGrid.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="KonvaGrid" :show-footer="false">
        <KonvaGrid />
    </PageContainer>
</template>
