export function useKonva() {
    function getUUID() {
        try {
            return self.crypto.randomUUID();
        }
        catch (err) {
            return pseudoGuid();
        }
    }

    function pseudoGuid() {
        const fC = getSegment;
        return `${fC() + fC()}-${fC()}-${fC()}-${fC()}-${fC()}${fC()}${fC()}`;
    }

    function getSegment() {
        return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1).toUpperCase();
    }

    function isObject(value: any) {
        return (
            typeof value === 'object' && value !== null && !Array.isArray(value)
        );
    }

    function hasOverlap(r1: any, r2: any) {
        const center1 = r1.x + r1.width / 2;
        const center2 = r2.x + r2.width / 2;
        const middle1 = r1.y + r1.height / 2;
        const middle2 = r2.y + r2.height / 2;

        return (
            (Math.abs(center1 - center2) <= ((r1.width + r2.width) / 2))
            && (Math.abs(middle1 - middle2) <= ((r1.height + r2.height) / 2))
        );
    }

    return {
        getUUID,
        hasOverlap,
        isObject,
    };
}
