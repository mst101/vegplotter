<script setup lang="ts">
import type Konva from 'konva';
import { computed, ref, watch } from 'vue';
import SidePanel from '@/Components/SidePanel.vue';
import type { Plot, PlotConfig, Position, VueKonvaRef } from '@/types';

const props = defineProps<{
    plots: Plot;
    plotConfig?: PlotConfig;
}>();

// Constants
const SCROLLBAR_SIZE = props.plotConfig?.SCROLLBAR_SIZE || 12;
const UNIT_PIXELS = props.plotConfig?.UNIT_PIXELS || 100;
const SIDEPANEL_WIDTH = props.plotConfig?.SIDEPANEL_WIDTH || 220;
const VERTICAL_OFFSET = props.plotConfig?.VERTICAL_OFFSET || 116;
const PADDING_PIXELS = props.plotConfig?.PADDING_PIXELS || 50;
window.innerWidth = 1024;
window.innerHeight = 768;

// Setup reactive state
const updateKey = ref(0);
const stage = ref<VueKonvaRef<Konva.Stage> | null>(null);
const background = ref<VueKonvaRef<Konva.Layer> | null>(null);
const grid = ref<VueKonvaRef<Konva.Group> | null>(null);
const axesLayer = ref<VueKonvaRef<Konva.Layer> | null>(null);
const scaleDisplay = ref(1);
const stageConfig = ref<Konva.StageConfig>({
    width: window.innerWidth - SIDEPANEL_WIDTH,
    height: window.innerHeight - VERTICAL_OFFSET,
});
const gridX = ref(0);
const gridY = ref(0);
const isCtrlPressed = ref(false);
const verticalScrollbar = ref<VueKonvaRef<Konva.Rect> | null>(null);
const horizontalScrollbar = ref<VueKonvaRef<Konva.Rect> | null>(null);

// Computed properties
const fitsOnStageX = computed(() => {
    const stageWidth = unScale(stageConfig.value.width!); // - SCROLLBAR_SIZE;
    const plotWidth = props.plots.width * UNIT_PIXELS;
    return plotWidth <= stageWidth;
});

const fitsOnStageY = computed(() => {
    const stageHeight = unScale(stageConfig.value.height!); // - SCROLLBAR_SIZE;
    const plotHeight = props.plots.length * UNIT_PIXELS;
    return plotHeight <= stageHeight;
});

const paddingX = computed(() => {
    const stageSize = unScale(stageConfig.value.width!);
    const plotWidth = props.plots.width * UNIT_PIXELS;

    if (fitsOnStageX.value) {
        const padding = (stageSize - plotWidth) / 2;

        if (scaleDisplay.value > 1) {
            if (padding < PADDING_PIXELS) {
                return padding;
            }
            return Math.max(PADDING_PIXELS, padding);
        }
        else {
            return padding;
        }
    }

    return PADDING_PIXELS;
});

const paddingY = computed(() => {
    const stageSize = unScale(stageConfig.value.height!);
    const plotSize = props.plots.length * UNIT_PIXELS;

    if (fitsOnStageY.value) {
        const padding = (stageSize - plotSize) / 2;

        if (scaleDisplay.value > 1) {
            if (padding < PADDING_PIXELS) {
                return padding;
            }
            return Math.max(PADDING_PIXELS, padding);
        }
        else {
            return padding;
        }
    }

    return PADDING_PIXELS;
});

const plotArea = computed<Konva.GroupConfig>(() => {
    return {
        x: paddingX.value,
        y: paddingY.value,
        width: props.plots.width * UNIT_PIXELS,
        height: props.plots.length * UNIT_PIXELS,
        fill: '#eee',
        stroke: 'black',
    };
});

const gridWidth = computed(() => {
    const stageWidth = stageConfig.value.width!;
    const plotWidth = plotArea.value.width!;
    const totalWidth = plotWidth + paddingX.value * 2;

    return fitsOnStageX.value
        ? Math.max(totalWidth, unScale(stageWidth))
        : totalWidth;
});

