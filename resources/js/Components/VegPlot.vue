<script setup lang="ts">
import type Konva from 'konva';
import { computed, ref, watch } from 'vue';
import SidePanel from '@/Components/SidePanel.vue';
import type { Plot, Position, VueKonvaRef } from '@/types';

const props = defineProps<{ plots: Plot }>();

// Constants
const SCROLLBAR_SIZE = 12;
const UNIT_PIXELS = 100;
const SIDEPANEL_WIDTH = 220;
const VERTICAL_OFFSET = 116;
const PADDING_PIXELS = 50;

// Setup reactive state
const updateKey = ref(0);
const stage = ref<VueKonvaRef<Konva.Stage> | null>(null);
const background = ref<VueKonvaRef<Konva.Layer> | null>(null);
const grid = ref<VueKonvaRef<Konva.Group> | null>(null);
const axesLayer = ref<VueKonvaRef<Konva.Layer> | null>(null);
const scaleDisplay = ref(0.5);
const stageConfig = ref<Konva.StageConfig>({
    width: window.innerWidth - SIDEPANEL_WIDTH,
    height: window.innerHeight - VERTICAL_OFFSET,
});
const gridX = ref(0);
const gridY = ref(0);
const isCtrlPressed = ref(false);

// Scrollbar refs
const verticalScrollbar = ref<VueKonvaRef<Konva.Rect> | null>(null);
const horizontalScrollbar = ref<VueKonvaRef<Konva.Rect> | null>(null);

const paddingX = computed(() => {
    // calculatePadding(stageConfig.value.width!, props.plots.width * UNIT_PIXELS, PADDING_PIXELS),
    const stageSize = stageConfig.value.width!;
    const plotSize = props.plots.width * UNIT_PIXELS;
    const defaultPadding = PADDING_PIXELS;
    const scaledPlotSize = plotSize * scaleDisplay.value;
    // console.log(stageSize, scaledPlotSize, defaultPadding);

    if (scaledPlotSize < stageSize) {
        const padding = unScale((stageSize - scaledPlotSize) / 2);
        // console.log('padding', padding);

        if (padding < defaultPadding) {
            return padding;
        }
        return Math.min(defaultPadding, padding);
    }

    return defaultPadding;
});

const paddingY = computed(() => {
    // calculatePadding(stageConfig.value.height!, props.plots.length * UNIT_PIXELS, PADDING_PIXELS),

    const stageSize = unScale(stageConfig.value.height!);
    const plotSize = props.plots.length * UNIT_PIXELS;
    const defaultPadding = PADDING_PIXELS;
    console.log(stageSize, plotSize, defaultPadding);

    if (plotSize < stageSize) {
        const padding = unScale((stageSize - plotSize) / 2);
        console.log('padding', padding);

        if (padding < defaultPadding) {
            return padding;
        }
        return Math.min(defaultPadding, padding);
    }

    return defaultPadding;
});

const plotAreaConfig = computed<Konva.GroupConfig>(() => {
    let x = paddingX.value;
    let y = paddingY.value;
    // const plotWidthScaled = props.plots.width * UNIT_PIXELS * scaleDisplay.value;
    // const plotHeightScaled = props.plots.length * UNIT_PIXELS * scaleDisplay.value;
    //
    // // if (stageConfig.value.width! > props.plots.width * UNIT_PIXELS) {
    // //     x = (stageConfig.value.width! - props.plots.width * UNIT_PIXELS) / 2;
    // // }
    // // if (stageConfig.value.height! > props.plots.length * UNIT_PIXELS) {
    // //     y = (stageConfig.value.height! - props.plots.length * UNIT_PIXELS) / 2;
    // // }
    //
    // if (plotWidthScaled < stageConfig.value.width!) {
    //     x = (stageConfig.value.width! - plotWidthScaled) / 2 / scaleDisplay.value;
    // }
    // if (plotHeightScaled < stageConfig.value.height!) {
    //     y = (stageConfig.value.height! - plotHeightScaled) / 2 / scaleDisplay.value;
    // }

    const plotWidth = props.plots.width * UNIT_PIXELS;
    const totalWidth = plotWidth + paddingX.value * 2;
    const fitsOnStageX = totalWidth <= stageConfig.value.width!;

    if (fitsOnStageX) {
        x = (stageConfig.value.width! - plotWidth) / 2;
    }

    x = 400;
    const plotHeight = props.plots.length * UNIT_PIXELS;
    const totalHeight = plotHeight + paddingY.value * 2;
    const fitsOnStageY = totalHeight <= stageConfig.value.height!;

    console.log(fitsOnStageY, plotHeight, stageConfig.value.height!);
    if (fitsOnStageY) {
        y = (stageConfig.value.height! - plotHeight) / 2;
        console.log(unScale(y));
    }
    y = 300;

    return {
        x,
        y,
        width: props.plots.width * UNIT_PIXELS,
        height: props.plots.length * UNIT_PIXELS,
        fill: '#eee',
        stroke: 'black',
    };
});

