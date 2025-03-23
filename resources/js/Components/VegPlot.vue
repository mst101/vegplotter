<script setup lang="ts">
import type Konva from 'konva';
import { computed, ref, watch } from 'vue';
import SidePanel from '@/Components/SidePanel.vue';
import type { Plot, VueKonvaRef } from '@/types';

const props = defineProps<{ plots: Plot }>();

// Setup reactive state
const updateKey = ref(0);
const stage = ref<VueKonvaRef<Konva.Stage> | null>(null);
const background = ref<VueKonvaRef<Konva.Layer> | null>(null);
const grid = ref<VueKonvaRef<Konva.Group> | null>(null);
const axesLayer = ref<VueKonvaRef<Konva.Layer> | null>(null);
const scaleDisplay = ref(1);
const stageConfig = ref<Konva.StageConfig>({
    width: window.innerWidth - 260,
    height: window.innerHeight - 116,
});
const gridX = ref(0);
const gridY = ref(0);

const paddingX = computed(() =>
    calculatePadding(stageConfig.value.width!, props.plots.width),
);

const paddingY = computed(() =>
    calculatePadding(stageConfig.value.height!, props.plots.length),
);

const plotAreaConfig = computed<Konva.GroupConfig>(() => {
    let x = paddingX.value;
    let y = paddingY.value;
    const plotWidthScaled = props.plots.width * 100 * scaleDisplay.value;
    const plotHeightScaled = props.plots.length * 100 * scaleDisplay.value;

    if (stageConfig.value.width! > props.plots.width * 100) {
        x = (stageConfig.value.width! - props.plots.width * 100) / 2;
    }
    if (stageConfig.value.height! > props.plots.length * 100) {
        y = (stageConfig.value.height! - props.plots.length * 100) / 2;
    }

    if (scaleDisplay.value < 1) {
        if (plotWidthScaled < stageConfig.value.width!) {
            x = (stageConfig.value.width! - plotWidthScaled) / 2 / scaleDisplay.value;
        }
        if (plotHeightScaled < stageConfig.value.height!) {
            y = (stageConfig.value.height! - plotHeightScaled) / 2 / scaleDisplay.value;
        }
    }

    return {
        x,
        y,
        width: props.plots.width * 100,
        height: props.plots.length * 100,
        fill: '#eee',
        stroke: 'black',
    };
});

// Computed for grid dimensions and boundaries
const gridWidth = computed(() => {
    if (plotAreaConfig.value.width! + (paddingX.value * 2) < stageConfig.value.width!) {
        return stageConfig.value.width;
    }
    return plotAreaConfig.value.width! + plotAreaConfig.value.x! + paddingX.value;
});
const gridHeight = computed(() => {
    if (plotAreaConfig.value.height! + (paddingY.value * 2) < stageConfig.value.height!) {
        return stageConfig.value.height;
    }
    return plotAreaConfig.value.height! + plotAreaConfig.value.y! + paddingY.value;
});

const minX = computed(() => Math.min(0, stageConfig.value.width! - gridWidth.value! * scaleDisplay.value));
const maxX = computed(() => 0);
const minY = computed(() => Math.min(0, stageConfig.value.height! - gridHeight.value! * scaleDisplay.value));
const maxY = computed(() => 0);

const gridConfig = computed<Konva.GroupConfig>(() => {
    return {
        x: gridX.value,
        y: gridY.value,
        width: gridWidth.value,
        height: gridHeight.value,
        scaleX: scaleDisplay.value,
        scaleY: scaleDisplay.value,
        draggable: true,
        dragBoundFunc: (pos: { x: number; y: number }) => {
            const newX = Math.max(minX.value, Math.min(maxX.value, pos.x));
            const newY = Math.max(minY.value, Math.min(maxY.value, pos.y));
            return { x: newX, y: newY };
        },
    };
});

// Axis ticks computed
const xAxisTicks = computed(() => {
    const ticks = [];
    const plotStartX = plotAreaConfig.value.x!;
    const plotWidth = plotAreaConfig.value.width!;
    const numTicks = Math.ceil(plotWidth / 100) + 1;
    for (let i = 0; i < numTicks; i++) {
        ticks.push({ x: plotStartX + i * 100, text: `${i}m` });
    }
    return ticks;
});

const yAxisTicks = computed(() => {
    const ticks = [];
    const plotStartY = plotAreaConfig.value.y!;
    const plotHeight = plotAreaConfig.value.height!;
    const numTicks = Math.ceil(plotHeight / 100) + 1;
    for (let i = 0; i < numTicks; i++) {
        ticks.push({ y: plotStartY + i * 100, text: `${i}m` });
    }
    return ticks;
});

