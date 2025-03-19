<script setup lang="ts">
import type { Ref } from 'vue';
import {
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watchEffect,
} from 'vue';
import Konva from 'konva';
import Table from '@/Models/Table';
import UndoStackOld from '@/Utils/UndoStackOld';
import type { Change, Model, PlanData } from '@/types';

// Reactive data
const planData: Ref<PlanData> = ref({
    tables: [
        { shape: 'circle-4', x: 800, y: 800 },
        { shape: 'square-4', x: 800, y: 300 },
        { shape: 'square-4', x: 300, y: 800 },
        { shape: 'square-6', x: 1300, y: 800 },
        { shape: 'square-4', x: 800, y: 1300 },
    ],
});

globalThis.model = reactive<Model>({
    tables: new Map(),
    chairs: new Map(),
});

// create the undo handler instance
globalThis.undoStack = new UndoStackOld();

// Vue lifecycle hooks
const stage = ref<Konva.Stage>();
const layer = ref<Konva.Layer>();

// the app does not allow the resizing of tables
globalThis.transformer = new Konva.Transformer({
    padding: 5, // put the transformer border outside the selection by 5 px
    enabledAnchors: [], // switch off sizing anchors
    rotateAnchorOffset: 20, // set offset of rotation anchor
});

// Set a click-event listener on the stage so that when the stage is
// clicked any table that has focus loses it.
function handleStageClick(evt: Konva.KonvaEventObject<unknown>) {
    // if user clicks the stage de-select the currently selected table, if any.
    if (evt.target.getClassName() === 'Stage') {
        if (globalThis.transformer.nodes().length > 0) {
            const id = globalThis.transformer.nodes()[0].getAttr('tableId');
            const table = model.tables.get(id);
            table.setFocus(false);

            // clear the transformer nodes - hides transformer.
            globalThis.transformer.nodes([]);
        }
    }
}

onMounted(() => {
    const stageInstance = new Konva.Stage({
        container: 'container',
        width: 500,
        height: 500,
        scaleX: 0.3,
        scaleY: 0.3,
        draggable: true,
    });

    const layerInstance = new Konva.Layer();

    layerInstance.add(globalThis.transformer);
    stageInstance.add(layerInstance);
    stageInstance.on('click', handleStageClick);

    stage.value = stageInstance;
    layer.value = layerInstance;

    loadPlan(planData.value);
});

onUnmounted(() => {
    // Clean-up logic
});

watchEffect(() => {
    // Watcher for planData changes
});

// Methods
function loadPlan(planData: PlanData) {
    for (const tableConfig of planData.tables) {
        const table = new Table(layer.value!, tableConfig.shape, tableConfig.x, tableConfig.y);
        model.tables.set(table.id, table);
    }
}

function undo() {
    globalThis.undoStack.applyUndo();
}

function redo() {
    globalThis.undoStack.applyRedo();
}

function addChair() {
    if (globalThis.transformer.nodes().length === 0) {
        return;
    }
    const shape = globalThis.transformer.nodes()[0];
    const table = model.tables.get(shape.getAttr('tableId'));

    if (table.tableShape !== 'circle') {
        // eslint-disable-next-line no-alert
        alert('Can only add chairs to circle tables!');
        return false;
    }

    // make a new chair and add it to the table
    const chair = table.addChair();

    const changeData: Change = {
        obj: {
            type: 'chair',
            id: chair.id,
        },
        before: {
            visible: false,
        },
        after: {
            visible: true,
        },
    };

    // apply the change object
    globalThis.undoStack.apply(changeData);
}

function setDiet(diet: string) {
    if (transformer.nodes().length > 0) {
        const shape = transformer.nodes()[0];
        const table = model.tables.get(shape.getAttr('tableId'));

        // set up the change object
        const changeData: Change = {
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
        };

        // apply the change object
        undoStack.apply(changeData);
    }
}
</script>

<template>
    <div>
        <div class="space-x-2">
            <!-- Buttons for Undo, Redo, Add Chair, Diet buttons -->
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

        <v-stage ref="stage">
            <v-layer ref="layer">
                <v-transformer />
            </v-layer>
        </v-stage>
    </div>
</template>
