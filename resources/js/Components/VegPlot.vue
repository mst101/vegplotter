<script setup lang="ts">
import type Konva from 'konva';
import { computed, ref } from 'vue';
import SidePanel from '@/Components/SidePanel.vue';
import type { Plot, VueKonvaRef } from '@/types';

const props = defineProps<{ plots: Plot }>();

// Setup reactive state
const updateKey = ref(0);
const stage = ref<VueKonvaRef<Konva.Stage> | null>(null);
const background = ref<VueKonvaRef<Konva.Layer> | null>(null);
const grid = ref<VueKonvaRef<Konva.Group> | null>(null);
const axesLayer = ref<VueKonvaRef<Konva.Layer> | null>(null);

const stageConfig = ref<Konva.StageConfig>({
    width: window.innerWidth - 260,
    height: window.innerHeight - 116,
});

const plotAreaConfig = computed<Konva.GroupConfig>(() => {
    let x = 50;
    let y = 50;
    if (stageConfig.value.width! > props.plots.width * 100) {
        x = (stageConfig.value.width! - props.plots.width * 100) / 2;
    }
    if (stageConfig.value.height! > props.plots.length * 100) {
        y = (stageConfig.value.height! - props.plots.length * 100) / 2;
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

const scaleDisplay = ref(1);

// Computed for grid dimensions and boundaries
const gridWidth = computed(() => {
    if (plotAreaConfig.value.width! + 100 < stageConfig.value.width!) {
        return stageConfig.value.width;
    }
    return plotAreaConfig.value.width! + plotAreaConfig.value.x! + 50;
});

const gridHeight = computed(() => {
    if (plotAreaConfig.value.height! + 100 < stageConfig.value.height!) {
        return stageConfig.value.height;
    }
    return plotAreaConfig.value.height! + plotAreaConfig.value.y! + 50;
});

const minX = computed(() => Math.min(0, stageConfig.value.width! - gridWidth.value * scaleDisplay.value));
const maxX = computed(() => 0);
const minY = computed(() => Math.min(0, stageConfig.value.height! - gridHeight.value * scaleDisplay.value));
const maxY = computed(() => 0);

const gridConfig = computed<Konva.GroupConfig>(() => {
    return {
        x: 0,
        y: 0,
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

const axisLabelsOffsetX = ref(0);
const axisLabelsOffsetY = ref(0);

// Scale related
const scales = [5, 4, 3, 2.5, 2, 1.5, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
let currentScaleIndex = 6;

function unScale(val: number) {
    return val / scaleDisplay.value;
}

// Methods
function handleGridDragEnd(e: Konva.KonvaEventObject<any>) {
    axisLabelsOffsetX.value = e.target.x();
    axisLabelsOffsetY.value = e.target.y();
    gridConfig.value.x = e.target.x();
    gridConfig.value.y = e.target.y();
    updateKey.value++;
}

function handleGridDragMove(e: Konva.KonvaEventObject<any>) {
    axisLabelsOffsetX.value = e.target.x();
    axisLabelsOffsetY.value = e.target.y();
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
    const mousePointTo = {
        x: (pointer.x - gridConfig.value.x!) / oldScale,
        y: (pointer.y - gridConfig.value.y!) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? 1 : -1;
    if (direction > 0) {
        currentScaleIndex = currentScaleIndex > 0 ? currentScaleIndex - 1 : currentScaleIndex;
    }
    else {
        currentScaleIndex = currentScaleIndex < scales.length - 1 ? currentScaleIndex + 1 : currentScaleIndex;
    }
    const newScale = scales[currentScaleIndex];
    gridConfig.value.x = pointer.x - mousePointTo.x * newScale;
    gridConfig.value.y = pointer.y - mousePointTo.y * newScale;
    axisLabelsOffsetX.value = gridConfig.value.x;
    axisLabelsOffsetY.value = gridConfig.value.y;
    scaleDisplay.value = newScale;
    updateKey.value++;
}

window.addEventListener('resize', resizeStage);

// Compute grid offset based on plot area
const gridOffset = computed(() => ({
    x: plotAreaConfig.value.x! % 100,
    y: plotAreaConfig.value.y! % 100,
}));

// Compute horizontal grid lines visible within grid-group boundaries
const horizontalGridLines = computed(() => {
    const lines = [];
    const offsetY = gridOffset.value.y;
    const groupHeight = gridConfig.value.height!;
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
    const groupWidth = gridConfig.value.width!;
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
                            @dragmove="handleGridDragMove"
                        >
                            <v-rect
                                name="grid-background"
                                :config="{
                                    x: 0,
                                    y: 0,
                                    width: gridConfig.width,
                                    height: gridConfig.height,
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
                                    points: [0, 0, gridConfig.width, 0],
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
                                    points: [0, 0, 0, gridConfig.height],
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
                        <v-group :config="{ x: axisLabelsOffsetX }">
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
                        <v-group :config="{ y: axisLabelsOffsetY }">
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
