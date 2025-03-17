<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import RestaurantOrig from '../Components/RestaurantOrig.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="Restaurant" :show-footer="false">
        <RestaurantOrig />
    </PageContainer>
</template>
