import Konva from 'konva';
import Utils from '@/Utils/Konva';
import type { Position } from '@/types';

// Config data for chairs
export const chairSize = {
    width: 60,
    height: 60,
    outerWidth: 60,
    outerHeight: 60,
};

export default class Chair {
    id = Utils.getUUID(); // unique id of the chair
    parentId: string | null = null;
    angle = 0;
    konvaShape: Konva.Group | null = null;
    position: Position | null = null;
    visible = true;

    constructor(x: number, y: number, angle: number, tableGroup: Konva.Group, tableId: string) {
        this.position = {
            x,
            y,
        };
        this.angle = angle;
        this.parentId = tableId;
        this.draw(tableGroup);
    }

    draw(tableGroup: Konva.Group) {
        // If we have not yet loaded the konva shapes do so now.
        if (!this.konvaShape) {
            this.drawFirstTime(tableGroup);
        }
        this.drawEveryTime();
    }

    // this code only runs the first time draw() is called.
    drawFirstTime(tableGroup: Konva.Group) {
        // A chair is a Konva group built from 2 rectangles.
        this.konvaShape = new Konva.Group({
            // move the center of drawing and rotation to the center of chair
            offset: {
                x: chairSize.width / 2,
                y: chairSize.height / 2,
            },
            x: this.position!.x,
            y: this.position!.y,
            rotation: this.angle,
            draggable: false,
        });

        const rect1 = new Konva.Rect({
            width: chairSize.width,
            height: chairSize.height,
            stroke: 'silver',
            strokeWidth: 4,
            fill: 'transparent',
            cornerRadius: [0, 20, 20, 0],
        });

        const rect2 = rect1.clone({
            width: 10,
        });

        this.konvaShape.add(rect2, rect1);

        tableGroup.add(this.konvaShape);
    }

    // this code runs every time draw() is called.
    drawEveryTime() {
        // Here we would apply any Konva values that are dictated by the data of the associated
        // object in the model
        this.konvaShape!.position(this.position!);
        this.konvaShape!.rotation(this.angle);
        this.konvaShape!.visible(this.visible);
    }
}
