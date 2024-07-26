<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from 'vue';
import type Konva from 'konva';

const props = defineProps(['id', 'tableData', 'position', 'tableShape', 'focus']);
const emit = defineEmits(['tableClick', 'tableTransformEnd']);

const tableGroup = ref<Konva.Group | null>(null);
const eventRect = ref<Konva.Rect | null>(null);

onMounted(() => {
    if (tableGroup.value && eventRect.value) {
        tableGroup.value.setAttr('tableId', props.id);
        eventRect.value.moveToBottom();
    }
});

function handleTableClick() {
    emit('tableClick', props.id);
}

function handleTableTransformEnd() {
    emit('tableTransformEnd', tableGroup.value?.rotation() ?? 0);
}
</script>

<template>
    <v-group
        ref="tableGroup"
        :x="position.x"
        :y="position.y"
        draggable
        @mousedown="handleTableClick"
        @transformend="handleTableTransformEnd"
    >
        <v-rect
            v-if="tableShape === 'rect'"
            :x="-(tableData.width / 2)"
            :y="-(tableData.height / 2)"
            :width="tableData.width"
            :height="tableData.height"
            stroke="silver"
            :stroke-width="4"
        />
        <v-circle
            v-else-if="tableShape === 'circle'"
            :radius="tableData.radius"
            stroke="silver"
            :stroke-width="4"
        />
        <v-rect
            v-if="focus"
            :width="tableData.width"
            :height="tableData.height"
            fill="transparent"
        />
        <v-rect
            ref="eventRect"
            fill="transparent"
            :width="tableData.width"
            :height="tableData.height"
            :opacity="focus ? 0.1 : 0"
            @mousedown="handleTableClick"
        />
    </v-group>
</template>
