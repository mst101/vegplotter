import { beforeEach, describe, expect, it } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import VueKonva from 'vue-konva';
import { nextTick } from 'vue';
import VegPlot from '../VegPlot.vue';
import type { Plot, PlotConfig } from '@/types';

describe('vegPlot', () => {
    let wrapper: any;
    const plots: Plot = {
        id: 1,
        user_id: 1,
        name: 'My plot',
        width: 6,
        length: 5,
        location_name: 'Banjul',
        location_lat: 20.333,
        location_lng: 10.222,
        location_combined: 'Banjul (20.333, 10.222)',
        units: 'metres',
    };

    const config: PlotConfig = {
        SCROLLBAR_SIZE: 12,
        UNIT_PIXELS: 100,
        SIDEPANEL_WIDTH: 224,
        VERTICAL_OFFSET: 118,
        PADDING_PIXELS: 50,
    };

    const myStage = {
        width: 800,
        height: 650,
    };

    beforeEach(() => {
        wrapper = shallowMount(VegPlot, {
            props: {
                plots,
                config,
            },
            global: {
                plugins: [VueKonva],
            },
        });
    });

    it.skip('renders properly', () => {
        wrapper = shallowMount(VegPlot, { props: { plots } });
        expect(wrapper.text()).toContain('Hello Vitest');
    });

    describe('scaleDisplay=1', () => {
        it('gridGroup easily fits on stage', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots,
                },
            });
            wrapper.vm.scaleDisplay = 1;
            await nextTick();

            expect(wrapper.vm.gridConfig.width).toEqual(myStage.width);
            expect(wrapper.vm.gridConfig.height).toEqual(myStage.height);
        });

        it('gridGroup only just fits on stage', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 7.8, length: 6.3 },
                },
            });
            wrapper.vm.scaleDisplay = 1;
            await nextTick();

            expect(wrapper.vm.gridConfig.width).toEqual(myStage.width);
            expect(wrapper.vm.gridConfig.height).toEqual(myStage.height);
        });

        it('gridGroup is too big', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 10, length: 10 },
                },
            });
            wrapper.vm.scaleDisplay = 1;
            await nextTick();

            const plotWidth = wrapper.vm.plots.width * wrapper.vm.config.UNIT_PIXELS;
            const gridWidth = plotWidth + (wrapper.vm.config.PADDING_PIXELS * 2);
            expect(wrapper.vm.gridConfig.width).toEqual(gridWidth);

            const plotHeight = wrapper.vm.plots.length * wrapper.vm.config.UNIT_PIXELS;
            const gridHeight = plotHeight + (wrapper.vm.config.PADDING_PIXELS * 2);
            expect(wrapper.vm.gridConfig.height).toEqual(gridHeight);
        });
    });

    describe('scaleDisplay=0.5', () => {
        it('gridGroup easily fits on stage', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots,
                },
            });
            wrapper.vm.scaleDisplay = 0.5;
            await nextTick();

            expect(wrapper.vm.gridConfig.width).toEqual(myStage.width * 2);
            expect(wrapper.vm.gridConfig.height).toEqual(myStage.height * 2);
        });

        it('gridGroup only just fits on stage', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 15.6, length: 12.6 },
                },
            });
            wrapper.vm.scaleDisplay = 0.5;
            await nextTick();

            expect(wrapper.vm.gridConfig.width).toEqual(myStage.width * 2);
            expect(wrapper.vm.gridConfig.height).toEqual(myStage.height * 2);
        });

        it('gridGroup is too big', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 20, length: 20 },
                },
            });
            wrapper.vm.scaleDisplay = 0.5;
            await nextTick();

            const plotWidth = wrapper.vm.plots.width * wrapper.vm.config.UNIT_PIXELS;
            const gridWidth = plotWidth + (wrapper.vm.config.PADDING_PIXELS * 2);
            expect(wrapper.vm.gridConfig.width).toEqual(gridWidth);

            const plotHeight = wrapper.vm.plots.length * wrapper.vm.config.UNIT_PIXELS;
            const gridHeight = plotHeight + (wrapper.vm.config.PADDING_PIXELS * 2);
            expect(wrapper.vm.gridConfig.height).toEqual(gridHeight);
        });
    });

    describe('scaleDisplay=2', () => {
        it('gridGroup easily fits on stage', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 3, length: 2 },
                },
            });
            wrapper.vm.scaleDisplay = 2;
            await nextTick();

            expect(wrapper.vm.gridConfig.width).toEqual(myStage.width / 2);
            expect(wrapper.vm.gridConfig.height).toEqual(myStage.height / 2);
        });

        it('gridGroup only just fits on stage', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 3.8, length: 3 },
                },
            });
            wrapper.vm.scaleDisplay = 2;
            await nextTick();

            expect(wrapper.vm.gridConfig.width).toEqual(myStage.width / 2);
            expect(wrapper.vm.gridConfig.height).toEqual(myStage.height / 2);
        });

        it('gridGroup is too big', async () => {
            wrapper = shallowMount(VegPlot, {
                props: {
                    config,
                    plots: { ...plots, width: 6, length: 5 },
                },
            });
            wrapper.vm.scaleDisplay = 2;
            await nextTick();

            const plotWidth = wrapper.vm.plots.width * wrapper.vm.config.UNIT_PIXELS;
            const gridWidth = plotWidth + (wrapper.vm.config.PADDING_PIXELS * 2);
            expect(wrapper.vm.gridConfig.width).toEqual(gridWidth);

            const plotHeight = wrapper.vm.plots.length * wrapper.vm.config.UNIT_PIXELS;
            const gridHeight = plotHeight + (wrapper.vm.config.PADDING_PIXELS * 2);
            expect(wrapper.vm.gridConfig.height).toEqual(gridHeight);
        });
    });
});