// Computed
const gridWidth = computed(() => {
    const plotWidth = props.plots.width * UNIT_PIXELS;
    const totalWidth = plotWidth + paddingX.value * 2;
    const fitsOnStage = totalWidth <= stageConfig.value.width!;
    // console.log(fitsOnStage, plotWidth, totalWidth);
    return fitsOnStage
        ? Math.max(totalWidth, unScale(stageConfig.value.width!))
        : unScale(totalWidth);
});

const gridHeight = computed(() => {
    const plotHeight = props.plots.length * UNIT_PIXELS;
    const totalHeight = plotHeight + paddingY.value * 2;
    const fitsOnStage = totalHeight <= stageConfig.value.height!;
    console.log('=>', fitsOnStage, totalHeight, plotHeight);
    return fitsOnStage
        ? Math.max(totalHeight, unScale(stageConfig.value.height!))
        : unScale(totalHeight);
});

const minX = computed(() => Math.min(0, stageConfig.value.width! - gridWidth.value! * scaleDisplay.value));
const minY = computed(() => Math.min(0, stageConfig.value.height! - gridHeight.value! * scaleDisplay.value));

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
            const newX = Math.max(minX.value, Math.min(0, pos.x));
            const newY = Math.max(minY.value, Math.min(0, pos.y));
            return { x: newX, y: newY };
        },
    };
});

const isVerticalScrollbarVisible = computed(() => gridHeight.value! * scaleDisplay.value > stageConfig.value.height!);
const verticalScrollbarHeight = computed(() => {
    if (!isVerticalScrollbarVisible.value)
        return 0;
    return Math.max(20, (stageConfig.value.height! / (gridHeight.value! * scaleDisplay.value)) * stageConfig.value.height!);
});

const isHorizontalScrollbarVisible = computed(() => gridWidth.value! * scaleDisplay.value > stageConfig.value.width!);
const horizontalScrollbarWidth = computed(() => {
    if (!isHorizontalScrollbarVisible.value)
        return 0;
    return Math.max(20, (stageConfig.value.width! / (gridWidth.value! * scaleDisplay.value)) * stageConfig.value.width!);
});

const verticalScrollbarY = computed(() => {
    if (!isVerticalScrollbarVisible.value)
        return 0;

    const scrollTop = -gridY.value;
    const maxScrollTop = gridHeight.value! * scaleDisplay.value - stageConfig.value.height!;
    const scrollbarY = (scrollTop / maxScrollTop) * (stageConfig.value.height! - verticalScrollbarHeight.value);
    return Math.max(0, Math.min(stageConfig.value.height! - verticalScrollbarHeight.value, scrollbarY));
});

const horizontalScrollbarX = computed(() => {
    if (!isHorizontalScrollbarVisible.value)
        return 0;

    const scrollLeft = -gridX.value;
    const maxScrollLeft = gridWidth.value! * scaleDisplay.value - stageConfig.value.width!;
    const scrollbarX = (scrollLeft / maxScrollLeft) * (stageConfig.value.width! - horizontalScrollbarWidth.value);
    return Math.max(0, Math.min(stageConfig.value.width! - horizontalScrollbarWidth.value, scrollbarX));
});

// Axis ticks computed
const xAxisTicks = computed(() => {
    const ticks = [];
    const plotStartX = plotAreaConfig.value.x! * scaleDisplay.value;
    const plotWidth = plotAreaConfig.value.width!;
    const numTicks = Math.ceil(plotWidth / UNIT_PIXELS) + 1;
    for (let i = 0; i < numTicks; i++) {
        ticks.push({
            x: plotStartX + i * UNIT_PIXELS * scaleDisplay.value,
            text: `${i}m`,
        });
    }
    return ticks;
});

const yAxisTicks = computed(() => {
    const ticks = [];
    const plotStartY = plotAreaConfig.value.y! * scaleDisplay.value;
    const plotHeight = plotAreaConfig.value.height!;
    const numTicks = Math.ceil(plotHeight / UNIT_PIXELS) + 1;
    for (let i = 0; i < numTicks; i++) {
        ticks.push({
            y: plotStartY + i * UNIT_PIXELS * scaleDisplay.value,
            text: `${i}m`,
        });
    }
    return ticks;
});

// Scale related
const scales = [5, 4, 3, 2.5, 2, 1.5, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05];
let currentScaleIndex = 6;

