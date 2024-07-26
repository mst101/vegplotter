<script setup lang="ts">
import Konva from 'konva';
import { ref } from 'vue';

const stage = ref<Konva.Stage>();
const background = ref<Konva.Layer>();
const axes = ref<Konva.Layer>();
const margin = {
    left: 30,
    top: 60,
    right: 10,
    bottom: 10,
};

const stageConfig = ref<Konva.ContainerConfig>({
    width: window.innerWidth,
    height: window.innerHeight - margin.top - 5,
});

const plotAreaConfig = ref<Konva.GroupConfig>({
    x: 250,
    y: 150,
    width: 600,
    height: 400,
    fill: '#eee',
    stroke: 'black',
});

function getGridWidth() {
    if (plotAreaConfig.value.width! < stageConfig.value.width!) {
        return stageConfig.value.width;
    }
    return stageConfig.value.width! - margin.left - margin.right! + 100;
}

function getGridHeight() {
    if (plotAreaConfig.value.height! < stageConfig.value.height!) {
        return stageConfig.value.height;
    }
    return stageConfig.value.height! - margin.top - margin.bottom! + 100;
}

const isPlotWithinBoundsX = plotAreaConfig.value.width! <= stageConfig.value.width!;
const isPlotWithinBoundsY = plotAreaConfig.value.height! <= stageConfig.value.height!;

const gridConfig = ref<Konva.GroupConfig>({
    x: margin.left,
    y: margin.top,
    offset: {
        x: isPlotWithinBoundsX ? 0 : 50,
        y: isPlotWithinBoundsY ? 0 : 50,
    },
    width: getGridWidth(),
    height: getGridHeight(),
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    dragBoundFunc(pos) {
        const maxDragRight = isPlotWithinBoundsX ? 0 : margin.left + 50;
        const maxDragDown = isPlotWithinBoundsY ? 0 : margin.top + 50;
        let x = pos.x > maxDragRight ? maxDragRight : pos.x;
        let y = pos.y > maxDragDown ? maxDragDown : pos.y;

        const maxDragLeft = isPlotWithinBoundsX ? 0 : margin.right - margin.left;
        const maxDragUp = isPlotWithinBoundsY ? 0 : margin.bottom - margin.top + 70;
        if (x < maxDragLeft) {
            x = maxDragLeft;
        }
        if (y < maxDragUp) {
            y = maxDragUp;
        }

        return {
            x,
            y,
        };
    },
});

function handleGridDragEnd(e: Konva.KonvaEventObject<any>) {
    gridConfig.value.x = e.target.x();
    gridConfig.value.y = e.target.y();
}

function resizeStage() {
    stageConfig.value.width = window.innerWidth;
    stageConfig.value.height = window.innerHeight - margin.top;
}

window.addEventListener('resize', resizeStage);
// window.removeEventListener('resize', resizeStage);

function rotatePoint({ x, y }: { x: number; y: number }, rad: any) {
    const rcos = Math.cos(rad);
    const rsin = Math.sin(rad);
    return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
}

// will work for shapes with top-left origin, like rectangle
function rotateAroundCenter(node: any, rotation: any) {
    // current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
    const topLeft = { x: -node.width / 2, y: -node.height / 2 };
    const current = rotatePoint(topLeft, Konva.getAngle(node.rotation));
    const rotated = rotatePoint(topLeft, Konva.getAngle(rotation));
    const dx = rotated.x - current.x;
    const dy = rotated.y - current.y;

    node.rotation = rotation;
    node.x = node.x + dx;
    node.y = node.y + dy;
}

// const rect = ref<Konva.Rect>();
const rect2 = new Konva.Rect({
    x: 300,
    y: 300,
    width: 100,
    height: 100,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 2,
    draggable: true,
    dragBoundFunc(pos) {
        return {
            x: pos.x,
            y: pos.y,
        };
    },
});

// then use it
rotateAroundCenter(rect2.value, 30);
</script>

