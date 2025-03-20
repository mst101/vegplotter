<script setup lang="ts">
import { onMounted, ref } from 'vue';

const width = 800;
const height = 400;

const stageRef = ref(null);
const stepSize = 40;
const currentSolution = ref('solution1');
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

const stageConfig = ref({
    width,
    height,
    draggable: true,
    scaleX: scales[currentScaleIndex],
    scaleY: scales[currentScaleIndex],
    x: 0,
    y: 0,
});

const gridLayerConfig = ref({
    draggable: false,
    x: 0,
    y: 0,
    clip: null,
});

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

const stageRect = ref<RectProps>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const viewRect = ref<RectProps>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const fullRect = ref<RectProps>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const gridOffset = ref<OffsetProps>({ x: 0, y: 0 });
const gridRect = ref<RectProps>({ x1: 0, y1: 0, x2: 0, y2: 0 });
const gridFullRect = ref<RectProps>({ x1: 0, y1: 0, x2: 0, y2: 0 });

// Grid lines
const gridLines = ref<Array<{ key: string; config: any }>>([]);
const viewportRect = ref({ x: 0, y: 0, width: 0, height: 0, stroke: 'red', strokeWidth: 4 });

function unScale(val: number) {
    return val / stageConfig.value.scaleX;
}

function calculateGridDimensions() {
    if (!stageRef.value)
        return;

    const stage = stageRef.value.getNode();

    stageRect.value = {
        x1: 0,
        y1: 0,
        x2: stage.width(),
        y2: stage.height(),
        offset: {
            x: unScale(stage.position().x),
            y: unScale(stage.position().y),
        },
    };

    viewRect.value = {
        x1: -stageRect.value.offset.x,
        y1: -stageRect.value.offset.y,
        x2: unScale(width) - stageRect.value.offset.x,
        y2: unScale(height) - stageRect.value.offset.y,
    };

    fullRect.value = {
        x1: Math.min(stageRect.value.x1, viewRect.value.x1),
        y1: Math.min(stageRect.value.y1, viewRect.value.y1),
        x2: Math.max(stageRect.value.x2, viewRect.value.x2),
        y2: Math.max(stageRect.value.y2, viewRect.value.y2),
    };

    gridOffset.value = {
        x: Math.ceil(unScale(stage.position().x) / stepSize) * stepSize,
        y: Math.ceil(unScale(stage.position().y) / stepSize) * stepSize,
    };

    gridRect.value = {
        x1: -gridOffset.value.x,
        y1: -gridOffset.value.y,
        x2: unScale(width) - gridOffset.value.x + stepSize,
        y2: unScale(height) - gridOffset.value.y + stepSize,
    };

    gridFullRect.value = {
        x1: Math.min(stageRect.value.x1, gridRect.value.x1),
        y1: Math.min(stageRect.value.y1, gridRect.value.y1),
        x2: Math.max(stageRect.value.x2, gridRect.value.x2),
        y2: Math.max(stageRect.value.y2, gridRect.value.y2),
    };

    // Update viewport rectangle
    viewportRect.value = {
        x: viewRect.value.x1 + 2,
        y: viewRect.value.y1 + 2,
        width: viewRect.value.x2 - viewRect.value.x1 - 4,
        height: viewRect.value.y2 - viewRect.value.y1 - 4,
        stroke: 'red',
        strokeWidth: 4,
    };

    // Apply clipping if solution 4 is selected
    if (currentSolution.value === 'solution4') {
        gridLayerConfig.value.clip = {
            x: viewRect.value.x1,
            y: viewRect.value.y1,
            width: viewRect.value.x2 - viewRect.value.x1,
            height: viewRect.value.y2 - viewRect.value.y1,
        };
    }
    else {
        gridLayerConfig.value.clip = null;
    }

    drawLines();
}

