<script setup lang="ts">
import type Konva from 'konva';
import { ref } from 'vue';
import type { ChairPosition } from '@/types';
import { chairSize } from '@/Models/Chair';

const props = defineProps<{
    chairPos: ChairPosition;
    tableRect: any;
}>();

const chairGroup = ref<Konva.Group>();
const chairSeatConfig = ref<Konva.RectConfig>();
const chairBackConfig = ref<Konva.RectConfig>();

// The chairs are positioned using co-ords calculated as a fraction of the table size,
// so we inflate table size slightly to make that work.
const outerWidth = props.tableRect.width + 2 * chairSize.outerWidth;
const outerHeight = props.tableRect.height + 2 * chairSize.outerHeight;

// the outerRect is a slightly inflated table size for chair positioning.
const outerRect = {
    x: -outerWidth / 2,
    y: -outerHeight / 2,
    width: outerWidth,
    height: outerHeight,
};

const isCircle = props.tableRect.shape === 'circle';

const chairGroupConfig = ref<Konva.GroupConfig>({
    x: isCircle ? 0 : props.tableRect.width,
    y: isCircle ? 0 : props.tableRect.height,
    offset: {
        x: isCircle ? 0 : props.tableRect.width,
        y: isCircle ? 0 : props.tableRect.height,
    },
});

chairSeatConfig.value = {
    x: outerRect.x + (outerRect.width * props.chairPos.x),
    y: outerRect.y + (outerRect.height * props.chairPos.y),
    offset: {
        x: chairSize.width / 2,
        y: chairSize.height / 2,
    },
    width: chairSize.width,
    height: chairSize.height,
    rotation: props.chairPos.angle,
    stroke: 'silver',
    strokeWidth: 4,
    fill: 'transparent',
    cornerRadius: [0, 20, 20, 0],
};

chairBackConfig.value = {
    x: outerRect.x + (outerRect.width * props.chairPos.x),
    y: outerRect.y + (outerRect.height * props.chairPos.y),
    offset: {
        x: chairSize.width / 2,
        y: chairSize.height / 2,
    },
    width: 10,
    height: chairSize.height,
    rotation: props.chairPos.angle,
    stroke: 'silver',
    strokeWidth: 4,
    fill: 'transparent',
    cornerRadius: [0, 20, 20, 0],
};
</script>

<template>
    <v-group ref="chairGroup" name="chairGroup" :config="chairGroupConfig">
        <v-rect name="chairSeat" :config="chairSeatConfig" />
        <v-rect name="chairBack" :config="chairBackConfig" />
    </v-group>
</template>
