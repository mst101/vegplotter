<script setup lang="ts">
import type Konva from 'konva';
import { computed, onMounted, ref } from 'vue';
import SidePanel from '@/Components/SidePanel.vue';
import type { Plot, VueKonvaRef } from '@/types';

const props = defineProps<{
    plots: Plot;
}>();

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
    return {
        x: 150,
        y: 150,
        width: props.plots.width * 100,
        height: props.plots.length * 100,
        fill: '#eee',
        stroke: 'black',
    };
});

const scaleDisplay = ref(1);

// Computed
const gridWidth = computed(() => {
    if (plotAreaConfig.value.width! + 200 < stageConfig.value.width!) {
        console.log(plotAreaConfig.value.width! + 200, stageConfig.value.width);
        return stageConfig.value.width;
    }
    return plotAreaConfig.value.width! + plotAreaConfig.value.x! + 100;
});

const gridHeight = computed(() => {
    if (plotAreaConfig.value.height! + 200 < stageConfig.value.height!) {
        return stageConfig.value.height;
    }
    return plotAreaConfig.value.height! + plotAreaConfig.value.y! + 100;
});

const minX = computed(() => {
    return Math.min(0, stageConfig.value.width! - (gridWidth.value! * scaleDisplay.value));
});
const maxX = computed(() => {
    return 0;
});
const minY = computed(() => {
    return Math.min(0, stageConfig.value.height! - (gridHeight.value! * scaleDisplay.value));
});
const maxY = computed(() => {
    return 0;
});

const gridConfig = computed<Konva.GroupConfig>(() => {
    // const minX = Math.min(0, stageConfig.value.width! - gridWidth.value * scaleDisplay.value);
    // const maxX = Math.max(0, stageConfig.value.width! - gridWidth.value * scaleDisplay.value);
    // const minY = Math.min(0, stageConfig.value.height! - gridHeight.value * scaleDisplay.value);
    // const maxY = Math.max(0, stageConfig.value.height! - gridHeight.value * scaleDisplay.value);

    // const minX = Math.min(0, stageConfig.value.width! - gridWidth.value);
    // const maxX = 0;
    // const minY = Math.min(0, stageConfig.value.height! - gridHeight.value);
    // const maxY = 0;

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
            console.log(newY);
            return { x: newX, y: newY };
        },
    };
});

// Axis ticks computed properties
const xAxisTicks = computed(() => {
    const ticks = [];
    const plotStartX = plotAreaConfig.value.x!;
    const plotWidth = plotAreaConfig.value.width!;

    const numTicks = Math.ceil(plotWidth / 100) + 1;

    for (let i = 0; i < numTicks; i++) {
        ticks.push({
            x: plotStartX + (i * 100),
            text: `${i}m`,
        });
    }

    return ticks;
});

const yAxisTicks = computed(() => {
    const ticks = [];
    const plotStartY = plotAreaConfig.value.y!;
    const plotHeight = plotAreaConfig.value.height!;

    const numTicks = Math.ceil(plotHeight / 100) + 1;

    for (let i = 0; i < numTicks; i++) {
        ticks.push({
            y: plotStartY + (i * 100),
            text: `${i}m`,
        });
    }

    return ticks;
});

const axisLabelsOffsetX = ref(0);
const axisLabelsOffsetY = ref(0);

// scale related
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

    //     console.log(e.target.x(), e.target.y());
//     // e.target.y(Math.max(e.target.y(), 50));
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

onMounted(() => {
    // if (grid.value) {
    //     grid.value.cache();
    //     background.value?.batchDraw();
    // }
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
                <v-stage
                    ref="stage"
                    :key="updateKey"
                    :config="stageConfig"
                    @wheel="handleWheel"
                >
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
                            <v-rect
                                name="plot-area"
                                :config="plotAreaConfig"
                            />
                            <v-line
                                v-for="n in Math.floor(gridConfig.height! / 10)"
                                :key="n"
                                name="gridLines-h"
                                :config="{
                                    x: 0,
                                    y: n * 10,
                                    points: [0, 0, gridConfig.width, 0],
                                    stroke: 'gray',
                                    strokeWidth: (n) % 10 === 0 ? 1 : .5,
                                }"
                            />
                            <v-line
                                v-for="n in Math.floor(gridConfig.width! / 10)"
                                :key="n"
                                name="gridLines-v"
                                :config="{
                                    x: n * 10,
                                    y: 0,
                                    points: [0, 0, 0, gridConfig.height],
                                    stroke: 'gray',
                                    strokeWidth: (n) % 10 === 0 ? 1 : .5,
                                }"
                            />
                        </v-group>
                    </v-layer>

                    <!-- New axes layer that stays fixed -->
                    <v-layer ref="axesLayer" name="axes">
                        <!-- X-axis at the top -->
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

                        <!-- Y-axis at the left -->
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
                        <v-group
                            :config="{ x: axisLabelsOffsetX }"
                        >
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
