import Konva from 'konva';
import type { IRect } from 'konva/lib/types';
import Utils from '@/Utils/Konva';
import Chair, { chairSize } from '@/Models/Chair.js';
import type { Change, Position } from '@/types';

interface ChairPosition {
    x: number;
    y: number;
    angle: number;
}

interface TableData {
    shape: 'rect' | 'circle';
    width?: number;
    height?: number;
    radius?: number;
    chairPositions: ChairPosition[];
}

interface OuterRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

// Config data for tables
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

export default class Table {
    id: string = Utils.getUUID(); // unique id of the table & chair combo
    position: Position = { x: 0, y: 0 }; // position of the table on the plan
    rotation: number = 0; // rotation angle of the table
    diet: string = 'Omnivore'; // table is reserved for diners who require this diet type.
    konvaShape: Konva.Group | null = null; // main shape for the table & chair combo
    konvaTable: Konva.Rect | Konva.Circle | null = null; // table shape for different diet colors
    outerRect: OuterRect | null = null; // Slightly inflated table size for positioning the chairs
    focus: boolean = false; // is this table the one with focus
    eventRect: Konva.Rect | null = null; // konva rect to catch events.
    tableShape: string = ''; // basic shape of the table
    chairs: Chair[] = []; // list of chairs around the table
    layer: Konva.Layer; // layer for the table to be drawn on

    // construct a new table object given shape name and position
    constructor(layer: Konva.Layer, tableShapeName: string, x: number, y: number) {
        this.layer = layer;
        this.position = {
            x,
            y,
        };

        // Note that we may want to delay this if there is other information required
        // before we can do the first draw. In that case call table.draw() after that
        // data is in place.
        this.draw(tableShapeName, this.position);
    }

    draw(tableShapeName: string, centerPos: Position) {
        // If we have not yet loaded the konva shapes do so now.
        if (!this.konvaShape) {
            this.drawFirstTime(tableShapeName, centerPos);
        }
        this.drawEveryTime();
    }

    // this code only runs the first time draw() is called.
    drawFirstTime(tableShapeName: string, centerPos: Position) {
        // A table is a Konva group built from a table shape (rect or circle)
        // plus chair objects as needed
        this.konvaShape = new Konva.Group({ name: 'table', draggable: true, position: centerPos });

        // IMPORTANT - store the id as an attr in the Konva shape!
        this.konvaShape.setAttr('tableId', this.id);

        let tableShape;
        const data: TableData = tableData[tableShapeName];

        if (!data) {
            throw new Error(`No table config matches the given name ${tableShapeName}`);
        }

        this.tableShape = data.shape; // used later to decide if user can add a chair

        switch (data.shape) {
            case 'rect':
                tableShape = new Konva.Rect({
                    x: -(data.width! / 2),
                    y: -(data.height! / 2),
                    width: data.width,
                    height: data.height,
                    stroke: 'silver',
                    strokeWidth: 4,
                });
                break;
            case 'circle':
                tableShape = new Konva.Circle({
                    radius: data.radius,
                    stroke: 'silver',
                    strokeWidth: 4,
                });
                break;
        }

        if (!tableShape) {
            throw new Error(`Some error creating table of type ${tableShapeName}`);
        }
        else {
            this.konvaTable = tableShape;
            this.konvaShape.add(tableShape);
            this.layer.add(this.konvaShape);

            // The chairs are positioned using co-ords calculated as a fraction of the table size,
            // so we inflate table size slightly to make that work.
            let outerRect = tableShape.getSelfRect();
            const outerWidth = outerRect.width + 2 * chairSize.outerWidth / 2;
            const outerHeight = outerRect.height + 2 * chairSize.outerHeight / 2;

            // the outerRect is a slightly inflated table size for chair positioning.
            outerRect = {
                x: -outerWidth / 2,
                y: -outerHeight / 2,
                width: outerWidth,
                height: outerHeight,
            };
            this.outerRect = outerRect; // used in addChair()

            // and draw the chairs
            for (const chairPos of data.chairPositions) {
                this.addChair(
                    outerRect.x + (outerRect.width * chairPos.x),
                    outerRect.y + (outerRect.height * chairPos.y),
                    chairPos.angle,
                );
            }

            // now the table & chairs are all in place make a transparent rect to catch events on
            //  the group including 'empty' space.
            // IMPORTANT - use skipTransform: true config param to negate affects of transforms as
            // default of shape.getClientRect() is absolute position on canvas and will be affected
            // by scaling, rotation, etc.
            this.eventRect = new Konva.Rect(this.konvaShape.getClientRect({ skipTransform: true }));
            this.eventRect.setAttrs({
                fill: 'blue',
            });
            this.konvaShape.add(this.eventRect);
            this.eventRect.moveToBottom();
        }

        //
        // As this is first-time-thru we set the click listener for the table. The click event
        // for a group is triggered whenever a child shape that is listening gets clicked.
        // Note if you have a high number of shapes then delegate event listening to the stage or layer!
        //
        this.konvaShape.on('mousedown', function () {
            // get the table id that we stored in the Konva.Groups attrs list
            const id = this.getAttr('tableId');

            // get the table from the data model via lookup on the id
            const table = globalThis.model.tables.get(id);

            // set the focus flag which will move the transformer onto the shape
            table.setFocus(true);
        });

        // Handle the update of position when the user ends a drag.
        this.konvaShape.on('dragend', function () {
            const id = this.getAttr('tableId');
            const table = globalThis.model.tables.get(id);

            // do the overlap check
            const overlap = table.hitCheck();
            if (overlap) {
                // eslint-disable-next-line no-alert
                alert('Tables may not overlap!');
                table.draw();
                return;
            }

            const changeData: Change = {
                obj: {
                    type: 'table',
                    id,
                },
                before: {
                    position: {
                        x: table.position.x,
                        y: table.position.y,
                    },
                },
                after: {
                    position: {
                        x: table.konvaShape.position().x,
                        y: table.konvaShape.position().y,
                    },
                },
            };

            globalThis.undoStack.apply(changeData);

            table.draw();
        });

        // handle the event when the table is rotated via the transformer rotation anchor
        this.konvaShape.on('transformend', function () {
            const id = this.getAttr('tableId');
            const table = globalThis.model.tables.get(id);

            const changeData: Change = {
                obj: {
                    type: 'table',
                    id,
                },
                before: {
                    rotation: table.rotation,
                },
                after: {
                    rotation: this.rotation(),
                },
            };

            globalThis.undoStack.apply(changeData);

            table.draw();
        });
    }

