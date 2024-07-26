<script setup lang="ts">
import { defineProps } from 'vue';

defineProps(['position', 'angle', 'chairSize']);
</script>

<template>
    <v-group :x="position.x" :y="position.y" :rotation="angle" draggable>
        <v-rect
            width="chairSize.width"
            height="chairSize.height"
            stroke="silver"
            stroke-width="4"
            fill="transparent"
            corner-radius="0, 20, 20, 0"
        />
        <v-rect
            :width="10"
            :height="chairSize.height"
            stroke="silver"
            stroke-width="4"
            fill="transparent"
            corner-radius="0, 20, 20, 0"
        />
    </v-group>
</template>
