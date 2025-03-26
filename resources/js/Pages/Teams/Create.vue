<script setup lang="ts">
import AppLayout from '@/Layouts/AppLayout.vue';
import PageContainer from '@/Pages/PageContainer.vue';
import CreateTeamForm from '@/Pages/Teams/Partials/CreateTeamForm.vue';

defineOptions({
    layout: AppLayout,
});
</script>

<template>
    <PageContainer title="Create Team">
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                Create Team
            </h2>
        </template>

        <div>
            <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                <CreateTeamForm />
            </div>
        </div>
    </PageContainer>
</template>
