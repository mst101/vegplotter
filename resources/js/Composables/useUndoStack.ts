import { ref } from 'vue';
import type { Change, Model } from '@/types';
import { useKonva } from '@/Composables/useKonva';

export function useUndoStack(model: Model) {
    const { isObject } = useKonva();
    const undoStack = ref<Change[]>([]);
    const idx = ref(-1);
    const max = ref(-1);

    function apply(change: Change) {
        max.value = idx.value + 1;
        undoStack.value[max.value] = change;
        applyRedo();
    }

    function mergeAttributes(target: any, source: any) {
        for (const attrName of Object.keys(source)) {
            if (Object.prototype.hasOwnProperty.call(target, attrName)) {
                if (isObject(target[attrName])) {
                    mergeAttributes(target[attrName], source[attrName]);
                }
                else {
                    target[attrName] = source[attrName];
                }
            }
        }
    }

    function applyRedo() {
        if (idx.value >= max.value) {
            console.log('No more REDOs available');
            return;
        }

        idx.value = idx.value + 1;
        const change: Change = undoStack.value[idx.value];

        let target = null;
        switch (change.obj.type) {
            case 'table':
                target = model.tables.get(change.obj.id);
                break;
            case 'chair':
                target = model.chairs.get(change.obj.id);
                break;
            default:
                throw new Error(`Unexpected object type in redo [${change.obj.type}]`);
        }

        mergeAttributes(target, change.after);
    }

    function applyUndo() {
        if (idx.value <= -1) {
            console.log('No more UNDOs available');
            return;
        }

        const change: Change = undoStack.value[idx.value];

        let target = null;
        switch (change.obj.type) {
            case 'table':
                target = model.tables.get(change.obj.id);
                break;
            case 'chair':
                target = model.chairs.get(change.obj.id);
                break;
            default:
                throw new Error(`Unexpected object type in undo [${change.obj.type}]`);
        }

        mergeAttributes(target, change.before);

        idx.value = idx.value - 1;
    }

    return {
        apply,
        applyUndo,
        applyRedo,
        changes: undoStack,
    };
}
