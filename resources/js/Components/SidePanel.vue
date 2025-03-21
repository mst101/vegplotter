<script setup lang="ts">
import { ref } from 'vue';
import MenuBed from '@/Components/MenuBed.vue';
import MenuSettings from '@/Components/MenuSettings.vue';
import MenuStructure from '@/Components/MenuStructure.vue';
import MenuPlant from '@/Components/MenuPlant.vue';

const currentPanel = ref('MenuSettings');
</script>

<template>
    <div class="flex flex-col">
        <div class="flex justify-between">
            <a href="#" @click="currentPanel = 'MenuStructure'"><img
                id="structureMenuButton"
                alt="Activate Structures Layer &amp; show Add Structures menu"
                class="size-12"
                src="/images/newstructure.png"
                title="Activate Structures Layer &amp; show Add Structures menu"
            ></a>
            <a href="#" @click="currentPanel = 'MenuBed'"><img
                id="bedMenuButton"
                alt="Activate Beds Layer &amp; show Add Beds menu"
                class="size-12"
                src="/images/newbed.png"
                title="Activate Beds Layer &amp; show Add Beds menu"
            ></a>
            <a href="#" @click="currentPanel = 'MenuPlant'"><img
                id="plantMenuButton"
                alt="Activate Plants Layer &amp; show Add plants menu"
                class="size-12"
                src="/images/newplant.png"
                title="Activate Plants Layer &amp; show Add plants menu"
            ></a>
            <a href="#" @click="currentPanel = 'MenuSettings'"><img
                id="plotMenuButton"
                alt="Show Plot Settings menu"
                class="size-12"
                src="/images/cogicon.png"
                title="Show Plot Settings menu"
            ></a>
        </div>
        <div>
            <MenuStructure v-show="currentPanel === 'MenuStructure'" />
            <MenuBed v-show="currentPanel === 'MenuBed'" />
            <MenuPlant v-show="currentPanel === 'MenuPlant'" />
            <MenuSettings v-show="currentPanel === 'MenuSettings'" />
        </div>
    </div>
</template>

<style scoped>

</style>