// Scale related
const scales = [5, 4, 3, 2.5, 2, 1.5, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
let currentScaleIndex = 6;

// Methods
function calculatePadding(stageSize: number, plotSize: number) {
    const padding = (stageSize - (plotSize * 100)) / 2;
    if (padding < -50)
        return Math.min(50, Math.abs(padding));
    if (padding < 0)
        return Math.max(50, Math.abs(padding));
    return padding;
}

function unScale(val: number) {
    return val / scaleDisplay.value;
}

function handleGridDragEnd(e: Konva.KonvaEventObject<any>) {
    gridX.value = e.target.x();
    gridY.value = e.target.y();
}

function resizeStage() {
    stageConfig.value.width = window.innerWidth - 260;
    stageConfig.value.height = window.innerHeight - 116;
}

function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();
    const stageNode = stage.value!.getNode();
    const oldScale = scaleDisplay.value;
    const pointer = stageNode?.getPointerPosition();
    if (!pointer)
        return;

    // Calculate mouse position relative to the grid
    const mousePointTo = {
        x: (pointer.x - gridX.value) / oldScale,
        y: (pointer.y - gridY.value) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    if (direction > 0) {
        currentScaleIndex = Math.max(0, currentScaleIndex - 1);
    }
    else {
        currentScaleIndex = Math.min(scales.length - 1, currentScaleIndex + 1);
    }

    const newScale = scales[currentScaleIndex];

    // Calculate new position to zoom towards the mouse pointer
    const newX = pointer.x - mousePointTo.x * newScale;
    const newY = pointer.y - mousePointTo.y * newScale;

    // Apply constraints when zoomed out
    const adjustedMinX = Math.min(0, stageConfig.value.width! - gridWidth.value! * newScale);
    const adjustedMinY = Math.min(0, stageConfig.value.height! - gridHeight.value! * newScale);

    // Set the grid position
    gridX.value = Math.max(adjustedMinX, Math.min(0, newX));
    gridY.value = Math.max(adjustedMinY, Math.min(0, newY));

    scaleDisplay.value = newScale;
}

window.addEventListener('resize', resizeStage);

// Compute grid offset based on plot area
const gridOffset = computed(() => ({
    x: plotAreaConfig.value.x! % 100,
    y: plotAreaConfig.value.y! % 100,
}));

const scaledWidth = computed(() => {
    return scaleDisplay.value >= 1 ? gridWidth.value : unScale(gridWidth.value!);
});
const scaledHeight = computed(() => {
    return scaleDisplay.value >= 1 ? gridHeight.value : unScale(gridHeight.value!);
});

function updateGridPosition() {
    // Calculate plot dimensions with current scale
    const scaledPlotWidth = props.plots.width * 100 * scaleDisplay.value;
    const scaledPlotHeight = props.plots.length * 100 * scaleDisplay.value;

    // Update gridX - center if plot is smaller than stage, otherwise apply constraints
    gridX.value = scaledPlotWidth > stageConfig.value.width!
        ? (stageConfig.value.width! - scaledPlotWidth) / 2 / scaleDisplay.value
        : Math.max(minX.value, 0);

    // Update gridY - center if plot is smaller than stage, otherwise apply constraints
    gridY.value = scaledPlotHeight > stageConfig.value.height!
        ? (stageConfig.value.height! - scaledPlotHeight) / 2 / scaleDisplay.value
        : Math.max(minY.value, 0);
}

// Compute horizontal grid lines visible within grid-group boundaries
const horizontalGridLines = computed(() => {
    const lines = [];
    const offsetY = gridOffset.value.y;
    const groupHeight = scaledHeight.value!;
    const start = Math.ceil((100 - offsetY) / 10);
    const end = Math.floor((groupHeight + 100 - offsetY) / 10);
    for (let n = start; n <= end; n++) {
        const y = -100 + n * 10 + offsetY;
        if (y >= 0 && y <= groupHeight) {
            lines.push({ index: n, y, strokeWidth: n % 10 === 0 ? 1 : 0.5 });
        }
    }
    return lines;
});

// Compute vertical grid lines visible within grid-group boundaries
const verticalGridLines = computed(() => {
    const lines = [];
    const offsetX = gridOffset.value.x;
    const groupWidth = scaledWidth.value!;
    const start = Math.ceil((100 - offsetX) / 10);
    const end = Math.floor((groupWidth + 100 - offsetX) / 10);
    for (let n = start; n <= end; n++) {
        const x = -100 + n * 10 + offsetX;
        if (x >= 0 && x <= groupWidth) {
            lines.push({ index: n, x, strokeWidth: n % 10 === 0 ? 1 : 0.5 });
        }
    }
    return lines;
});

watch(
    [
        () => props.plots.length,
        () => props.plots.width,
        () => stageConfig.value.height,
        () => stageConfig.value.width,
    ],
    updateGridPosition,
    { immediate: true },
);
</script>

<template>
    <div>
        <p class="h-[50px] space-x-4 bg-gray-300 p-2 text-xs">
            <span>Scale: {{ scaleDisplay }}</span>
            <span>stageConfig.width: {{ stageConfig.width }}</span>
            <span>gridWidth: {{ gridWidth }}</span>
            <span>gridHeight: {{ gridHeight }}</span>
            <span>minX: {{ minX }}</span>
            <span>maxX: {{ maxX }}</span>
            <span>minY: {{ minY }}</span>
            <span>maxY: {{ maxY }}</span>
            <span>gridConfigX: {{ gridConfig.x }}</span>
            <span>gridConfigY: {{ gridConfig.y }}</span>
        </p>
        <div class="flex">
            <div>
                <v-stage ref="stage" :key="updateKey" :config="stageConfig" @wheel="handleWheel">
                    <v-layer ref="background" name="background">
                        <v-group
                            id="grid-group"
                            ref="grid"
                            name="grid"
                            :config="gridConfig"
                            @dragend="handleGridDragEnd"
                        >
                            <v-rect
                                name="grid-background"
                                :config="{
                                    x: 0,
                                    y: 0,
                                    width: scaledWidth,
                                    height: scaledHeight,
                                    fill: '#abb',
                                }"
                            />
                            <v-rect name="plot-area" :config="plotAreaConfig" />

                            <!-- Horizontal grid lines -->
                            <v-line
                                v-for="line in horizontalGridLines"
                                :key="`h-${line.index}`"
                                name="gridLines-h"
                                :config="{
                                    x: 0,
                                    y: line.y,
                                    points: [0, 0, scaledWidth, 0],
                                    stroke: 'gray',
                                    strokeWidth: line.strokeWidth,
                                }"
                            />

                            <!-- Vertical grid lines -->
                            <v-line
                                v-for="line in verticalGridLines"
                                :key="`v-${line.index}`"
                                name="gridLines-v"
                                :config="{
                                    x: line.x,
                                    y: 0,
                                    points: [0, 0, 0, scaledHeight],
                                    stroke: 'gray',
                                    strokeWidth: line.strokeWidth,
                                }"
                            />
                        </v-group>
                    </v-layer>

                    <!-- Fixed axes layer -->
                    <v-layer ref="axesLayer" name="axes" :config="{ visible: false }">
                        <!-- X-axis -->
                        <v-line
                            name="x-axis"
                            :config="{
                                x: 0,
                                y: 10,
                                points: [0, 0, stageConfig.width, 0],
                                stroke: 'black',
                                strokeWidth: 20,
                                opacity: 0.5,
                            }"
                        />

                        <!-- Y-axis -->
                        <v-line
                            name="y-axis"
                            :config="{
                                x: 10,
                                y: 0,
                                points: [0, 0, 0, stageConfig.height],
                                stroke: 'black',
                                strokeWidth: 20,
                                opacity: 0.5,
                            }"
                        />

                        <!-- X-axis tick marks and labels -->
                        <v-group :config="{ x: gridX }">
                            <template v-for="(tick, index) in xAxisTicks" :key="`x-tick-${index}`">
                                <v-line
                                    :config="{
                                        x: tick.x,
                                        y: 15,
                                        points: [0, 0, 0, 5],
                                        stroke: 'white',
                                        strokeWidth: 1,
                                    }"
                                />
                                <v-text
                                    :config="{
                                        x: tick.x - 7,
                                        y: 3,
                                        text: tick.text,
                                        fontSize: 10,
                                        fill: 'white',
                                        align: 'center',
                                    }"
                                />
                            </template>
                        </v-group>

                        <!-- Y-axis tick marks and labels -->
                        <v-group :config="{ y: gridY }">
                            <template v-for="(tick, index) in yAxisTicks" :key="`y-tick-${index}`">
                                <v-line
                                    :config="{
                                        x: 15,
                                        y: tick.y,
                                        points: [0, 0, 5, 0],
                                        stroke: 'white',
                                        strokeWidth: 1,
                                    }"
                                />
                                <v-text
                                    :config="{
                                        x: 3,
                                        y: tick.y + 7,
                                        text: tick.text,
                                        fontSize: 10,
                                        rotation: 270,
                                        fill: 'white',
                                        align: 'left',
                                    }"
                                />
                            </template>
                        </v-group>
                    </v-layer>
                </v-stage>
            </div>
            <div class="w-full">
                <SidePanel />
            </div>
        </div>
    </div>
</template>