// Methods
// function calculatePadding(stageSize: number, plotSize: number) {
//     const padding = (stageSize - (plotSize * UNIT_PIXELS)) / 2;
//     console.log(stageSize, plotSize, padding);
//     return 50;
//     if (padding < -PADDING_PIXELS)
//         return Math.min(PADDING_PIXELS, Math.abs(padding));
//     if (padding < 0)
//         return Math.max(PADDING_PIXELS, Math.abs(padding));
//     return padding;
// }

// function calculatePadding(stageSize: number, plotSize: number, defaultPadding: number) {
//     const scaledPlotSize = plotSize * scaleDisplay.value;
//     // console.log(stageSize, scaledPlotSize, defaultPadding);
//
//     if (scaledPlotSize < stageSize) {
//         const padding = unScale((stageSize - scaledPlotSize) / 2);
//         console.log('padding', padding);
//
//         if (padding < defaultPadding) {
//             return padding;
//         }
//         return Math.min(defaultPadding, padding);
//     }
//
//     return defaultPadding;
// }

function unScale(val: number) {
    return val / scaleDisplay.value;
}

function handleGridDragMove(e: Konva.KonvaEventObject<any>) {
    gridX.value = e.target.x();
    gridY.value = e.target.y();
}

function resizeStage() {
    stageConfig.value.width = window.innerWidth - SIDEPANEL_WIDTH;
    stageConfig.value.height = window.innerHeight - VERTICAL_OFFSET;
}

function zoom(e: Konva.KonvaEventObject<WheelEvent>) {
    const oldScale = scaleDisplay.value;
    const pointer = stage.value!.getNode().getPointerPosition();
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

    const adjustedMinX = Math.min(0, stageConfig.value.width! - gridWidth.value! * newScale);
    const adjustedMinY = Math.min(0, stageConfig.value.height! - gridHeight.value! * newScale);

    // Set the grid position
    gridX.value = Math.max(adjustedMinX, Math.min(0, newX));
    gridY.value = Math.max(adjustedMinY, Math.min(0, newY));

    // Special case when zooming in to a scaleDisplay of 1
    if (newScale === 1) {
        const isWithinStageWidth = plotAreaConfig.value.width! + (paddingX.value * 2) <= stageConfig.value.width!;
        const isWithinStageHeight = plotAreaConfig.value.height! + (paddingY.value * 2) <= stageConfig.value.height!;

        if (isWithinStageWidth) {
            gridX.value = 0;
        }
        if (isWithinStageHeight) {
            gridY.value = 0;
        }
    }

    scaleDisplay.value = newScale;
}

function scrollVertically(e: Konva.KonvaEventObject<WheelEvent>) {
    const scrollAmount = e.evt.deltaY;

    if (isVerticalScrollbarVisible.value) {
        const newY = gridY.value + scrollAmount;
        gridY.value = Math.max(minY.value, Math.min(0, newY));
    }
    else if (isHorizontalScrollbarVisible.value) {
        const newX = gridX.value + scrollAmount;
        gridX.value = Math.max(minX.value, Math.min(0, newX));
    }
}

function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();

    if (isCtrlPressed.value) {
        zoom(e);
        return;
    }

    if (isVerticalScrollbarVisible.value) {
        scrollVertically(e);
    }
}

window.addEventListener('resize', resizeStage);
window.addEventListener('keydown', (e) => {
    if (e.key === 'Control') {
        isCtrlPressed.value = true;
    }
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'Control') {
        isCtrlPressed.value = false;
    }
});

// Compute grid offset based on plot area
const gridOffset = computed(() => ({
    x: plotAreaConfig.value.x! % UNIT_PIXELS,
    y: plotAreaConfig.value.y! % UNIT_PIXELS,
}));

const scaledWidth = computed(() => {
    return scaleDisplay.value >= 1 ? gridWidth.value : unScale(gridWidth.value!);
});
const scaledHeight = computed(() => {
    return scaleDisplay.value >= 1 ? gridHeight.value : unScale(gridHeight.value!);
});

function updateGridPosition() {
    // Center if plot is smaller than stage, otherwise align left
    gridX.value = isHorizontalScrollbarVisible.value
        ? Math.max(minX.value, 0)
        : 0;
    // gridX.value = 0;

    // Center if plot is smaller than stage, otherwise align to top
    gridY.value = isVerticalScrollbarVisible.value
        ? Math.max(minY.value, 0)
        : 0;
}

