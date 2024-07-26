<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import Restaurant from '../Components/Restaurant.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="Restaurant" :show-footer="false">
        <Restaurant />
    </PageContainer>
</template>
