<script setup lang="ts">
import type Konva from 'konva';
import { type Ref, reactive, ref } from 'vue';
import MyTable from '@/Components/MyTable.vue';
import type { Model, PlanData, TableConfig } from '@/types';
import Utils from '@/Utils/Konva';
import { useUndoStack } from '@/Composables/useUndoStack';

const model = reactive<Model>({
    tables: new Map<string, TableConfig>(),
    chairs: new Map<string, any>(),
});

const { applyUndo, applyRedo } = useUndoStack(model);

const stage = ref<Konva.Stage>();
const background = ref<Konva.Layer>();
const transformer = ref<Konva.Transformer>();

const stageConfig = ref<Konva.ContainerConfig>({
    width: window.innerWidth,
    height: window.innerHeight - 65,
    scale: {
        x: 0.3,
        y: 0.3,
    },
});

const planData: Ref<PlanData> = ref({
    tables: [
        { id: Utils.getUUID(), shape: 'circle-4', position: { x: 800, y: 800 } },
        { id: Utils.getUUID(), shape: 'square-4', position: { x: 800, y: 300 } },
        { id: Utils.getUUID(), shape: 'square-4', position: { x: 300, y: 800 } },
        { id: Utils.getUUID(), shape: 'square-6', position: { x: 1300, y: 800 } },
        { id: Utils.getUUID(), shape: 'square-4', position: { x: 800, y: 1300 } },
    ],
});

// Set a click-event listener on the stage so that when the stage is
// clicked any table that has focus loses it.
function handleStageClick(evt: Konva.KonvaEventObject<unknown>) {
    // if user clicks the stage de-select the currently selected table, if any.
    if (evt.target.getClassName() === 'Stage') {
        if ((transformer.value!.getNode() as Konva.Transformer).nodes().length > 0) {
            // const id = (transformer.value!.getNode() as Konva.Transformer).nodes()[0].getAttr('table-id');
            // const table = model.tables.get(id);
            // table.setFocus(false);

            // clear the transformer nodes - hides transformer.
            (transformer.value!.getNode() as Konva.Transformer).nodes([]);
        }
    }
}

function selectTable(table: any) {
    (transformer.value!.getNode() as Konva.Transformer).nodes([table.getNode()]);
}

function loadPlan(planData: PlanData) {
    for (const table of planData.tables) {
        // const table = new Table(layer.value!, tableConfig.shape, tableConfig.x, tableConfig.y);
        model.tables.set(table.id!, table);
    }
}

loadPlan(planData.value);
</script>

<template>
    <div class="p-4">
        <p>
            I found a <a class="rounded-md py-1 text-purple-800 outline-none hover:text-purple-900 hover:underline focus:ring-2 focus:ring-green-500" href="https://longviewcoder.com/2023/07/19/undo-redo-with-sample-code/" target="_blank">helpful article</a> on how to implement undo and redo with Konva and I've got that
            <a :href="route('restaurant')" class="rounded-md py-1 text-purple-800 outline-none hover:text-purple-900 hover:underline focus:ring-2 focus:ring-green-500">
                working here.
            </a> I'm currently working on a Vue + TypeScript version which is what you can see below.
        </p>
        <p class="mt-4">
            Once I've cracked that, I'll be well on the way to plotting vegetables! You can see the code on <a class="rounded-md py-1 text-purple-800 outline-none hover:text-purple-900 hover:underline focus:ring-2 focus:ring-green-500" href="https://github.com/mst101/vegplotter" target="_blank">Github</a>.
        </p>
    </div>
    <div class="absolute z-10 ml-4 mt-2 space-x-2">
        <input class="rounded border border-gray-500 bg-gray-200 px-2 py-1" type="button" value="Undo" @click="applyUndo">
        <input class="rounded border border-gray-500 bg-gray-200 px-2 py-1" type="button" value="Redo" @click="applyRedo">
    </div>

    <div class="relative">
        <v-stage
            ref="stage"
            :config="stageConfig"
            @click="handleStageClick"
        >
            <v-layer ref="background" name="background">
                <MyTable v-for="config of planData.tables" :key="config.id" :table-config="config" :model="model" @table-click="selectTable" />
                <v-transformer
                    ref="transformer" name="transformer" :config="{
                        padding: 5, // put the transformer border outside the selection by 5 px
                        enabledAnchors: [], // switch off sizing anchors
                        rotateAnchorOffset: 20, // set offset of rotation anchor
                    }"
                />
            </v-layer>
        </v-stage>
    </div>
</template>

<style scoped>

</style>
