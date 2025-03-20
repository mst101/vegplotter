<script setup lang="ts">
import type Konva from 'konva';
import { computed, ref } from 'vue';

const width = 800;
const height = 400;

const stageRef = ref<Konva.Stage | null>(null);
const scaleDisplay = ref<number>(1);
const currentSolution = ref<string>('solution1');

const stepSize = 40;
const scales: number[] = [
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
let currentScaleIndex: number = 6;

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

const stagePosition = ref({ x: 0, y: 0 });
const stageScale = ref({ x: 1, y: 1 });

function unScale(val: number) {
    if (!stageRef.value)
        return val;
    return val / stageScale.value.x;
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

const fullRect = computed<RectProps>(() => ({
    x1: Math.min(0, viewRect.value.x1),
    y1: Math.min(0, viewRect.value.y1),
    x2: Math.max(width, viewRect.value.x2),
    y2: Math.max(height, viewRect.value.y2),
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
    let xSize: number, ySize: number, xSteps: number, ySteps: number, fullRectToUse: RectProps;

    switch (currentSolution.value) {
        case 'solution1':
            xSize = width;
            ySize = height;
            xSteps = Math.round(xSize / stepSize);
            ySteps = Math.round(ySize / stepSize);

            for (let i = 0; i <= xSteps; i++) {
                lines.push({ x: i * stepSize, y: 0, points: [0, 0, 0, ySize] });
            }
            for (let i = 0; i <= ySteps; i++) {
                lines.push({ x: 0, y: i * stepSize, points: [0, 0, xSize, 0] });
            }
            break;
        case 'solution2':
            xSize = fullRect.value.x2 - fullRect.value.x1;
            ySize = fullRect.value.y2 - fullRect.value.y1;
            xSteps = Math.round(xSize / stepSize);
            ySteps = Math.round(ySize / stepSize);

            for (let i = 0; i <= xSteps; i++) {
                lines.push({ x: fullRect.value.x1 + i * stepSize, y: fullRect.value.y1, points: [0, 0, 0, ySize] });
            }
            for (let i = 0; i <= ySteps; i++) {
                lines.push({ x: fullRect.value.x1, y: fullRect.value.y1 + i * stepSize, points: [0, 0, xSize, 0] });
            }
            break;
        case 'solution3':
            fullRectToUse = gridFullRect.value;
            xSize = fullRectToUse.x2 - fullRectToUse.x1;
            ySize = fullRectToUse.y2 - fullRectToUse.y1;
            xSteps = Math.round(xSize / stepSize);
            ySteps = Math.round(ySize / stepSize);

            for (let i = 0; i <= xSteps; i++) {
                lines.push({ x: fullRectToUse.x1 + i * stepSize, y: fullRectToUse.y1, points: [0, 0, 0, ySize] });
            }
            for (let i = 0; i <= ySteps; i++) {
                lines.push({ x: fullRectToUse.x1, y: fullRectToUse.y1 + i * stepSize, points: [0, 0, xSize, 0] });
            }
            break;
        case 'solution4':
            fullRectToUse = gridFullRect.value;
            xSize = fullRectToUse.x2 - fullRectToUse.x1;
            ySize = fullRectToUse.y2 - fullRectToUse.y1;
            xSteps = Math.round(xSize / stepSize);
            ySteps = Math.round(ySize / stepSize);

            for (let i = 0; i <= xSteps; i++) {
                lines.push({ x: fullRectToUse.x1 + i * stepSize, y: fullRectToUse.y1, points: [0, 0, 0, ySize] });
            }
            for (let i = 0; i <= ySteps; i++) {
                lines.push({ x: fullRectToUse.x1, y: fullRectToUse.y1 + i * stepSize, points: [0, 0, xSize, 0] });
            }
            break;
    }

    return lines;
});

const gridClip = computed(() => {
    if (currentSolution.value === 'solution4') {
        return {
            x: viewRect.value.x1,
            y: viewRect.value.y1,
            width: viewRect.value.x2 - viewRect.value.x1,
            height: viewRect.value.y2 - viewRect.value.y1,
        };
    }
    return null;
});

function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();

    const stage = stageRef.value.getStage();
    const oldScale = stageScale.value.x;
    const pointer = stage.getPointerPosition();

    if (!pointer)
        return;

    const mousePointTo = {
        x: (pointer.x - stagePosition.value.x) / oldScale,
        y: (pointer.y - stagePosition.value.y) / oldScale,
    };

    let direction = e.evt.deltaY > 0 ? 1 : -1;

    if (e.evt.ctrlKey) {
        direction = -direction;
    }

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
    if (!stageRef.value)
        return;
    const dataURL = stageRef.value.toDataURL();
    downloadURI(dataURL, 'stage.png');
}

function saveExtended() {
    if (!stageRef.value)
        return;
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

function handleSolutionChange(event: Event) {
    const target = event.target as HTMLInputElement;
    currentSolution.value = target.value;
}
</script>

<template>
    <p>Select a solution in sequence, use mouse wheel to zoom in and out</p>
    <p>Red box is the viewport (initial stage size), blue is Konva Stage.</p>
    <p>Scale: <span id="scaleDisplay">{{ scaleDisplay }}</span></p>
    <p>
        <input
            id="solution1" type="radio" class="mr-1" name="solutionNo" value="solution1"
            :checked="currentSolution === 'solution1'" @change="handleSolutionChange"
        ><label for="solution1">Solution 1 -
            grid on stage</label><br>
        <input
            id="solution2" type="radio" class="mr-1" name="solutionNo" value="solution2"
            :checked="currentSolution === 'solution2'" @change="handleSolutionChange"
        ><label for="solution2">Solution 2 -
            grid on merged</label><br>
        <input
            id="solution3" type="radio" class="mr-1" name="solutionNo" value="solution3"
            :checked="currentSolution === 'solution3'" @change="handleSolutionChange"
        ><label for="solution3">Solution 3 -
            grid on merged inc fix for dancing grid effect</label><br>
        <input
            id="solution4" type="radio" class="mr-1" name="solutionNo" value="solution4"
            :checked="currentSolution === 'solution4'" @change="handleSolutionChange"
        ><label for="solution4">Solution 4 -
            optimised drawing via clip function</label>
    </p>
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
