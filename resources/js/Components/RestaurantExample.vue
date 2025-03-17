<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import type Konva from 'konva';
import { computed, onMounted, reactive, ref } from 'vue';
import type { Transformer } from 'konva/lib/shapes/Transformer';
import type { Chair, Table } from '@/types';
import RestaurantTable from '@/Components/RestaurantTable.vue';

interface VueKonvaProxy<Group> { getNode: () => Group } // THIS SOLVED THE PROBLEM
const mainGroupProxy = ref<VueKonvaProxy<Konva.Group> | null>(null);
const mainGroupProxy2 = ref<VueKonvaProxy<Konva.Group> | null>(null);

const configKonva = computed(() => ({
    width: 800,
    height: 800,
}));
// const mainGroupConfig = computed(() => {
//     return {
//         x: 0,
//         y: 0,
//         draggable: true,
//     };
// });
// function getPixelConfig() {
//     return {
//         x: 0,
//         y: 0,
//         width: 50,
//         height: 50,
//         fill: 'red',
//         stroke: 'transparent',
//     };
// }

function groupDragEnd($event) {
    console.log('$event.target');
    console.log($event.target);

    if (mainGroupProxy.value) {
        console.log(`mainGroupProxy.value:`);
        console.log(mainGroupProxy.value[0]);
        const mainGroup = mainGroupProxy.value[0].getNode() as Transformer; // setting type Transformer is required for TypeScript to allow for use of required function
        console.log(`X position: ${mainGroup.getX()}`);
    }
}

function groupDragEnd2($event) {
    console.log('$event.target');
    console.log($event.target);

    if (mainGroupProxy2.value) {
        const mainGroup = mainGroupProxy2.value[0].getKonvaNode();
        console.log(`X position: ${mainGroup.getX()}`);
    }

    // if (mainGroupProxy2.value) {
    //     console.log(`mainGroupProxy2.value:`);
    //     console.log(mainGroupProxy2.value[0]);
    //     const mainGroup = mainGroupProxy2.value[0].getNode() as Transformer; // setting type Transformer is required for TypeScript to allow for use of required function
    //     // const mainGroup = table.getNode() as Transformer; // setting type Transformer is required for TypeScript to allow for use of required function
    //     console.log(`X position: ${mainGroup.getX()}`);
    // }
}

const tableData = {
    'square-4': {
        shape: 'rect',
        width: 200,
        height: 200,
        chairPositions: [
            { x: 0, y: 0.5, angle: 0 },
            { x: 0.5, y: 0, angle: 90 },
            { x: 1, y: 0.5, angle: 180 },
            { x: 0.5, y: 1, angle: 270 },
        ],
    },
    'square-6': {
        shape: 'rect',
        width: 200,
        height: 100,
        chairPositions: [
            { x: 0, y: 0.5, angle: 0 },
            { x: 0.33, y: 0, angle: 90 },
            { x: 0.66, y: 0, angle: 90 },
            { x: 1, y: 0.5, angle: 180 },
            { x: 0.33, y: 1, angle: 270 },
            { x: 0.66, y: 1, angle: 270 },
        ],
    },
    'circle-4': {
        shape: 'circle',
        radius: 120,
        chairPositions: [
            { x: 0, y: 0.5, angle: 0 },
            { x: 0.5, y: 0, angle: 90 },
            { x: 1, y: 0.5, angle: 180 },
            { x: 0.5, y: 1, angle: 270 },
        ],
    },
};

// Reactive state
const tables = ref<Table[]>([]);

// Initial data
const initialPlanData = {
    tables: [
        { shape: 'circle-4', x: 800, y: 800 },
        { shape: 'square-4', x: 800, y: 300 },
        { shape: 'square-4', x: 300, y: 800 },
        { shape: 'square-6', x: 1300, y: 800 },
        { shape: 'square-4', x: 800, y: 1300 },
    ],
};

// Methods
function createTable(tableType: string, x: number, y: number): Table {
    const id = uuidv4();
    const config = tableData[tableType];
    // const tableRef = useTemplateRef(`table-${id}`);
    // console.log(tableRef);

    // Create chairs based on table type
    const chairs: Chair[] = config.chairPositions.map((pos) => {
        // Calculate chair position based on table dimensions
        const outerWidth = config.shape === 'rect'
            ? config.width + 60
            : config.radius * 2 + 60;
        const outerHeight = config.shape === 'rect'
            ? config.height + 60
            : config.radius * 2 + 60;

        const outerRect = {
            x: -outerWidth / 2,
            y: -outerHeight / 2,
            width: outerWidth,
            height: outerHeight,
        };
        const chairX = outerRect.x + (outerRect.width * pos.x);
        const chairY = outerRect.y + (outerRect.height * pos.y);

        return {
            id: uuidv4(),
            position: { x: chairX, y: chairY },
            angle: pos.angle,
            visible: true,
            parentId: id,
        };
    });

    return {
        id,
        position: { x, y },
        rotation: 0,
        diet: 'Omnivore',
        tableType,
        focus: false,
        chairs,
    };
}

function loadPlan() {
    tables.value = initialPlanData.tables.map(table =>
        createTable(table.shape, table.x, table.y),
    );
}

const stageConfig = reactive({
    width: 500,
    height: 500,
    scaleX: 0.3,
    scaleY: 0.3,
});

// Initialize
onMounted(() => {
    loadPlan();
});
</script>

<template>
    <!--    <v-stage :config="configKonva"> -->
    <v-stage :config="stageConfig">
        <v-layer>
            <!--            <v-group ref="mainGroupProxy" :config="mainGroupConfig" @dragend="groupDragEnd"> -->
            <!--                <v-rect :config="getPixelConfig()" /> -->
            <!--            </v-group> -->

            <v-group
                v-for="table in tables"
                :id="table.id"
                ref="mainGroupProxy"
                :key="table.id"
                :position="table.position"
                :rotation="table.rotation"
                :diet="table.diet"
                :focus="table.focus"
                :table-type="table.tableType"
                :chairs="table.chairs"
                draggable="true"
                @dragend="groupDragEnd"
            >
                <v-rect
                    :x="100"
                    :y="100"
                    :width="50"
                    :height="50"
                    stroke="silver"
                    stroke-width="4"
                    fill="green"
                />
            </v-group>

            <RestaurantTable
                v-for="table in tables"
                :id="table.id"
                ref="mainGroupProxy2"
                :key="table.id"
                :position="table.position"
                :rotation="table.rotation"
                :diet="table.diet"
                :focus="table.focus"
                :table-type="table.tableType"
                :chairs="table.chairs"
                @dragend="groupDragEnd2"
            />
        </v-layer>
    </v-stage>
</template>
