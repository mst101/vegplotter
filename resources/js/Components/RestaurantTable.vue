<script setup lang="ts">
import { computed } from 'vue';
import RestaurantChair from './RestaurantChair.vue';

const props = defineProps({
    id: { type: String, required: true },
    position: { type: Object, required: true },
    rotation: { type: Number, default: 0 },
    diet: { type: String, default: 'Omnivore' },
    focus: { type: Boolean, default: false },
    tableType: { type: String, required: true },
    chairs: { type: Array, required: true },
});

const emit = defineEmits(['update:position', 'update:rotation', 'focus', 'dragend', 'transformend']);

// Table configuration data
const tableData = {
    'square-4': {
        shape: 'rect',
        width: 200,
        height: 200,
        chairPositions: [
            { x: 0, y: 0.5, angle: 0 },
            { x: 0.5, y: 0, angle: 90 },
            { x: 1, y: 0.5, angle: 180 },
            { x: 0.5, y: 1, angle: 270 },
        ],
    },
    'square-6': {
        shape: 'rect',
        width: 200,
        height: 100,
        chairPositions: [
            { x: 0, y: 0.5, angle: 0 },
            { x: 0.33, y: 0, angle: 90 },
            { x: 0.66, y: 0, angle: 90 },
            { x: 1, y: 0.5, angle: 180 },
            { x: 0.33, y: 1, angle: 270 },
            { x: 0.66, y: 1, angle: 270 },
        ],
    },
    'circle-4': {
        shape: 'circle',
        radius: 120,
        chairPositions: [
            { x: 0, y: 0.5, angle: 0 },
            { x: 0.5, y: 0, angle: 90 },
            { x: 1, y: 0.5, angle: 180 },
            { x: 0.5, y: 1, angle: 270 },
        ],
    },
};

// Computed properties
const tableConfig = computed(() => tableData[props.tableType]);
const tableShape = computed(() => tableConfig.value.shape);
const tableFill = computed(() => {
    switch (props.diet) {
        case 'Vegetarian': return 'lime';
        case 'Pescatarian': return 'red';
        default: return 'transparent';
    }
});

// Calculate outer rect for chair positioning
const outerRect = computed(() => {
    const chairSize = { outerWidth: 60, outerHeight: 60 };
    if (tableShape.value === 'rect') {
        const width = tableConfig.value.width + 2 * chairSize.outerWidth / 2;
        const height = tableConfig.value.height + 2 * chairSize.outerHeight / 2;
        return {
            x: -width / 2,
            y: -height / 2,
            width,
            height,
        };
    }
    else {
        const diameter = tableConfig.value.radius * 2 + 2 * chairSize.outerWidth / 2;
        return {
            x: -diameter / 2,
            y: -diameter / 2,
            width: diameter,
            height: diameter,
        };
    }
});

// Event handlers
function handleClick() {
    emit('focus', props.id);
}

function handleDragEnd(e) {
    emit('update:position', { x: e.target.x(), y: e.target.y() });
    emit('dragend', props.id);
}

function handleTransformEnd(e) {
    emit('update:rotation', e.target.rotation());
    emit('transformend', props.id);
}
</script>

<template>
    <v-group
        :x="position.x"
        :y="position.y"
        :rotation="rotation"
        draggable
        :name="`table-${id}`"
        :data-table-id="id"
        @click="handleClick"
        @dragend="handleDragEnd"
        @transformend="handleTransformEnd"
    >
        <!-- Table shape -->
        <v-rect
            v-if="tableShape === 'rect'"
            :x="-(tableConfig.width / 2)"
            :y="-(tableConfig.height / 2)"
            :width="tableConfig.width"
            :height="tableConfig.height"
            stroke="silver"
            stroke-width="4"
            :fill="tableFill"
        />
        <v-circle
            v-else-if="tableShape === 'circle'"
            :radius="tableConfig.radius"
            stroke="silver"
            stroke-width="4"
            :fill="tableFill"
        />

        <!-- Event rectangle -->
        <v-rect
            :width="tableShape === 'rect' ? tableConfig.width : tableConfig.radius * 2"
            :height="tableShape === 'rect' ? tableConfig.height : tableConfig.radius * 2"
            :x="tableShape === 'rect' ? -(tableConfig.width / 2) : -tableConfig.radius"
            :y="tableShape === 'rect' ? -(tableConfig.height / 2) : -tableConfig.radius"
            fill="blue"
            :opacity="focus ? 0.1 : 0"
        />

        <!-- Chairs -->
        <RestaurantChair
            v-for="chair in chairs"
            :id="chair.id"
            :key="chair.id"
            :position="chair.position"
            :angle="chair.angle"
            :visible="chair.visible"
            :parent-id="id"
        />
    </v-group>
</template>
