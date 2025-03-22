<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { inject } from 'vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import type { Plot } from '@/types';

const initialPlots = inject<Plot>('plots');
const form = useForm({
    ...initialPlots,
    location_combined: `${initialPlots!.location_name} (${initialPlots!.location_lat}, ${initialPlots!.location_lng})`,
});

function updateLocation() {
    const match = form.location_combined!.match(/^([A-Z\s\-(),.']+)\s\((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/i);

    if (match) {
        const [_, place, latitude, longitude] = match;
        form.location_name = place;
        form.location_lat = Number(latitude);
        form.location_lng = Number(longitude);
    }
}

function updatePlot() {
    updateLocation();
    form.put(`plots/${initialPlots!.id}`);
}
</script>

<template>
    <div>
        <h2 class="bg-green-200 p-2 text-lg tracking-wide text-green-800">
            Plot Settings
        </h2>
        <form @submit.prevent="updatePlot">
            <div class="space-y-3 p-2 text-sm text-black">
                <div class="space-y-1">
                    <label class="text-xs font-semibold uppercase tracking-wide">Name:</label>
                    <input v-model="form.name" class="w-full rounded border border-gray-300 bg-white" type="text">
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-semibold uppercase tracking-wide">Width:</label>
                    <input v-model="form.width" class="w-full rounded border border-gray-300 bg-white" type="number">
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-semibold uppercase tracking-wide">Length:</label>
                    <input v-model="form.length" class="w-full rounded border border-gray-300 bg-white" type="number">
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-semibold uppercase tracking-wide">Location:</label>
                    <input v-model="form.location_lat" class="w-full rounded border border-gray-300 bg-white" type="hidden">
                    <input v-model="form.location_lng" class="w-full rounded border border-gray-300 bg-white" type="hidden">
                    <input v-model="form.location_name" class="w-full rounded border border-gray-300 bg-white" type="hidden">
                    <input v-model="form.location_combined" class="w-full rounded border border-gray-300 bg-white" type="text">
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-semibold uppercase tracking-wide">Preferred unit of measure:</label>
                    <select v-model="form.units" class="w-full rounded border border-gray-300 bg-white">
                        <option value="metres">
                            Metres
                        </option>
                        <option value="yards">
                            Yards
                        </option>
                    </select>
                </div>
                <div class="w-full pt-6">
                    <PrimaryButton type="submit">
                        Update
                    </PrimaryButton>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>

</style>