const gridHeight = computed(() => {
    const stageHeight = stageConfig.value.height!;
    const plotHeight = plotArea.value.height!;
    const totalHeight = plotHeight + paddingY.value * 2;

    return fitsOnStageY.value
        ? Math.max(totalHeight, unScale(stageHeight))
        : totalHeight;
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

const isVerticalScrollbarVisible = computed(() => {
    return Math.floor(gridHeight.value! * scaleDisplay.value) > stageConfig.value.height!;
});
const verticalScrollbarHeight = computed(() => {
    if (!isVerticalScrollbarVisible.value)
        return 0;
    return Math.max(20, (stageConfig.value.height! / (gridHeight.value! * scaleDisplay.value)) * stageConfig.value.height!);
});

const isHorizontalScrollbarVisible = computed(() => {
    return Math.floor(gridWidth.value! * scaleDisplay.value) > stageConfig.value.width!;
});
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
    const plotStartX = plotArea.value.x! * scaleDisplay.value;
    const plotWidth = plotArea.value.width!;
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
    const plotStartY = plotArea.value.y! * scaleDisplay.value;
    const plotHeight = plotArea.value.height!;
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

    if (!pointer) {
        return;
    }

    // Calculate mouse position relative to the stage
    const mousePointToStage = {
        x: pointer.x - stage.value!.getNode().x(),
        y: pointer.y - stage.value!.getNode().y(),
    };

    // Calculate mouse position relative to the grid BEFORE the scale change
    const mousePointToGridBeforeScale = {
        x: (mousePointToStage.x - gridX.value) / oldScale,
        y: (mousePointToStage.y - gridY.value) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;

    if (direction < 0 && fitsOnStageX.value && fitsOnStageY.value) {
        return;
    }

    currentScaleIndex = direction > 0
        ? Math.max(0, currentScaleIndex - 1)
        : Math.min(scales.length - 1, currentScaleIndex + 1);

    const newScale = scales[currentScaleIndex];
    scaleDisplay.value = newScale;

    // Calculate the new grid position so that the mouse point stays in the same position relative to the stage
    gridX.value = mousePointToStage.x - mousePointToGridBeforeScale.x * newScale;
    gridY.value = mousePointToStage.y - mousePointToGridBeforeScale.y * newScale;

    // Adjust the grid position to stay within boundaries
    const adjustedMinX = Math.min(0, stageConfig.value.width! - gridWidth.value! * newScale);
    const adjustedMinY = Math.min(0, stageConfig.value.height! - gridHeight.value! * newScale);

    gridX.value = Math.max(adjustedMinX, Math.min(0, gridX.value));
    gridY.value = Math.max(adjustedMinY, Math.min(0, gridY.value));
}

function scrollVertically(e: Konva.KonvaEventObject<WheelEvent>) {
    const scrollAmount = -e.evt.deltaY;

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

    // Center if plot is smaller than stage, otherwise align to top
    gridY.value = isVerticalScrollbarVisible.value
        ? Math.max(minY.value, 0)
        : 0;
}

// // Compute horizontal grid lines visible within grid-group boundaries
// const horizontalGridLines = computed(() => {
//     const lines = [];
//     const offsetY = plotArea.value.y! % UNIT_PIXELS;
//     const groupHeight = scaledHeight.value!;
//     const start = Math.ceil((UNIT_PIXELS - offsetY) / 10);
//     const end = Math.floor((groupHeight + UNIT_PIXELS - offsetY) / 10);
//
//     for (let n = start; n <= end; n++) {
//         const y = -UNIT_PIXELS + n * 10 + offsetY;
//         if (y >= 0 && y <= groupHeight) {
//             lines.push({ index: n, y, strokeWidth: n % 10 === 0 ? 1 : 0.5 });
//         }
//     }
//     return lines;
// });
//
// // Compute vertical grid lines visible within grid-group boundaries
// const verticalGridLines = computed(() => {
//     const lines = [];
//     const offsetX = plotArea.value.x! % UNIT_PIXELS;
//     const groupWidth = scaledWidth.value!;
//     const start = Math.ceil((UNIT_PIXELS - offsetX) / 10);
//     const end = Math.floor((groupWidth + UNIT_PIXELS - offsetX) / 10);
//
//     for (let n = start; n <= end; n++) {
//         const x = -UNIT_PIXELS + n * 10 + offsetX;
//         if (x >= 0 && x <= groupWidth) {
//             lines.push({ index: n, x, strokeWidth: n % 10 === 0 ? 1 : 0.5 });
//         }
//     }
//     return lines;
// });

// Combine Horizontal Grid Lines into a Single Path
const horizontalGridPath = computed(() => {
    let path = '';
    const plotStartY = plotArea.value.y! * scaleDisplay.value;
    const plotHeight = plotArea.value.height! * scaleDisplay.value;
    const numLines = Math.ceil(plotHeight / UNIT_PIXELS) + 1;
    const offsetY = plotStartY % UNIT_PIXELS;
    console.log(plotStartY, plotHeight, numLines, offsetY);

    for (let i = 0; i < numLines; i++) {
        const y = plotStartY + i * UNIT_PIXELS - offsetY;
        if (y >= 0 && y <= gridHeight.value) {
            path += `M 0 ${y} L ${gridWidth.value} ${y} `;
        }
    }

    return {
        data: path,
        stroke: 'gray',
        strokeWidth: 0.5,
    };
});

// Combine Vertical Grid Lines into a Single Path
const verticalGridPath = computed(() => {
    let path = '';
    const plotStartX = plotArea.value.x! * scaleDisplay.value;
    const plotWidth = plotArea.value.width! * scaleDisplay.value;
    const numLines = Math.ceil(plotWidth / UNIT_PIXELS) + 1;
    const offsetX = plotStartX % UNIT_PIXELS;

    for (let i = 0; i < numLines; i++) {
        const x = plotStartX + i * UNIT_PIXELS - offsetX;
        if (x >= 0 && x <= gridWidth.value) {
            path += `M ${x} 0 L ${x} ${gridHeight.value} `;
        }
    }

    return {
        data: path,
        stroke: 'gray',
        strokeWidth: 0.5,
        visible: false,
    };
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

// onMounted(() => {
//     grid.value!.getNode().cache();
// });

// Scrollbar related
function handleVerticalScrollDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    const scrollbarY = e.target.y();
    const scrollbarTrackHeight = stageConfig.value.height! - verticalScrollbarHeight.value;
    const scrollRatio = scrollbarY / scrollbarTrackHeight;

    const maxScrollTop = gridHeight.value * scaleDisplay.value - stageConfig.value.height!;
    const newScrollTop = scrollRatio * maxScrollTop;

    gridY.value = -newScrollTop;
}

function handleHorizontalScrollDragMove(e: Konva.KonvaEventObject<DragEvent>) {
    // debounce(horizontalScrollDrag(e), 100);
    const scrollbarX = e.target.x();
    const scrollbarTrackWidth = stageConfig.value.width! - horizontalScrollbarWidth.value;
    const scrollRatio = scrollbarX / scrollbarTrackWidth;

    const maxScrollLeft = gridWidth.value * scaleDisplay.value - stageConfig.value.width!;
    const newScrollLeft = scrollRatio * maxScrollLeft;

    gridX.value = -newScrollLeft;
}
</script>

<template>
    <div>
        <p class="h-[50px] space-x-2 bg-gray-300 p-2 text-xs">
            <span>Scale: {{ scaleDisplay }}</span>
            <span>stage: {{ `(${stageConfig.width}, ${stageConfig.height})` }}</span>
            <span>fitsOnStageX: {{ `(${fitsOnStageX}, ${fitsOnStageY})` }}</span>
            <span>padding: {{ `(${paddingX.toFixed(0)}, ${paddingY.toFixed(0)})` }}</span>
            <span>min: {{ `(${minX.toFixed(0)}, ${minY.toFixed(0)})` }}</span>
            <span>gridWidth: {{ `(${gridWidth!.toFixed(0)}, ${gridHeight!.toFixed(0)})` }}</span>
            <span>gridConfigXY: {{ `(${gridX!.toFixed(0)}, ${gridY!.toFixed(0)})` }}</span>
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
                            <v-rect name="plot-area" :config="plotArea" />

                            <!-- Combined Horizontal Grid Lines -->
                            <v-path
                                :config="horizontalGridPath"
                            />

                            <!-- Combined Vertical Grid Lines -->
                            <v-path
                                :config="verticalGridPath"
                            />

                            <!--                            &lt;!&ndash; Horizontal grid lines &ndash;&gt; -->
                            <!--                            <v-line -->
                            <!--                                v-for="line in horizontalGridLines" -->
                            <!--                                :key="`h-${line.index}`" -->
                            <!--                                name="gridLines-h" -->
                            <!--                                :config="{ -->
                            <!--                                    x: 0, -->
                            <!--                                    y: line.y, -->
                            <!--                                    points: [0, 0, scaledWidth, 0], -->
                            <!--                                    stroke: 'gray', -->
                            <!--                                    strokeWidth: line.strokeWidth, -->
                            <!--                                }" -->
                            <!--                            /> -->

                            <!--                            &lt;!&ndash; Vertical grid lines &ndash;&gt; -->
                            <!--                            <v-line -->
                            <!--                                v-for="line in verticalGridLines" -->
                            <!--                                :key="`v-${line.index}`" -->
                            <!--                                name="gridLines-v" -->
                            <!--                                :config="{ -->
                            <!--                                    x: line.x, -->
                            <!--                                    y: 0, -->
                            <!--                                    points: [0, 0, 0, scaledHeight], -->
                            <!--                                    stroke: 'gray', -->
                            <!--                                    strokeWidth: line.strokeWidth, -->
                            <!--                                }" -->
                            <!--                            /> -->
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
