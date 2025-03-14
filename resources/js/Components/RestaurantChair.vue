<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    id: { type: String, required: true },
    position: { type: Object, required: true },
    angle: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
    parentId: { type: String, required: true },
});

const chairSize = {
    width: 60,
    height: 60,
    outerWidth: 60,
    outerHeight: 60,
};

// Calculate offset to center the chair
const offset = computed(() => ({
    x: chairSize.width / 2,
    y: chairSize.height / 2,
}));
</script>

<template>
    <v-group
        :x="position.x"
        :y="position.y"
        :rotation="angle"
        :visible="visible"
        :offset="offset"
    >
        <v-rect
            :width="chairSize.width"
            :height="chairSize.height"
            stroke="silver"
            stroke-width="4"
            fill="transparent"
            :corner-radius="[0, 20, 20, 0]"
        />
        <v-rect
            :width="10"
            :height="chairSize.height"
            stroke="silver"
            stroke-width="4"
            fill="transparent"
            :corner-radius="[0, 20, 20, 0]"
        />
    </v-group>
</template>
