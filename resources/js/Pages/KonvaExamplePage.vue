<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import KonvaExample from '../Components/KonvaExample.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="KonvaExample" :show-footer="false">
        <KonvaExample />
    </PageContainer>
</template>
