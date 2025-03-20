<script setup lang="ts">
import type Konva from 'konva';
import { computed, onMounted, ref } from 'vue';

interface VueKonvaRef<T> {
    getNode: () => T;
    // Add other Vue Konva methods as needed
}

// Setup reactive state
const updateKey = ref(0);
const stage = ref<Konva.Stage | null>(null);
const background = ref<VueKonvaRef<Konva.Layer> | null>(null);
const grid = ref<VueKonvaRef<Konva.Group> | null>(null);
const axesLayer = ref<Konva.Layer | null>(null);

const stageConfig = ref<Konva.ContainerConfig>({
    width: window.innerWidth,
    height: window.innerHeight - 66,
});

const plotAreaConfig = ref<Konva.GroupConfig>({
    x: 100,
    y: 100,
    width: 1000,
    height: 1000,
    fill: '#eee',
    stroke: 'black',
});

// Computed
const gridWidth = computed(() => {
    if (plotAreaConfig.value.width! < stageConfig.value.width!) {
        return stageConfig.value.width!;
    }
    return plotAreaConfig.value.width! + plotAreaConfig.value.x! + 100;
});

const gridHeight = computed(() => {
    if (plotAreaConfig.value.height! < stageConfig.value.height!) {
        return stageConfig.value.height!;
    }
    return plotAreaConfig.value.height! + plotAreaConfig.value.y! + 100;
});

const gridConfig = computed<Konva.GroupConfig>(() => {
    const minX = Math.min(0, stageConfig.value.width! - gridWidth.value);
    const maxX = 0;
    const minY = Math.min(0, stageConfig.value.height! - gridHeight.value);
    const maxY = 0;

    return {
        x: 0,
        y: 0,
        width: gridWidth.value,
        height: gridHeight.value,
        scaleX: 1,
        scaleY: 1,
        draggable: true,
        dragBoundFunc: (pos: { x: number; y: number }) => {
            const newX = Math.max(minX, Math.min(maxX, pos.x));
            const newY = Math.max(minY, Math.min(maxY, pos.y));
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

// Methods
function handleGridDragEnd(e: Konva.KonvaEventObject<any>) {
    axisLabelsOffsetX.value = e.target.x();
    axisLabelsOffsetY.value = e.target.y();
    gridConfig.value.x = e.target.x();
    gridConfig.value.y = e.target.y();
}

function handleGridDragMove(e: Konva.KonvaEventObject<any>) {
    axisLabelsOffsetX.value = e.target.x();
    axisLabelsOffsetY.value = e.target.y();
}

function resizeStage() {
    stageConfig.value.width = window.innerWidth;
    stageConfig.value.height = window.innerHeight;
}

window.addEventListener('resize', resizeStage);

onMounted(() => {
    if (grid.value) {
        grid.value.cache();
        background.value?.batchDraw();
    }
});
</script>

<template>
    <div class="space-x-2">
        <v-stage
            ref="stage"
            :key="updateKey"
            :config="stageConfig"
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
                            fill: '#fbb',
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
</template>
