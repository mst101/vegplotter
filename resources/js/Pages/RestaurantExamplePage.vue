<script setup lang="ts">
import AppLayout from '../Layouts/AppLayout.vue';
import PageContainer from '../Pages/PageContainer.vue';
import RestaurantExample from '../Components/RestaurantExample.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="RestaurantExample" :show-footer="false">
        <RestaurantExample />
    </PageContainer>
</template>
