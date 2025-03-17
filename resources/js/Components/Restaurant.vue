<script setup lang="ts">
import { computed, onMounted, reactive, ref, useTemplateRef } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { IRect } from 'konva/lib/types';
import type Konva from 'konva';
import type { Chair, Change, Table, TableData } from '@/types';
import RestaurantTable from '@/Components/RestaurantTable.vue';
import Utils from '@/Utils/Konva';

// Table configuration data
const tableData: Record<string, TableData> = {
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
const stageRef = useTemplateRef<Konva.Stage>('stageRef');
const layerRef = useTemplateRef<Konva.Layer>('layerRef');
const myTables = useTemplateRef<Konva.Group>('my-tables');

const transformerNode = ref(null);

const tables = ref<Table[]>([]);
const undoStack = reactive<{
    changes: Change[];
    redoStack: Change[];
}>({
    changes: [],
    redoStack: [],
});

const focusedTableId = ref<string | null>(null);
const stageConfig = reactive({
    width: 500,
    height: 500,
    scaleX: 0.3,
    scaleY: 0.3,
});

// Computed properties
computed(() =>
    tables.value.find(table => table.id === focusedTableId.value),
);

// Initial data
const planData = {
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
    tables.value = planData.tables.map(table =>
        createTable(table.shape, table.x, table.y),
    );
}

function applyChange(change: Change) {
    undoStack.changes.push(change);
    undoStack.redoStack = [];

    const { obj, after } = change;

    if (obj.type === 'table') {
        const table = tables.value.find(t => t.id === obj.id);
        if (table) {
            Object.assign(table, after);
        }
    }
    else if (obj.type === 'chair') {
        for (const table of tables.value) {
            const chair = table.chairs.find(c => c.id === obj.id);
            if (chair) {
                Object.assign(chair, after);
                break;
            }
        }
    }
}

function undo() {
    if (undoStack.changes.length === 0)
        return;

    const change = undoStack.changes.pop()!;
    undoStack.redoStack.push(change);

    const { obj, before } = change;

    if (obj.type === 'table') {
        const table = tables.value.find(t => t.id === obj.id);
        if (table) {
            Object.assign(table, before);
        }
    }
    else if (obj.type === 'chair') {
        for (const table of tables.value) {
            const chair = table.chairs.find(c => c.id === obj.id);
            if (chair) {
                Object.assign(chair, before);
                break;
            }
        }
    }
}

function redo() {
    if (undoStack.redoStack.length === 0)
        return;

    const change = undoStack.redoStack.pop()!;
    undoStack.changes.push(change);

    const { obj, after } = change;

    if (obj.type === 'table') {
        const table = tables.value.find(t => t.id === obj.id);
        if (table) {
            Object.assign(table, after);
        }
    }
    else if (obj.type === 'chair') {
        for (const table of tables.value) {
            const chair = table.chairs.find(c => c.id === obj.id);
            if (chair) {
                Object.assign(chair, after);
                break;
            }
        }
    }
}

function setTableFocus(tableId: string) {
    // Clear focus on all tables
    tables.value.forEach((table) => {
        table.focus = table.id === tableId;
    });

    focusedTableId.value = tableId;

    // Find the Konva node for the focused table
    if (myTables.value) {
        const tableRefs = Array.isArray(myTables.value) ? myTables.value : [myTables.value];
        const focusedTableRef = tableRefs.find(tableRef => tableRef.id === tableId);
        if (focusedTableRef) {
            transformerNode.value = focusedTableRef.getKonvaNode();
        }
    }
}

function handleStageClick(e: Konva.KonvaEventObject<Konva.Stage>) {
    // If clicking on the stage (not a table), clear focus
    if (e.target.getClassName() === 'Stage') {
        tables.value.forEach((table) => {
            table.focus = false;
        });
        focusedTableId.value = null;
    }
}

function addChair() {
    if (!focusedTableId.value)
        return;

    const table = tables.value.find(t => t.id === focusedTableId.value);
    if (!table)
        return;

    if (table.tableType.indexOf('circle') !== 0) {
        // eslint-disable-next-line no-alert
        alert('Can only add chairs to circle tables!');
        return;
    }

    // Calculate position for new chair
    const visibleChairs = table.chairs.filter(c => c.visible);
    const chairCount = visibleChairs.length + 1;
    const chairAngle = 360 / chairCount;

    // Recalculate positions for all chairs
    const config = tableData[table.tableType];
    const radius = config.radius;
    const outerRadius = radius! + 60;

    // Create new chair
    const newChair: Chair = {
        id: uuidv4(),
        position: { x: 0, y: -outerRadius },
        angle: chairAngle,
        visible: true,
        parentId: table.id,
    };

    // Add to table
    table.chairs.push(newChair);

    // Record change for undo
    applyChange({
        obj: {
            type: 'chair',
            id: newChair.id,
        },
        before: {
            visible: false,
        },
        after: {
            visible: true,
        },
    });

    // Recalculate all chair positions
    updateCircleChairPositions(table);
}

function updateCircleChairPositions(table: Table) {
    if (table.tableType.indexOf('circle') !== 0)
        return;

    const visibleChairs = table.chairs.filter(c => c.visible);
    const chairCount = visibleChairs.length;
    const chairAngle = 360 / chairCount;

    const config = tableData[table.tableType];
    const radius = config.radius;
    const outerRadius = radius! + 60;

    visibleChairs.forEach((chair, index) => {
        const angle = chairAngle * index;
        const radians = angle * (Math.PI / 180);

        chair.position = {
            x: Math.sin(radians) * outerRadius,
            y: -Math.cos(radians) * outerRadius,
        };
        chair.angle = angle + 90;
    });
}

function setDiet(diet: string) {
    if (!focusedTableId.value)
        return;

    const table = tables.value.find(t => t.id === focusedTableId.value);
    if (!table)
        return;

    applyChange({
        obj: {
            type: 'table',
            id: table.id,
        },
        before: {
            diet: table.diet,
        },
        after: {
            diet,
        },
    });
}

// function checkTableOverlap(tableId: string) {
//     const table = tables.value.find(t => t.id === tableId);
//     if (!table)
//         return false;
//
//     // let isOverlapping = false;
//     // const r1: IRect = this.konvaShape!.getClientRect();
//     //
//     // for (const otherTable of tables.value) {
//     //     if (otherTable.id !== tableId) {
//     //         // check for overlap
//     //         const r2 = otherTable.getClientRect();
//     //         if (Utils.hasOverlap(r1, r2)) {
//     //             isOverlapping = true;
//     //             break;
//     //         }
//     //     }
//     // }
//
//     // Simple overlap detection - in a real app you'd use more sophisticated collision detection
//     for (const otherTable of tables.value) {
//         if (otherTable.id === tableId)
//             continue;
//
//         const dx = table.position.x - otherTable.position.x;
//         const dy = table.position.y - otherTable.position.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);
//
//         // Get table dimensions
//         const tableConfig = tableData[table.tableType];
//         const otherConfig = tableData[otherTable.tableType];
//
//         let tableSize, otherSize;
//
//         if (tableConfig.shape === 'rect') {
//             tableSize = Math.max(tableConfig.width, tableConfig.height);
//         }
//         else {
//             tableSize = tableConfig.radius * 2;
//         }
//
//         if (otherConfig.shape === 'rect') {
//             otherSize = Math.max(otherConfig.width, otherConfig.height);
//         }
//         else {
//             otherSize = otherConfig.radius * 2;
//         }
//
//         // Simple collision check - would need refinement for production
//         if (distance < (tableSize + otherSize) / 2) {
//             return true;
//         }
//     }
//
//     return false;
// }

// function handleTableDragEnd(tableId: string) {
//     const table = tables.value.find(t => t.id === tableId);
//     if (!table)
//         return;
//     if (checkTableOverlap(tableId)) {
//         alert('Tables may not overlap!');
//         // Revert position
//         const lastChange = undoStack.changes[undoStack.changes.length - 1];
//         if (lastChange && lastChange.obj.id === tableId) {
//             table.position = lastChange.before.position;
//         }
//     }
// }

function handleTableDragEnd(tableGroup: Konva.Group, tableId: string) {
    if (!tableGroup)
        return;
    if (checkTableOverlap(tableGroup, tableId)) {
        // eslint-disable-next-line no-alert
        alert('Tables may not overlap!');
        // Revert position
        // const lastChange = undoStack.changes[undoStack.changes.length - 1];
        // if (lastChange && lastChange.obj.id === tableId) {
        //     table.position = lastChange.before.position;
        // }
    }
}

function getOtherTableRects(tableId: string): IRect[] {
    // Convert to array if it's not already (in case it's a single ref)
    const tableRefs = Array.isArray(myTables.value) ? myTables.value : [myTables.value];

    // Map to client rects
    return tableRefs
        .filter(tableRef => tableRef.id !== tableId)
        .map(tableRef => tableRef.getKonvaNode().getClientRect())
        .filter(rect => rect !== null) as IRect[];
}

// Check if this table overlaps another - used in drop phase of drag & drop
function checkTableOverlap(tableGroup: Konva.Group, tableId: string) {
    let isOverlapping = false;
    const r1: IRect = tableGroup.getClientRect();
    const otherTables = getOtherTableRects(tableId);

    // iterate the tables
    for (const r2 of otherTables) {
        if (Utils.hasOverlap(r1, r2)) {
            isOverlapping = true;
            break;
        }
    }

    return isOverlapping;
}

// Initialize
onMounted(() => {
    loadPlan();
});
</script>

<template>
    <div>
        <div class="mb-4 space-x-2">
            <button class="rounded-lg border border-gray-500 bg-gray-200 px-2 py-1 text-sm" @click="undo">
                Undo
            </button>
            <button class="rounded-lg border border-gray-500 bg-gray-200 px-2 py-1 text-sm" @click="redo">
                Redo
            </button>
            <button class="rounded-lg border border-gray-500 bg-gray-200 px-2 py-1 text-sm" @click="addChair">
                Add Chair
            </button>
            <button class="rounded-lg border border-gray-500 bg-gray-200 px-2 py-1 text-sm" @click="setDiet('Vegetarian')">
                Vegetarian
            </button>
            <button class="rounded-lg border border-gray-500 bg-gray-200 px-2 py-1 text-sm" @click="setDiet('Pescatarian')">
                Pescatarian
            </button>
            <button class="rounded-lg border border-gray-500 bg-gray-200 px-2 py-1 text-sm" @click="setDiet('Omnivore')">
                Omnivore
            </button>
        </div>

        <div>
            <pre class="text-xs">
                {{ undoStack.changes }}
            </pre>
        </div>
        <div id="container">
            <v-stage
                ref="stageRef"
                :config="stageConfig"
                @click="handleStageClick"
            >
                <v-layer ref="layerRef">
                    <RestaurantTable
                        v-for="table in tables"
                        :id="table.id"
                        ref="my-tables"
                        :key="table.id"
                        :position="table.position"
                        :rotation="table.rotation"
                        :diet="table.diet"
                        :focus="table.focus"
                        :table-type="table.tableType"
                        :chairs="table.chairs"
                        @focus="setTableFocus"
                        @dragend="handleTableDragEnd"
                    />

                    <v-transformer
                        v-if="focusedTableId"
                        :config="{
                            // nodes: [`.table-${focusedTableId}`],
                            nodes: [transformerNode],
                            padding: 5,
                            enabledAnchors: [],
                            rotateAnchorOffset: 20,
                        }"
                    />
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>