// Compute horizontal grid lines visible within grid-group boundaries
const horizontalGridLines = computed(() => {
    const lines = [];
    const offsetY = gridOffset.value.y;
    const groupHeight = scaledHeight.value!;
    const start = Math.ceil((UNIT_PIXELS - offsetY) / 10);
    const end = Math.floor((groupHeight + UNIT_PIXELS - offsetY) / 10);
    for (let n = start; n <= end; n++) {
        const y = -UNIT_PIXELS + n * 10 + offsetY;
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
    const start = Math.ceil((UNIT_PIXELS - offsetX) / 10);
    const end = Math.floor((groupWidth + UNIT_PIXELS - offsetX) / 10);
    for (let n = start; n <= end; n++) {
        const x = -UNIT_PIXELS + n * 10 + offsetX;
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

// Scrollbar related
function handleVerticalScrollDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    const scrollbarY = e.target.y();
    const scrollRatio = scrollbarY / (stageConfig.value.height! - verticalScrollbarHeight.value);
    const maxScrollTop = gridHeight.value! * scaleDisplay.value - stageConfig.value.height!;
    const newScrollTop = scrollRatio * maxScrollTop;

    gridY.value = -newScrollTop / scaleDisplay.value;
}

function handleHorizontalScrollDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    const scrollbarX = e.target.x();
    const scrollRatio = scrollbarX / (stageConfig.value.width! - horizontalScrollbarWidth.value);
    const maxScrollLeft = gridWidth.value! * scaleDisplay.value - stageConfig.value.width!;
    const newScrollLeft = scrollRatio * maxScrollLeft;

    gridX.value = -newScrollLeft / scaleDisplay.value;
}
</script>

<template>
    <div>
        <p class="h-[50px] space-x-2 bg-gray-300 p-2 text-xs">
            <span>Scale: {{ scaleDisplay }}</span>
            <span>stage: {{ `(${stageConfig.width}, ${stageConfig.height})` }}</span>
            <span>padding: {{ `(${paddingX}, ${paddingY})` }}</span>
            <span>plotAreaWidth: {{ `(${plotAreaConfig.width!.toFixed(0)}, ${plotAreaConfig.height!.toFixed(0)})` }}</span>
            <span>plotAreaXY: {{ `(${plotAreaConfig.x!.toFixed(0)}, ${plotAreaConfig.y!.toFixed(0)})` }}</span>
            <span>gridWidth: {{ `(${gridWidth!.toFixed(0)}, ${gridHeight!.toFixed(0)})` }}</span>
            <span>gridConfigXY: {{ `(${gridConfig.x!.toFixed(0)}, ${gridConfig.y!.toFixed(0)})` }}</span>
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
                            @dragmove="handleGridDragMove"
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

                    <!-- Vertical Scrollbar -->
                    <v-layer :visible="isVerticalScrollbarVisible" name="verticalScrollbarLayer">
                        <v-rect
                            :config="{
                                x: stageConfig.width! - SCROLLBAR_SIZE - 2,
                                y: 0,
                                width: SCROLLBAR_SIZE + 2,
                                height: stageConfig.height,
                                fill: '#eee',
                            }"
                        />
                        <v-rect
                            ref="verticalScrollbar"
                            :config="{
                                x: stageConfig.width! - SCROLLBAR_SIZE,
                                y: verticalScrollbarY,
                                width: SCROLLBAR_SIZE,
                                height: verticalScrollbarHeight,
                                fill: '#aaa',
                                draggable: true,
                                dragBoundFunc: (pos: Position) => {
                                    return {
                                        x: stageConfig.width! - SCROLLBAR_SIZE,
                                        y: Math.max(0, Math.min(stageConfig.height! - verticalScrollbarHeight, pos.y)),
                                    };
                                },
                                stroke: '#999',
                                strokeWidth: 1,
                            }"
                            @dragmove="handleVerticalScrollDragMove"
                        />
                    </v-layer>

                    <!-- Horizontal Scrollbar -->
                    <v-layer :visible="isHorizontalScrollbarVisible" name="horizontalScrollbarLayer">
                        <v-rect
                            :config="{
                                x: 0,
                                y: stageConfig.height! - SCROLLBAR_SIZE - 2,
                                width: stageConfig.width,
                                height: SCROLLBAR_SIZE + 2,
                                fill: '#eee',
                            }"
                        />
                        <v-rect
                            ref="horizontalScrollbar"
                            :config="{
                                x: horizontalScrollbarX,
                                y: stageConfig.height! - SCROLLBAR_SIZE,
                                width: horizontalScrollbarWidth,
                                height: SCROLLBAR_SIZE,
                                fill: '#aaa',
                                draggable: true,
                                dragBoundFunc: (pos: Position) => {
                                    return {
                                        x: Math.max(0, Math.min(stageConfig.width! - horizontalScrollbarWidth, pos.x)),
                                        y: stageConfig.height! - SCROLLBAR_SIZE,
                                    };
                                },
                                stroke: '#999',
                                strokeWidth: 1,
                            }"
                            @dragmove="handleHorizontalScrollDragMove"
                        />
                    </v-layer>
                </v-stage>
            </div>
            <div class="w-full">
                <SidePanel />
            </div>
        </div>
    </div>
</template>
