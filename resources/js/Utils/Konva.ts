import type { IRect } from 'konva/lib/types';

export default class Utils {
    static getUUID() {
        try {
            // try the crypto API - note this requires that the page is served via HTTPS.
            // eslint-disable-next-line no-restricted-globals
            return self.crypto.randomUUID();
        }
        // eslint-disable-next-line unused-imports/no-unused-vars
        catch (err) {
            // Apparently there is an issue with crypto so use the pseudo approach.
            return Utils.PseudoGuid();
        }
    }

    static PseudoGuid() { // Make a GUID to use in unique id assignment
        const fC = Utils.getSegment;
        return (`${fC() + fC()}-${fC()}-${fC()}-${fC()}-${fC()}${fC()}${fC()}`);
    }

    static getSegment() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase();
    }

    // given a value parameter, return true if it is an object (must not be null or array) and false otherwise
    static isObject(value: any) {
        return (
            typeof value === 'object' && value !== null && !Array.isArray(value)
        );
    }

    // Use center-center distance check for non-rotated rects.
    static hasOverlap(r1: IRect, r2: IRect) {
        // console.log('r1', r1);
        // console.log('r2', r2);
        const center1 = r1.x + r1.width / 2;
        const center2 = r2.x + r2.width / 2;
        const middle1 = r1.y + r1.height / 2;
        const middle2 = r2.y + r2.height / 2;

        return ((Math.abs(center1 - center2) <= ((r1.width + r2.width) / 2)) && (Math.abs(middle1 - middle2) <= ((r1.height + r2.height) / 2)));
    }
}