<template>
    <v-stage
        ref="stage"
        :config="stageConfig"
    >
        <v-layer ref="background" name="background">
            <v-group
                name="grid"
                :config="gridConfig"
                @dragend="handleGridDragEnd"
            >
                <v-rect
                    name="grid-background"
                    :config="{
                        x: 0,
                        y: 0,
                        width: gridConfig.width!,
                        height: gridConfig.height,
                        fill: '#bbb',
                    }"
                />
                <v-rect
                    name="plotArea"
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
                        strokeWidth: (n + 5) % 10 === 0 ? 1 : .5,
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
                        strokeWidth: (n + 5) % 10 === 0 ? 1 : .5,
                    }"
                />
            </v-group>

            <v-line
                :config="{
                    name: 'top-border',
                    x: 0,
                    y: 0,
                    offsetY: -20,
                    points: [0, 0, stageConfig.width, 0],
                    stroke: '#999',
                    strokeWidth: 40,
                }"
            />
            <!--            <v-line -->
            <!--                :config="{ -->
            <!--                    name: 'right-border', -->
            <!--                    x: stageConfig.width! - 10, -->
            <!--                    y: 0, -->
            <!--                    offsetX: -5, -->
            <!--                    points: [0, 0, 0, stageConfig.height], -->
            <!--                    stroke: '#999', -->
            <!--                    strokeWidth: 10, -->
            <!--                }" -->
            <!--            /> -->
            <!--            <v-line -->
            <!--                :config="{ -->
            <!--                    x: 0, -->
            <!--                    y: 0, -->
            <!--                    offsetX: -5, -->
            <!--                    points: [0, 0, 0, stageConfig.height], -->
            <!--                    stroke: '#999', -->
            <!--                    strokeWidth: 10, -->
            <!--                }" -->
            <!--            /> -->
            <!--            <v-line -->
            <!--                :config="{ -->
            <!--                    x: 0, -->
            <!--                    y: -10, -->
            <!--                    offsetY: -5, -->
            <!--                    points: [0, stageConfig.height, stageConfig.width, stageConfig.height], -->
            <!--                    stroke: '#999', -->
            <!--                    strokeWidth: 10, -->
            <!--                }" -->
            <!--            /> -->

            <v-text :config="{ x: 20, y: 10, text: 'My Plot', fontSize: 18, fill: 'white' }" />
            <v-text :config="{ x: 100, y: 10, text: `${gridConfig.x}, ${gridConfig.y}`, fontSize: 18, fill: 'blue' }" />
            <v-text :config="{ x: 200, y: 10, text: `${gridConfig.width}, ${gridConfig.height}`, fontSize: 18, fill: 'blue' }" />
            <v-text :config="{ x: 300, y: 10, text: `${stageConfig.width}, ${stageConfig.height}`, fontSize: 18, fill: 'red' }" />
            <v-text :config="{ x: 500, y: 10, text: `${plotAreaConfig.width}`, fontSize: 18, fill: 'white' }" />

            <v-rect
                :config="rect2"
            />
        </v-layer>

        <v-layer ref="axes" name="axes">
            <v-line
                name="x-axis-background"
                :config="{
                    x: margin.left - 20,
                    y: margin.top,
                    offsetY: 10,
                    points: [0, 0, gridConfig.width!, 0],
                    stroke: 'black',
                    strokeWidth: 20,
                    opacity: 0.5,
                }"
            />
            <v-line
                name="y-axis-background"
                :config="{
                    x: margin.left - 10,
                    y: margin.top - 20,
                    points: [0, 0, 0, gridConfig.height!],
                    stroke: 'black',
                    strokeWidth: 20,
                    opacity: 0.5,
                }"
            />

            <v-group name="x-axis" :config="{ x: 0, y: 0 }">
                <v-line
                    name="x-axis-line" :config="{
                        x: margin.left,
                        y: margin.top,
                        points: [0, 0, gridConfig.width!, 0],
                        stroke: '#fff',
                        strokeWidth: 1,
                    }"
                />
                <v-line
                    v-for="n in Math.ceil(gridConfig.width! / 100)"
                    :key="n"
                    name="x-ticks"
                    :config="{
                        x: margin.left + ((n - 1) * 100),
                        y: margin.top,
                        offsetY: 5,
                        points: [0, 0, 0, 5],
                        stroke: 'white',
                        strokeWidth: 1,
                    }"
                />
                <v-text
                    v-for="n in Math.floor(gridConfig.width! / 100)" :key="n"
                    :config="{ x: 24 + n * 100, y: 49, text: `${n}m`, offsetY: 5, fontSize: 10, fill: 'white' }"
                />
            </v-group>
            <v-group name="y-axis" :config="{ x: 0, y: 0 }">
                <v-line
                    name="y-axis-line" :config="{
                        x: margin.left,
                        y: margin.top,
                        points: [0, 0, 0, gridConfig.height!],
                        stroke: '#fff',
                        strokeWidth: 1,
                    }"
                />
                <v-line
                    v-for="n in Math.ceil(gridConfig.height! / 100)"
                    :key="n"
                    name="y-ticks"
                    :config="{
                        x: margin.left - 5,
                        y: margin.top + ((n - 1) * 100),
                        points: [0, 0, 5, 0],
                        stroke: 'white',
                        strokeWidth: 1,
                    }"
                />
                <v-text
                    v-for="n in Math.floor(gridConfig.height! / 100)" :key="n"
                    :config="{ x: 15, y: 62.5 + n * 100, offsetX: 5, text: `${n}m`, fontSize: 10, fill: 'white', rotation: 270 }"
                />
            </v-group>
        </v-layer>
    </v-stage>
</template>
