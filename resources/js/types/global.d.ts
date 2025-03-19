import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import type { AxiosInstance } from 'axios';
import type { route as ziggyRoute } from 'ziggy-js';
import type Konva from 'konva';
import type { PageProps as AppPageProps } from './';
import type Model from '@/types';
import type UndoStackOld from '@/Utils/UndoStackOld';

declare global {
    var model: Model;
    var undoStack: UndoStackOld;
    var transformer: Konva.Transformer;

    interface Window {
        axios: AxiosInstance;
    }

    const route: typeof ziggyRoute;
}

declare module 'vue' {
    interface ComponentCustomProperties {
        route: typeof ziggyRoute;
    }
}

declare module '@inertiajs/core' {
    interface PageProps extends InertiaPageProps, AppPageProps {}
}
