<script setup lang="ts">
import type Konva from 'konva';
import { ref } from 'vue';

const bgGray50 = 'rgb(243, 244, 246)';

const stage = ref<Konva.StageConfig>();
const background = ref<Konva.Layer>();
const sideLayer = ref<Konva.Layer>();
const transformer = ref<Konva.TransformerConfig>();

const stageConfig = ref<Konva.ContainerConfig>({
    width: window.innerWidth,
    height: window.innerHeight - 65,
});

const isSidebarOpen = ref(false);
const sideBarWidth = ref(isSidebarOpen.value ? 250 : 0);

const gridConfig = ref<Konva.GroupConfig>({
    x: 0,
    y: 0,
    offset: {
        x: 0,
        y: 0,
    },
    width: stageConfig.value.width! + sideBarWidth.value,
    height: stageConfig.value.height!,
    scaleX: 1,
    scaleY: 1,
    draggable: true,
    dragBoundFunc(pos) {
        const x = pos.x > 50 ? 50 : pos.x;
        const y = pos.y > 50 ? 50 : pos.y;

        // const maxX = stageConfig.value.width! - 100;
        // const maxY = stageConfig.value.height! - 100;
        // if (x < maxX) {
        //     x = maxX;
        // }
        // if (y < maxY) {
        //     y = maxY;
        // }

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

const plotAreaConfig = ref<Konva.GroupConfig>({
    x: 250,
    y: 250,
    width: 600,
    height: 400,
    fill: '#eee',
    stroke: 'black',
});

const xAxisConfig = ref<Konva.LineConfig>({
    x: 30,
    y: 60,
    points: [0, 0, gridConfig.value.width!, 0],
    stroke: '#fff',
    strokeWidth: 1,
});
const yAxisConfig = ref<Konva.LineConfig>({
    x: 30,
    y: 60,
    points: [0, 0, 0, gridConfig.value.height!],
    stroke: '#fff',
    strokeWidth: 1,
});

const textNode = ref<Konva.TextConfig>();

function enterText() {
    // create textarea over canvas with absolute position

    // first we need to find position for input
    // how to find it?

    // first let's find position of text node relative to the stage:
    const textPosition = textNode.value!.getNode().getAbsolutePosition();

    // then lets find position of stage container on the page:
    const stageBox = stage.value!.getNode().container().getBoundingClientRect();

    // so position of textarea will be the sum of positions above:
    const areaPosition = {
        x: stageBox.left + textPosition.x,
        y: stageBox.top + textPosition.y,
    };

    // create textarea and style it
    const input = document.createElement('input');
    document.body.appendChild(input);

    input.value = textNode.value!.getNode().text();
    input.style.position = 'absolute';
    input.style.top = `${areaPosition.y - 5}px`;
    input.style.left = `${areaPosition.x - 6}px`;
    input.style.width = textNode.value!.getNode().width().toString();
    input.style.padding = '0 5px';
    input.style.backgroundColor = '#fff';
    input.style.width = '42px';

    input.focus();

    input.addEventListener('keydown', (e) => {
        // hide on enter
        if (e.keyCode === 13) {
            textNode.value!.getNode().text(input.value);
            plotAreaConfig.value.height = Number.parseInt(input.value);
            if (document.body.hasChildNodes())
                document.body.removeChild(input);
        }
    });
    input.addEventListener('focusout', () => {
        textNode.value!.getNode().text(input.value);
        plotAreaConfig.value.height = Number.parseInt(input.value);
        document.body.removeChild(input);
    });
}

const rectangles = ref<Konva.RectConfig[]>([
    {
        id: '0',
        rotation: 0,
        x: 130,
        y: 160,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        fill: 'red',
        name: 'rect1',
        draggable: true,
    },
    {
        id: '1',
        rotation: 0,
        x: 330,
        y: 260,
        width: 100,
        height: 100,
        scaleX: 1,
        scaleY: 1,
        fill: 'green',
        name: 'rect2',
        draggable: true,
    },
]);

// const image = new Image();
// image.src = 'https://konvajs.org/assets/yoda.jpg';
//
// const imageConfig = ref<Konva.ImageConfig>();
//
// image.onload = () => {
//     imageConfig.value = {
//         image,
//         x: 300,
//         y: 400,
//         width: 300,
//         height: 200,
//         draggable: true,
//         name: 'myImage',
//         cornerRadius: 10,
//     };
// };

const selectedShapeName = ref('');

function handleTransformEnd(e: Konva.KonvaEventObject<any>) {
    // shape is transformed, let us save new attrs back to the node
    // find element in our state
    const rect = rectangles.value.find(
        r => r.name === selectedShapeName.value,
    )!;
    // update the state
    rect.x = e.target.x();
    rect.y = e.target.y();
    rect.rotation = e.target.rotation();
    rect.scaleX = e.target.scaleX();
    rect.scaleY = e.target.scaleY();

    // change fill
    rect.fill = Konva.Util.getRandomColor();
}

function handleStageMouseDown(e: Konva.KonvaEventObject<any>) {
    // clicked on stage - clear selection
    if (e.target === e.target.getStage()) {
        selectedShapeName.value = '';
        updateTransformer();
        return;
    }

    // clicked on transformer - do nothing
    const clickedOnTransformer
        = e.target.getParent()!.className === 'Transformer';
    if (clickedOnTransformer) {
        return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const rect = rectangles.value.find(r => r.name === name);
    if (rect) {
        selectedShapeName.value = name;
    }
    else {
        selectedShapeName.value = '';
    }
    updateTransformer();
}

function updateTransformer() {
    // here we need to manually attach or detach Transformer node
    const transformerNode = transformer.value!.getNode();
    const stage = transformerNode.getStage();

    const selectedNode = stage!.findOne(`.${selectedShapeName.value}`);
    // do nothing if selected node is already attached
    if (selectedNode === transformerNode.node()) {
        return;
    }

    if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
    }
    else {
        // remove transformer
        transformerNode.nodes([]);
    }
}

function resizeStage() {
    stageConfig.value.width = window.innerWidth;
    stageConfig.value.height = window.innerHeight - 65;
    gridConfig.value.width = stageConfig.value.width! + sideBarWidth.value;
    gridConfig.value.height = stageConfig.value.height! - 60 + sideBarWidth.value;
}

window.addEventListener('resize', resizeStage);
</script>

<template>
    <div id="screenshot-container" />
    <v-stage
        ref="stage"
        :config="stageConfig"
        @mousedown="handleStageMouseDown"
        @touchstart="handleStageMouseDown"
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
                <v-rect
                    v-for="item in rectangles"
                    :key="item.id"
                    :config="item"
                    @transformend="handleTransformEnd"
                />
                <v-rect
                    :config="{
                        name: 'sideMenu',
                        x: stageConfig.width! - 200,
                        y: 0,
                        width: 200,
                        height: stageConfig.height,
                        fill: 'gray',
                        opacity: 0,
                    }"
                />
                <v-transformer ref="transformer" />
            </v-group>

            <v-line
                name="x-band"
                :config="{
                    x: 10,
                    y: 50,
                    points: [0, 0, gridConfig.width! + 20, 0],
                    stroke: '#666',
                    strokeWidth: 20,
                }"
            />
            <v-line
                name="y-band"
                :config="{
                    x: 20,
                    y: 40,
                    points: [0, 0, 0, gridConfig.height! + 20],
                    stroke: '#666',
                    strokeWidth: 20,
                }"
            />
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
            <v-line
                :config="{
                    name: 'right-border',
                    x: stageConfig.width! - 10,
                    y: 0,
                    offsetX: -5,
                    points: [0, 0, 0, stageConfig.height],
                    stroke: '#999',
                    strokeWidth: 10,
                }"
            />
            <v-line
                :config="{
                    x: 0,
                    y: 0,
                    offsetX: -5,
                    points: [0, 0, 0, stageConfig.height],
                    stroke: '#999',
                    strokeWidth: 10,
                }"
            />
            <v-line
                :config="{
                    x: 0,
                    y: -10,
                    offsetY: -5,
                    points: [0, stageConfig.height, stageConfig.width, stageConfig.height],
                    stroke: '#999',
                    strokeWidth: 10,
                }"
            />
            <v-text :config="{ x: 20, y: 10, text: 'My Plot', fontSize: 18, fill: 'white' }" />
            <v-text :config="{ x: 100, y: 10, text: `${gridConfig.x}, ${gridConfig.y}`, fontSize: 18, fill: 'white' }" />
            <v-text :config="{ x: 200, y: 10, text: `${gridConfig.width}, ${gridConfig.height}`, fontSize: 18, fill: 'white' }" />
            <v-text :config="{ x: 300, y: 10, text: `${stageConfig.width}, ${stageConfig.height}`, fontSize: 18, fill: 'red' }" />
            <v-text :config="{ x: 400, y: 10, text: `${gridConfig.width}, ${gridConfig.height}`, fontSize: 18, fill: 'black' }" />
            <v-text :config="{ x: 500, y: 10, text: `${plotAreaConfig.width}`, fontSize: 18, fill: 'white' }" />
            <v-text
                ref="textNode"
                :config="{ x: 550,
                           y: 10,
                           text: `${plotAreaConfig.height}`,
                           fontSize: 18,
                           fill: 'white' }"
                @click="enterText"
            />

            <v-rect
                name="sidebar-toggle"
                :config="{ x: 600, y: 0, width: 40, height: 40, fill: 'pink' }"
                @click="isSidebarOpen = !isSidebarOpen"
            />

            <v-line name="x-axis" :config="xAxisConfig" />
            <v-line name="y-axis" :config="yAxisConfig" />
            <v-line
                v-for="n in Math.ceil(gridConfig.width! / 100)"
                :key="n"
                name="x-ticks"
                :config="{
                    x: 30 + ((n - 1) * 100),
                    y: 55,
                    points: [0, 0, 0, 5],
                    stroke: 'white',
                    strokeWidth: 1,
                }"
            />
            <v-line
                v-for="n in Math.ceil(gridConfig.height! / 100)"
                :key="n"
                name="y-ticks"
                :config="{
                    x: 25,
                    y: 60 + ((n - 1) * 100),
                    points: [0, 0, 5, 0],
                    stroke: 'white',
                    strokeWidth: 1,
                }"
            />
            <v-text
                v-for="n in Math.floor(gridConfig.width! / 100)" :key="n"
                :config="{ x: 24 + n * 100, y: 44, text: `${n}m`, fontSize: 10, fill: 'white' }"
            />
            <v-text
                v-for="n in Math.floor(gridConfig.height! / 100)" :key="n"
                :config="{ x: 15, y: 68 + n * 100, text: `${n}m`, fontSize: 10, fill: 'white', rotation: 270 }"
            />
        </v-layer>

        <v-layer
            ref="sideLayer"
            name="sideLayer"
        >
            <v-rect
                :config="{
                    name: 'sideMenu',
                    x: stageConfig.width! - sideBarWidth - 15,
                    y: 0,
                    width: sideBarWidth + 5,
                    height: stageConfig.height,
                    fill: bgGray50,
                }"
            />
            <v-rect
                :config="{
                    name: 'sideMenu',
                    x: stageConfig.width! - sideBarWidth,
                    y: 0,
                    width: sideBarWidth - 10,
                    height: stageConfig.height,
                    fill: '#fff',
                }"
            />
        </v-layer>
        <v-layer ref="gridLayer" name="gridLayer" />
        <v-layer ref="activeLayer" name="activeLayer" />
        <v-layer ref="controlLayer" name="controlLayer" />
    </v-stage>
</template>
