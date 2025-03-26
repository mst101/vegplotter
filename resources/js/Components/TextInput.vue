<script setup lang="ts">
import type { Nullable } from '@/types';
import { onMounted, ref } from 'vue';

defineProps<{
    modelValue: string;
}>();

defineEmits(['update:modelValue']);

const input = ref<Nullable<HTMLInputElement>>(null);

onMounted(() => {
    if (input.value?.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value?.focus() });
</script>

<template>
    <input
        ref="input"
        class="rounded-md border-gray-300 bg-white text-black shadow-sm focus:border-green-500 focus:ring-green-500"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
    >
</template>