    // this code runs every time draw() is called.
    drawEveryTime() {
        // we now handle any konva shape changes that have happened
        // First should be flip opacity on the eventRect to indicate selection
        if (this.focus) {
            this.eventRect!.opacity(0.1);

            // make this the focus table by removing the other table shapes from the transformer
            // and add this one in!
            globalThis.transformer.nodes([this.konvaShape!]);

            // iterate the other table objects and de-focus them,
            // then ask them to draw to update their visual appearance
            for (const otherTable of globalThis.model.tables.values()) {
                if (otherTable.id !== this.id) {
                    otherTable.setFocus(false);
                }
            }
        }
        else {
            // when a table does not have focus set eventRect opacity to zero
            this.eventRect!.opacity(0);
        }

        // Take account of the diet setting for the table and show an appropriate color
        switch (this.diet) {
            case 'Vegetarian':
                this.konvaTable!.fill('lime');
                break;
            case 'Pescatarian':
                this.konvaTable!.fill('red');
                break;
            case 'Omnivore':
                this.konvaTable!.fill('transparent');
                break;
        }

        // Apply position and rotation attributes from the model to the konva shape.
        this.konvaShape!.position(this.position);
        this.konvaShape!.rotation(this.rotation);

        // For circular tables compute the chair positions and ask the chairs to draw again to apply
        if (this.tableShape === 'circle') {
            // decide on the chair angle
            // chairs might not be visible, so we have to count them
            let totalChairs = 0;
            for (const chair of this.chairs) {
                totalChairs = totalChairs + (chair.visible ? 1 : 0);
            }
            const chairAngle = 360 / totalChairs;
            // eslint-disable-next-line no-console
            console.log(`Chair count ${totalChairs} Angle = ${chairAngle}`);
            const startY = -1 * this.outerRect!.width / 2;
            const startX = 0;

            let count = 0;
            for (const chair of this.chairs) {
                if (chair.visible) {
                    const angle = chairAngle * count;
                    const radians = angle * (Math.PI / 180);

                    const newX = startX * Math.cos(radians) - startY * Math.sin(radians);
                    const newY = startY * Math.cos(radians) + startX * Math.sin(radians);

                    chair.position = {
                        x: newX,
                        y: newY,
                    };
                    chair.angle = angle + 90;

                    chair.drawEveryTime();

                    count = count + 1;
                }
            }
        }
    }

    addChair(x: number, y: number, angle: number) {
        const chair = new Chair(
            x,
            y,
            angle,
            this.konvaShape!,
            this.id,
        );

        // store the chair in this table's list of chairs
        this.chairs.push(chair);

        // store the chair in the global list of chair objects
        globalThis.model.chairs.set(chair.id, chair);

        return chair;
    }

    setFocus(hasFocus: boolean) {
        // set the focus flag which will move the transformer onto the shape
        this.focus = hasFocus;

        // then ask the table to draw itself again because we changed a visual feature
        this.drawEveryTime();
    }

    // Check if this table overlaps another - used in drop phase of drag & drop
    hitCheck() {
        let isOverlapping = false;
        const r1: IRect = this.konvaShape!.getClientRect();

        // iterate the tables
        for (const otherTable of model.tables.values()) {
            if (otherTable.id !== this.id) {
                // check for overlap
                const r2 = otherTable.konvaShape.getClientRect();
                if (Utils.hasOverlap(r1, r2)) {
                    isOverlapping = true;
                    break;
                }
            }
        }

        return isOverlapping;
    }
}
