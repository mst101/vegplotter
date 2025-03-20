<script setup lang="ts">
import Konva from 'konva';
import { onMounted, ref } from 'vue';

const width = 800;
const height = 400;

const stage = ref<Konva.Stage | null>(null);
const gridLayer = ref<Konva.Layer | null>(null);
const layer = ref<Konva.Layer | null>(null);

const stepSize = 40;
const currentSolution = ref<string>('solution1');
const scaleDisplay = ref<number>(1);
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

onMounted(() => {
    // Initialize Konva Stage and Layers after the component is mounted
    stage.value = new Konva.Stage({
        container: 'container',
        width,
        height,
        draggable: true,
    });

    gridLayer.value = new Konva.Layer({
        draggable: false,
        x: 0,
        y: 0,
    });
    stage.value.add(gridLayer.value);

    layer.value = new Konva.Layer();
    stage.value.add(layer.value);

    const rStageBorder = new Konva.Rect({
        x: 2,
        y: 2,
        width: width - 4,
        height: height - 4,
        strokeWidth: 4,
        stroke: 'green',
    });
    const rStageFill = new Konva.Rect({
        x: 2,
        y: 2,
        width: width - 4,
        height: height - 4,
        fill: 'yellow',
        opacity: 0.2,
    });

    layer.value.add(rStageFill, rStageBorder);

    const r1 = new Konva.Rect({
        x: 0,
        y: 0,
        width: 40,
        height: 40,
        fill: 'blue',
        draggable: true,
    });
    layer.value.add(r1);

    const circle = new Konva.Circle({
        x: stage.value.width() / 2,
        y: stage.value.height() / 2,
        radius: 50,
        fill: 'orange',
        draggable: true,
    });
    layer.value.add(circle);

    drawLines();

    stage.value.on('wheel', handleWheel);
    stage.value.on('dragend', drawLines);
});

let stageRect: RectProps;
let viewRect: RectProps;
let fullRect: RectProps;
let gridOffset: OffsetProps;
let gridRect: RectProps;
let gridFullRect: RectProps;

function drawLines() {
    if (!gridLayer.value || !stage.value)
        return;

    gridLayer.value.clear();
    gridLayer.value.destroyChildren();
    gridLayer.value.clipWidth(null);

    stageRect = {
        x1: 0,
        y1: 0,
        x2: stage.value.width(),
        y2: stage.value.height(),
        offset: {
            x: unScale(stage.value.position().x),
            y: unScale(stage.value.position().y),
        },
    };
    viewRect = {
        x1: -stageRect.offset.x,
        y1: -stageRect.offset.y,
        x2: unScale(width) - stageRect.offset.x,
        y2: unScale(height) - stageRect.offset.y,
    };
    fullRect = {
        x1: Math.min(stageRect.x1, viewRect.x1),
        y1: Math.min(stageRect.y1, viewRect.y1),
        x2: Math.max(stageRect.x2, viewRect.x2),
        y2: Math.max(stageRect.y2, viewRect.y2),
    };
    gridOffset = {
        x: Math.ceil(unScale(stage.value.position().x) / stepSize) * stepSize,
        y: Math.ceil(unScale(stage.value.position().y) / stepSize) * stepSize,
    };
    gridRect = {
        x1: -gridOffset.x,
        y1: -gridOffset.y,
        x2: unScale(width) - gridOffset.x + stepSize,
        y2: unScale(height) - gridOffset.y + stepSize,
    };
    gridFullRect = {
        x1: Math.min(stageRect.x1, gridRect.x1),
        y1: Math.min(stageRect.y1, gridRect.y1),
        x2: Math.max(stageRect.x2, gridRect.x2),
        y2: Math.max(stageRect.y2, gridRect.y2),
    };

    switch (currentSolution.value) {
        case 'solution1':
            drawLinesSolution1();
            break;
        case 'solution2':
            drawLinesSolution2();
            break;
        case 'solution3':
            drawLinesSolution3();
            break;
        case 'solution4':
            drawLinesSolution4();
            break;
    }
}

function unScale(val: number) {
    return val / stage.value.scaleX();
}

function drawLinesSolution1() {
    const xSize = stage.value.width();
    const ySize = stage.value.height();
    const xSteps = Math.round(xSize / stepSize);
    const ySteps = Math.round(ySize / stepSize);

    for (let i = 0; i <= xSteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: i * stepSize,
                points: [0, 0, 0, ySize],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }
    for (let i = 0; i <= ySteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                y: i * stepSize,
                points: [0, 0, xSize, 0],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }

    gridLayer.value.add(
        new Konva.Rect({
            x: viewRect.x1 + 2,
            y: viewRect.y1 + 2,
            width: viewRect.x2 - viewRect.x1 - 4,
            height: viewRect.y2 - viewRect.y1 - 4,
            strokeWidth: 4,
            stroke: 'red',
        }),
    );

    gridLayer.value.batchDraw();
}

