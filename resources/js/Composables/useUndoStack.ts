import type { Reactive } from 'vue';
import { ref } from 'vue';
import Utils from '@/Utils/Konva';
import type { Change, Model } from '@/types';

export function useUndoStack(model: Reactive<Model>) {
    const undoStack = ref<Change[]>([]);
    const idx = ref<number>(-1); // indicates the current slot in the stack
    const max = ref<number>(-1); // marks the upper limit of the stack.

    // save a change into the stack and apply it to the model
    function apply(change: Change) {
        // set the max stack pointer for the new entry
        max.value = idx.value + 1;

        undoStack.value[max.value] = change;

        applyRedo();
    }

    // Given target and source JS objects, merge the attrs from the source into the target.
    // If the attr is an object then merge its attributes individually (deep merge).
    function mergeAttributes(target: any, source: any) {
        // Only process the attrs of the source
        for (const attrName of Object.keys(source)) {
            // only process if the target has an attr of that exact name
            if (Object.prototype.hasOwnProperty.call(target, attrName)) {
                // If the target attr is an object then handle it via another call into the merge process, thus
                // supporting deep merging
                if (Utils.isObject(target[attrName])) {
                    mergeAttributes(target[attrName], source[attrName]);
                }
                else {
                    // when the attr is not an object, replace the attr value on the target with the source value.
                    target[attrName] = source[attrName];
                }
            }
        }
    }

    // re-do a change
    function applyRedo() {
        if (idx.value >= max.value) {
            // eslint-disable-next-line no-console
            console.log('No more REDOs available');
            return;
        }

        // move the pointer to the next change
        idx.value = idx.value + 1;

        const change: Change = undoStack.value[idx.value];

        // Get the target object
        let target = null;
        switch (change.obj.type) {
            case 'table':
                target = model.tables.get(change.obj.id);
                break;
            case 'chair':
                target = model.chairs.get(change.obj.id);
                break;
            // other cases as needed.
            default:
                throw new Error(`Unexpected object type in redo [${change.obj.type}]`);
        }

        // Apply the attrs from the change to the target
        mergeAttributes(target, change.after);

        // Special handling per object
        // if (change.obj.type === 'table') {
        //     target.setFocus(true);
        // }
        // else if (change.obj.type === 'chair') {
        //     const table = model.value.tables.get(target.parentId);
        //     table.setFocus(true);
        //     table.draw();
        // }
        //
        // target.draw();
    }

    // Un-do the current change
    function applyUndo() {
        // if there is a change to apply
        if (idx.value <= -1) {
            // eslint-disable-next-line no-console
            console.log('No more UNDOs available');
            return;
        }

        const change: Change = undoStack.value[idx.value];

        // Get the target object
        let target = null;
        switch (change.obj.type) {
            case 'table':
                target = model.tables.get(change.obj.id);
                break;
            case 'chair':
                target = model.chairs.get(change.obj.id);
                break;
            // other cases as needed.
            default:
                throw new Error(`Unexpected object type in redo [${change.obj.type}]`);
        }

        // Apply the attrs from the change to the target
        mergeAttributes(target, change.before);

        // Special handling per object
        // if (change.obj.type === 'table') {
        //     target.setFocus(true);
        // }
        // else if (change.obj.type === 'chair') {
        //     const table = model.value.tables.get(target.parentId);
        //     table.setFocus(true);
        //     table.draw();
        // }
        // target.draw();

        // move the pointer to the previous change
        idx.value = idx.value - 1;
    }

    return {
        apply,
        applyUndo,
        applyRedo,
        undoStack,
        idx,
    };
}
