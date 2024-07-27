<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import MyRestaurant from '@/Components/MyRestaurant.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="Dashboard" :show-footer="false">
        <!--        <VegPlot /> -->
        <MyRestaurant />
    </PageContainer>
</template>