function drawLinesSolution2() {
    const xSize = fullRect.x2 - fullRect.x1;
    const ySize = fullRect.y2 - fullRect.y1;
    const xSteps = Math.round(xSize / stepSize);
    const ySteps = Math.round(ySize / stepSize);

    for (let i = 0; i <= xSteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: fullRect.x1 + i * stepSize,
                y: fullRect.y1,
                points: [0, 0, 0, ySize],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }
    for (let i = 0; i <= ySteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: fullRect.x1,
                y: fullRect.y1 + i * stepSize,
                points: [0, 0, xSize, 0],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }

    gridLayer.value.add(
        new Konva.Rect({
            x: viewRect.x1 + 2,
            y: viewRect.y1 + 2,
            width: viewRect.x2 - viewRect.x1 - 4,
            height: viewRect.y2 - viewRect.y1 - 4,
            strokeWidth: 4,
            stroke: 'red',
        }),
    );

    gridLayer.value.batchDraw();
}

function drawLinesSolution3() {
    const fullRect = gridFullRect;
    const xSize = fullRect.x2 - fullRect.x1;
    const ySize = fullRect.y2 - fullRect.y1;
    const xSteps = Math.round(xSize / stepSize);
    const ySteps = Math.round(ySize / stepSize);

    for (let i = 0; i <= xSteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: fullRect.x1 + i * stepSize,
                y: fullRect.y1,
                points: [0, 0, 0, ySize],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }
    for (let i = 0; i <= ySteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: fullRect.x1,
                y: fullRect.y1 + i * stepSize,
                points: [0, 0, xSize, 0],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }

    gridLayer.value.add(
        new Konva.Rect({
            x: viewRect.x1 + 2,
            y: viewRect.y1 + 2,
            width: viewRect.x2 - viewRect.x1 - 4,
            height: viewRect.y2 - viewRect.y1 - 4,
            strokeWidth: 4,
            stroke: 'red',
        }),
    );

    gridLayer.value.batchDraw();
}

function drawLinesSolution4() {
    gridLayer.value.clip({
        x: viewRect.x1,
        y: viewRect.y1,
        width: viewRect.x2 - viewRect.x1,
        height: viewRect.y2 - viewRect.y1,
    });

    const fullRect = gridFullRect;
    const xSize = fullRect.x2 - fullRect.x1;
    const ySize = fullRect.y2 - fullRect.y1;
    const xSteps = Math.round(xSize / stepSize);
    const ySteps = Math.round(ySize / stepSize);

    for (let i = 0; i <= xSteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: fullRect.x1 + i * stepSize,
                y: fullRect.y1,
                points: [0, 0, 0, ySize],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }
    for (let i = 0; i <= ySteps; i++) {
        gridLayer.value.add(
            new Konva.Line({
                x: fullRect.x1,
                y: fullRect.y1 + i * stepSize,
                points: [0, 0, xSize, 0],
                stroke: 'rgba(0, 0, 0, 0.2)',
                strokeWidth: 1,
            }),
        );
    }

    gridLayer.value.add(
        new Konva.Rect({
            x: viewRect.x1 + 2,
            y: viewRect.y1 + 2,
            width: viewRect.x2 - viewRect.x1 - 4,
            height: viewRect.y2 - viewRect.y1 - 4,
            strokeWidth: 4,
            stroke: 'red',
        }),
    );

    gridLayer.value.batchDraw();
}

function handleWheel(e: Konva.KonvaEventObject<WheelEvent>) {
    e.evt.preventDefault();

    const oldScale = stage.value.scaleX();
    const pointer = stage.value.getPointerPosition();

    const mousePointTo = {
        x: (pointer.x - stage.value.x()) / oldScale,
        y: (pointer.y - stage.value.y()) / oldScale,
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

    stage.value.scale({ x: newScale, y: newScale });

    const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
    };

    stage.value.position(newPos);

    scaleDisplay.value = stage.value.scaleX();

    stage.value.draw();
    drawLines();
}

function saveDefault() {
    const dataURL = stage.value.toDataURL();
    downloadURI(dataURL, 'stage.png');
}

function saveExtended() {
    const dataURL = stage.value.toDataURL({ x: -200, y: -200, width: 1200, height: 800 });
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
    drawLines();
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
</template>