function drawLines() {
    gridLines.value = [];

    let rect: RectProps;

    switch (currentSolution.value) {
        case 'solution1':
            const xSize = stageConfig.value.width;
            const ySize = stageConfig.value.height;
            const xSteps = Math.round(xSize / stepSize);
            const ySteps = Math.round(ySize / stepSize);

            // Vertical lines
            for (let i = 0; i <= xSteps; i++) {
                gridLines.value.push({
                    key: `v-${i}`,
                    config: {
                        x: i * stepSize,
                        points: [0, 0, 0, ySize],
                        stroke: 'rgba(0, 0, 0, 0.2)',
                        strokeWidth: 1,
                    },
                });
            }

            // Horizontal lines
            for (let i = 0; i <= ySteps; i++) {
                gridLines.value.push({
                    key: `h-${i}`,
                    config: {
                        y: i * stepSize,
                        points: [0, 0, xSize, 0],
                        stroke: 'rgba(0, 0, 0, 0.2)',
                        strokeWidth: 1,
                    },
                });
            }
            break;

        case 'solution2':
            rect = fullRect.value;
            break;

        case 'solution3':
        case 'solution4':
            rect = gridFullRect.value;
            break;
    }

    if (currentSolution.value !== 'solution1') {
        const xSize = rect.x2 - rect.x1;
        const ySize = rect.y2 - rect.y1;
        const xSteps = Math.round(xSize / stepSize);
        const ySteps = Math.round(ySize / stepSize);

        // Vertical lines
        for (let i = 0; i <= xSteps; i++) {
            gridLines.value.push({
                key: `v-${i}`,
                config: {
                    x: rect.x1 + i * stepSize,
                    y: rect.y1,
                    points: [0, 0, 0, ySize],
                    stroke: 'rgba(0, 0, 0, 0.2)',
                    strokeWidth: 1,
                },
            });
        }

        // Horizontal lines
        for (let i = 0; i <= ySteps; i++) {
            gridLines.value.push({
                key: `h-${i}`,
                config: {
                    x: rect.x1,
                    y: rect.y1 + i * stepSize,
                    points: [0, 0, xSize, 0],
                    stroke: 'rgba(0, 0, 0, 0.2)',
                    strokeWidth: 1,
                },
            });
        }
    }
}

function handleWheel(e) {
    e.evt.preventDefault();

    const stage = stageRef.value.getNode();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
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

    stageConfig.value.scaleX = newScale;
    stageConfig.value.scaleY = newScale;

    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    stageConfig.value.x = newPos.x;
    stageConfig.value.y = newPos.y;

    scaleDisplay.value = newScale;

    calculateGridDimensions();
}

function handleDragEnd() {
    calculateGridDimensions();
}

function saveDefault() {
    const dataURL = stageRef.value.getNode().toDataURL();
    downloadURI(dataURL, 'stage.png');
}

function saveExtended() {
    const dataURL = stageRef.value.getNode().toDataURL({ x: -200, y: -200, width: 1200, height: 800 });
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
    calculateGridDimensions();
}

onMounted(() => {
    calculateGridDimensions();
});
</script>

<template>
    <p>Select a solution in sequence, use mouse wheel to zoom in and out</p>
    <p>Red box is the viewport (initial stage size), blue is Konva Stage.</p>
    <p>Scale: <span id="scaleDisplay">{{ scaleDisplay }}</span></p>
    <p>
        <input
            id="solution1" type="radio" class="mr-1" name="solutionNo" value="solution1"
            :checked="currentSolution === 'solution1'" @change="handleSolutionChange"
        ><label for="solution1">Solution 1 - grid on stage</label><br>
        <input
            id="solution2" type="radio" class="mr-1" name="solutionNo" value="solution2"
            :checked="currentSolution === 'solution2'" @change="handleSolutionChange"
        ><label for="solution2">Solution 2 - grid on merged</label><br>
        <input
            id="solution3" type="radio" class="mr-1" name="solutionNo" value="solution3"
            :checked="currentSolution === 'solution3'" @change="handleSolutionChange"
        ><label for="solution3">Solution 3 - grid on merged inc fix for dancing grid effect</label><br>
        <input
            id="solution4" type="radio" class="mr-1" name="solutionNo" value="solution4"
            :checked="currentSolution === 'solution4'" @change="handleSolutionChange"
        ><label for="solution4">Solution 4 - optimised drawing via clip function</label>
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
        :config="stageConfig"
        @wheel="handleWheel"
        @dragend="handleDragEnd"
    >
        <v-layer :config="gridLayerConfig">
            <v-line
                v-for="line in gridLines"
                :key="line.key"
                :config="line.config"
            />
            <v-rect :config="viewportRect" />
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
