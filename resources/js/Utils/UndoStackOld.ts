import Utils from '@/Utils/Konva';
import type { Change } from '@/types';

export default class UndoStackOld {
    undoStack: Change[] = [];
    idx: number = -1; // indicates the current slot in the stack
    max: number = -1; // marks the upper limit of the stack.

    // save a change into the stack and apply it to the model
    apply(change: Change) {
        // set the max stack pointer for the new entry
        this.max = this.idx + 1;

        this.undoStack[this.max] = change;

        this.applyRedo();
    }

    // Given target and source JS objects, merge the attrs from the source into the target.
    // If the attr is an object then merge its attributes individually (deep merge).
    mergeAttributes(target: any, source: any) {
        // Only process the attrs of the source
        for (const attrName of Object.keys(source)) {
            // only process if the target has an attr of that exact name
            if (Object.prototype.hasOwnProperty.call(target, attrName)) {
                // If the target attr is an object then handle it via another call into the merge process, thus
                // supporting deep merging
                if (Utils.isObject(target[attrName])) {
                    this.mergeAttributes(target[attrName], source[attrName]);
                }
                else {
                    // when the attr is not an object, replace the attr value on the target with the source value.
                    target[attrName] = source[attrName];
                }
            }
        }
    }

    // re-do a change
    applyRedo() {
        if (this.idx >= this.max) {
            // eslint-disable-next-line no-console
            console.log('No more REDOs available');
            return;
        }

        // move the pointer to the next change
        this.idx = this.idx + 1;

        const change: Change = this.undoStack[this.idx];

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
        this.mergeAttributes(target, change.after);

        // Special handling per object
        if (change.obj.type === 'table') {
            target.setFocus(true);
        }
        else if (change.obj.type === 'chair') {
            const table = model.tables.get(target.parentId);
            table.setFocus(true);
            table.draw();
        }

        target.draw();
    }

    // Un-do the current change
    applyUndo() {
        // if there is a change to apply
        if (this.idx <= -1) {
            // eslint-disable-next-line no-console
            console.log('No more UNDOs available');
            return;
        }

        const change: Change = this.undoStack[this.idx];

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
        this.mergeAttributes(target, change.before);

        // Special handling per object
        if (change.obj.type === 'table') {
            target.setFocus(true);
        }
        else if (change.obj.type === 'chair') {
            const table = model.tables.get(target.parentId);
            table.setFocus(true);
            table.draw();
        }
        target.draw();

        // move the pointer to the previous change
        this.idx = this.idx - 1;
    }
}
