<!--<script setup lang="ts">-->
<!--import { defineEmits, defineProps, onMounted, ref, watch } from 'vue';-->
<!--import Konva from 'konva';-->
<!--import Utils from '@/Utils/Konva';-->
<!--import type { Position } from '@/types';-->

<!--const props = defineProps<{-->
<!--    x: number;-->
<!--    y: number;-->
<!--    angle: number;-->
<!--    tableGroup: Konva.Group;-->
<!--    tableId: string;-->
<!--}>();-->

<!--const emits = defineEmits<{-->
<!--    (e: 'update:position', position: Position): void;-->
<!--}>();-->

<!--const chairSize = {-->
<!--    width: 60,-->
<!--    height: 60,-->
<!--    outerWidth: 60,-->
<!--    outerHeight: 60,-->
<!--};-->

<!--const container = ref<HTMLElement | null>(null);-->
<!--const id = ref<string>(Utils.getUUID());-->
<!--const parentId = ref<string | null>(props.tableId);-->
<!--const angle = ref<number>(props.angle);-->
<!--const konvaShape = ref<Konva.Group | null>(null);-->
<!--const position = ref<Position>({ x: props.x, y: props.y });-->
<!--const visible = ref<boolean>(true);-->

<!--function drawFirstTime(tableGroup: Konva.Group) {-->
<!--    konvaShape.value = new Konva.Group({-->
<!--        offset: {-->
<!--            x: chairSize.width / 2,-->
<!--            y: chairSize.height / 2,-->
<!--        },-->
<!--        x: position.value.x,-->
<!--        y: position.value.y,-->
<!--        rotation: angle.value,-->
<!--        draggable: false,-->
<!--    });-->

<!--    const rect1: Konva.Rect = new Konva.Rect({-->
<!--        width: chairSize.width,-->
<!--        height: chairSize.height,-->
<!--        stroke: 'silver',-->
<!--        strokeWidth: 4,-->
<!--        fill: 'transparent',-->
<!--        cornerRadius: [0, 20, 20, 0],-->
<!--    });-->

<!--    const rect2 = rect1.clone({-->
<!--        width: 10,-->
<!--    });-->

<!--    konvaShape.value.add(rect2, rect1);-->

<!--    tableGroup.add(konvaShape.value);-->
<!--}-->

<!--function drawEveryTime() {-->
<!--    if (konvaShape.value) {-->
<!--        konvaShape.value.position(position.value);-->
<!--        konvaShape.value.rotation(angle.value);-->
<!--        konvaShape.value.visible(visible.value);-->
<!--    }-->
<!--}-->

<!--onMounted(() => {-->
<!--    drawFirstTime(props.tableGroup);-->
<!--    drawEveryTime();-->
<!--});-->

<!--watch([position, angle, visible], () => {-->
<!--    drawEveryTime();-->
<!--});-->

<!--watch(() => props.x, (newX) => {-->
<!--    position.value.x = newX;-->
<!--    emits('update:position', position.value);-->
<!--});-->

<!--watch(() => props.y, (newY) => {-->
<!--    position.value.y = newY;-->
<!--    emits('update:position', position.value);-->
<!--});-->
<!--</script>-->

<!--<template>-->
<!--    <div ref="container" />-->
<!--</template>-->
