<script setup lang="ts">
import type Konva from 'konva';
import { computed, ref } from 'vue';

// Setup reactive state
const updateKey = ref(0);
const stage = ref<Konva.Stage | null>(null);
const background = ref<Konva.Layer | null>(null);

const stageConfig = ref<Konva.ContainerConfig>({
    width: window.innerWidth,
    height: window.innerHeight - 66,
});

const plotAreaConfig = ref<Konva.GroupConfig>({
    x: 100,
    y: 100,
    width: 400,
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

const gridConfig: Konva.GroupConfig = computed(() => {
    return {
        x: 0,
        y: 0,
        width: gridWidth.value,
        height: gridHeight.value,
        scaleX: 1,
        scaleY: 1,
        draggable: true,
    };
});

// Methods
function handleGridDragEnd(e: Konva.KonvaEventObject<any>) {
    // gridConfig.value.x = e.target.x();
    // gridConfig.value.y = e.target.y();
}

function resizeStage() {
    stageConfig.value.width = window.innerWidth;
    stageConfig.value.height = window.innerHeight;
}

window.addEventListener('resize', resizeStage);
</script>

<template>
    <div :key="updateKey" class="space-x-2">
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
        </v-stage>
    </div>
</template>
