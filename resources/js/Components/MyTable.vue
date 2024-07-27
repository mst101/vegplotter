<script setup lang="ts">
import type Konva from 'konva';
import type { Reactive } from 'vue';
import { onMounted, ref } from 'vue';
import type { Change, Model, ModelTable, TableConfig, TableData } from '@/types';
import MyChair from '@/Components/MyChair.vue';
import { useUndoStack } from '@/Composables/useUndoStack';

const props = defineProps<{
    tableConfig: TableConfig;
    model: Reactive<Model>;
}>();

const emit = defineEmits<{
    tableClick: [table: Konva.Group];
}>();

const { apply, undoStack, idx } = useUndoStack(props.model);

const tableData = {
    'square-4': {
        shape: 'rect',
        width: 200,
        height: 200,
        chairPositions: [
            { id: '0', x: 0, y: 0.5, angle: 0 },
            { id: '1', x: 0.5, y: 0, angle: 90 },
            { id: '2', x: 1, y: 0.5, angle: 180 },
            { id: '3', x: 0.5, y: 1, angle: 270 },
        ],
    },
    'square-6': {
        shape: 'rect',
        width: 200,
        height: 100,
        chairPositions: [
            { id: '0', x: 0, y: 0.5, angle: 0 },
            { id: '1', x: 0.33, y: 0, angle: 90 },
            { id: '2', x: 0.66, y: 0, angle: 90 },
            { id: '3', x: 1, y: 0.5, angle: 180 },
            { id: '4', x: 0.33, y: 1, angle: 270 },
            { id: '5', x: 0.66, y: 1, angle: 270 },
        ],
    },
    'circle-4': {
        shape: 'circle',
        radius: 120,
        chairPositions: [
            { id: '0', x: 0, y: 0.5, angle: 0 },
            { id: '1', x: 0.5, y: 0, angle: 90 },
            { id: '2', x: 1, y: 0.5, angle: 180 },
            { id: '3', x: 0.5, y: 1, angle: 270 },
        ],
    },
};

const config = tableData[props.tableConfig.shape] as TableData;
const tableGroup = ref<Konva.Group>();

const tableGroupConfig = ref<Konva.GroupConfig>({
    x: props.tableConfig.position.x,
    y: props.tableConfig.position.y,
    draggable: true,
});

let tableShape: ModelTable;

switch (config.shape) {
    case 'rect':
        tableShape = {
            x: -(config.width! / 2),
            y: -(config.height! / 2),
            width: config.width,
            height: config.height,
            stroke: 'silver',
            fill: '#eee',
            strokeWidth: 4,
        };
        break;
    case 'circle':
        tableShape = {
            radius: config.radius,
            stroke: 'silver',
            fill: '#eee',
            strokeWidth: 4,
        };
        break;
}

const tableRect = {
    shape: config.shape,
    x: 0,
    y: 0,
    width: config.width || config.radius! * 2,
    height: config.height || config.radius! * 2,
};

const hitAreaConfig = ref<Konva.RectConfig>({
    x: 0,
    y: 0,
    offset: {
        x: config.shape === 'circle' ? 10 : 0,
        y: config.shape === 'circle' ? 10 : 0,
    },
    width: config.width || config.radius! * 2,
    height: config.height || config.radius! * 2,
    fill: 'lime',
    opacity: 0.3,
});

function hitCheck() {
    const isOverlapping = false;
    const r1 = (tableGroup.value! as Konva.Transformer).getNode().getClientRect();

    // iterate the tables
    for (const otherTable of props.model.tables.values()) {
        if (otherTable.id !== props.tableConfig.id) {
            // check for overlap
            // const r2 = otherTable.konvaShape.getClientRect();
            // if (Utils.hasOverlap(r1, r2)) {
            //     isOverlapping = true;
            //     break;
            // }
        }
    }

    return isOverlapping;
}

function onDragEnd(evt: Konva.KonvaEventObject<DragEvent>) {
    // const id = this.getAttr('tableId');
    const id = props.tableConfig.id!;
    // const table = model.tables.get(id);

    // console.log(id);
    // return;

    // do the overlap check
    const overlap = hitCheck();

    if (overlap) {
        // eslint-disable-next-line no-alert
        alert('Tables may not overlap!');
        // table.draw();
        return;
    }

    const { x, y } = evt.target.getClientRect();

    const changeData: Change = {
        obj: {
            type: 'table',
            id,
        },
        before: {
            position: { ...props.tableConfig.position },
        },
        after: {
            position: {
                x,
                y,
            },
        },
    };

    apply(changeData);

    // table.draw();
}

onMounted(() => {
    const totalArea = (tableGroup.value! as Konva.Transformer).getNode().getClientRect({ skipTransform: true });

    hitAreaConfig.value = {
        ...hitAreaConfig.value,
        ...totalArea,
    };

    props.model.tables.set(props.tableConfig.id!, tableShape);

    // emit('updateTableModel', props.tableConfig);
});
</script>

<template>
    <div class="absolute z-20 bg-blue-400">
        {{ undoStack }} {{ idx }}
    </div>
    <v-group
        ref="tableGroup"
        name="tableGroup"
        :config="tableGroupConfig"
        :table-id="tableConfig.id"
        @click="emit('tableClick', tableGroup!)"
        @dragend="onDragEnd"
    >
        <v-rect v-if="config.shape === 'rect'" name="tableShape" :config="tableShape" />
        <v-circle v-if="config.shape === 'circle'" name="tableShape" :config="tableShape" />
        <MyChair
            v-for="chairPos in config.chairPositions"
            :key="chairPos.id"
            :chair-pos="chairPos"
            :table-rect="tableRect"
        />
        <v-rect name="hitArea" :config="hitAreaConfig" />
    </v-group>
</template>
