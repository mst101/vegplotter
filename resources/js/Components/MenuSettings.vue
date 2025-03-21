<script setup lang="ts">
import { reactive } from 'vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';

const plotSettings = reactive({
    plotName: 'My first plot',
    plotWidth: '10m',
    plotLength: '8m',
    plotLocation: 'Banjul, Gambia, 13.453,-16.578',
    plotUnits: 'metres',
});
</script>

<template>
    <div>
        <h2 class="bg-green-200 p-2 text-lg tracking-wide text-green-800">
            Plot Settings
        </h2>
        <div class="space-y-3 p-2 text-sm">
            <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wide">Name:</label>
                <input v-model="plotSettings.plotName" name="plotName" class="w-full rounded" type="text">
            </div>
            <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wide">Width:</label>
                <input v-model="plotSettings.plotWidth" name="plotWidth" class="w-full rounded" type="text">
            </div>
            <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wide">Length:</label>
                <input v-model="plotSettings.plotLength" name="plotLength" class="w-full rounded" type="text">
            </div>
            <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wide">Location:</label>
                <input v-model="plotSettings.plotLocation" name="plotLocation" class="w-full rounded" type="text">
            </div>
            <div class="space-y-1">
                <label class="text-xs font-semibold uppercase tracking-wide">Preferred unit of measure:</label>
                <select v-model="plotSettings.plotUnits" name="plotUnits" class="w-full rounded">
                    <option value="metres">
                        Metres
                    </option>
                    <option value="yards">
                        Yards
                    </option>
                </select>
            </div>
            <div>
                <PrimaryButton type="submit">
                    Update
                </PrimaryButton>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
