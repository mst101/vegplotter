<script setup lang="ts">
import { computed, ref } from 'vue';

const width = 800;
const height = 400;

const stageRef = ref(null);
const stepSize = 40;
const scaleDisplay = ref(1);
const scales = [
    5,
    4,
    3,
    2.5,
    2,
    1.5,
    1,
    0.9,
    0.8,
    0.7,
    0.6,
    0.5,
    0.4,
    0.3,
    0.2,
    0.1,
    0.05,
];
let currentScaleIndex = 6;

const stagePosition = ref({ x: 0, y: 0 });
const stageScale = ref({ x: 1, y: 1 });

interface RectProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    offset?: { x: number; y: number };
}

interface OffsetProps {
    x: number;
    y: number;
}

const stageRect = computed<RectProps>(() => ({
    x1: 0,
    y1: 0,
    x2: width,
    y2: height,
    offset: {
        x: unScale(stagePosition.value.x),
        y: unScale(stagePosition.value.y),
    },
}));

const viewRect = computed<RectProps>(() => ({
    x1: -stageRect.value.offset.x,
    y1: -stageRect.value.offset.y,
    x2: unScale(width) - stageRect.value.offset.x,
    y2: unScale(height) - stageRect.value.offset.y,
}));

const gridOffset = computed<OffsetProps>(() => ({
    x: Math.ceil(unScale(stagePosition.value.x) / stepSize) * stepSize,
    y: Math.ceil(unScale(stagePosition.value.y) / stepSize) * stepSize,
}));

const gridRect = computed<RectProps>(() => ({
    x1: -gridOffset.value.x,
    y1: -gridOffset.value.y,
    x2: unScale(width) - gridOffset.value.x + stepSize,
    y2: unScale(height) - gridOffset.value.y + stepSize,
}));

const gridFullRect = computed<RectProps>(() => ({
    x1: Math.min(0, gridRect.value.x1),
    y1: Math.min(0, gridRect.value.y1),
    x2: Math.max(width, gridRect.value.x2),
    y2: Math.max(height, gridRect.value.y2),
}));

const gridLines = computed(() => {
    const lines: { x: number; y: number; points: number[] }[] = [];
    const xSize = gridFullRect.value.x2 - gridFullRect.value.x1;
    const ySize = gridFullRect.value.y2 - gridFullRect.value.y1;
    const xSteps = Math.round(xSize / stepSize);
    const ySteps = Math.round(ySize / stepSize);

    for (let i = 0; i <= xSteps; i++) {
        lines.push({ x: gridFullRect.value.x1 + i * stepSize, y: gridFullRect.value.y1, points: [0, 0, 0, ySize] });
    }
    for (let i = 0; i <= ySteps; i++) {
        lines.push({ x: gridFullRect.value.x1, y: gridFullRect.value.y1 + i * stepSize, points: [0, 0, xSize, 0] });
    }

    return lines;
});

const gridClip = computed(() => {
    return {
        x: viewRect.value.x1,
        y: viewRect.value.y1,
        width: viewRect.value.x2 - viewRect.value.x1,
        height: viewRect.value.y2 - viewRect.value.y1,
    };
});

function unScale(val: number) {
    return val / stageScale.value.x;
}

function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();

    const stage = stageRef.value.getStage();
    const oldScale = stageScale.value.x;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
        x: (pointer.x - stagePosition.value.x) / oldScale,
        y: (pointer.y - stagePosition.value.y) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;

    if (direction > 0) {
        currentScaleIndex = currentScaleIndex > 0 ? currentScaleIndex - 1 : currentScaleIndex;
    }
    else {
        currentScaleIndex = currentScaleIndex < scales.length - 1 ? currentScaleIndex + 1 : currentScaleIndex;
    }

    const newScale = scales[currentScaleIndex];

    stageScale.value = { x: newScale, y: newScale };

    stagePosition.value = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    scaleDisplay.value = newScale;
}

function handleDragEnd() {
    // No need to redraw lines here, the gridLines computed property will handle it
}

function saveDefault() {
    const dataURL = stageRef.value.toDataURL();
    downloadURI(dataURL, 'stage.png');
}

function saveExtended() {
    const dataURL = stageRef.value.toDataURL({ x: -200, y: -200, width: 1200, height: 800 });
    downloadURI(dataURL, 'stage.png');
}

function downloadURI(uri: string, name: string) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>

<template>
    <p>Select a solution in sequence, use mouse wheel to zoom in and out</p>
    <p>Red box is the viewport (initial stage size), blue is Konva Stage.</p>
    <p>Scale: <span id="scaleDisplay">{{ scaleDisplay }}</span></p>
    <p id="buttons" class="mt-2 space-x-2">
        <button class="rounded border border-gray-300 bg-gray-200 px-4 py-1 hover:bg-gray-300" @click="saveDefault">
            Save viewport image
        </button>
        <button class="rounded border border-gray-300 bg-gray-200 px-4 py-1 hover:bg-gray-300" @click="saveExtended">
            Save viewport plus 200px around
        </button>
    </p>

    <v-stage
        ref="stageRef"
        :config="{
            width,
            height,
            draggable: true,
            x: stagePosition.x,
            y: stagePosition.y,
            scaleX: stageScale.x,
            scaleY: stageScale.y,
        }"
        @wheel="handleWheel"
        @dragend="handleDragEnd"
    >
        <v-layer :config="{ clip: gridClip }">
            <v-line
                v-for="(line, index) in gridLines"
                :key="index"
                :config="{
                    x: line.x,
                    y: line.y,
                    points: line.points,
                    stroke: 'rgba(0, 0, 0, 0.2)',
                    strokeWidth: 1,
                }"
            />
            <v-rect
                :config="{
                    x: viewRect.x1 + 2,
                    y: viewRect.y1 + 2,
                    width: viewRect.x2 - viewRect.x1 - 4,
                    height: viewRect.y2 - viewRect.y1 - 4,
                    strokeWidth: 4,
                    stroke: 'red',
                }"
            />
        </v-layer>

        <v-layer>
            <v-rect
                :config="{
                    name: 'rStageFill',
                    x: 2,
                    y: 2,
                    width: width - 4,
                    height: height - 4,
                    fill: 'yellow',
                    opacity: 0.2,
                }"
            />
            <v-rect
                :config="{
                    name: 'rStageBorder',
                    x: 2,
                    y: 2,
                    width: width - 4,
                    height: height - 4,
                    strokeWidth: 4,
                    stroke: 'green',
                }"
            />
            <v-rect
                :config="{
                    name: 'r1',
                    x: 0,
                    y: 0,
                    width: 40,
                    height: 40,
                    fill: 'blue',
                    draggable: true,
                }"
            />
            <v-circle
                :config="{
                    name: 'circle',
                    x: width / 2,
                    y: height / 2,
                    radius: 50,
                    fill: 'orange',
                    draggable: true,
                }"
            />
        </v-layer>
    </v-stage>
</template>
