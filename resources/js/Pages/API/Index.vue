<script setup lang="ts">
import type { ApiToken } from '@/types';
import AppLayout from '@/Layouts/AppLayout.vue';
import ApiTokenManager from '@/Pages/API/Partials/ApiTokenManager.vue';
import PageContainer from '@/Pages/PageContainer.vue';

defineOptions({
    layout: AppLayout,
});

defineProps<{
    tokens: ApiToken[];
    availablePermissions: string[];
    defaultPermissions: string[];
}>();
</script>

<template>
    <PageContainer title="API Tokens">
        <template #header>
            <h2 class="text-xl font-semibold leading-tight text-gray-800">
                API Tokens
            </h2>
        </template>

        <div>
            <div class="mx-auto max-w-7xl py-10 sm:px-6 lg:px-8">
                <ApiTokenManager
                    :tokens="tokens"
                    :available-permissions="availablePermissions"
                    :default-permissions="defaultPermissions"
                />
            </div>
        </div>
    </PageContainer>
</template>
