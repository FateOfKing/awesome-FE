<template>
    <div class="scroll-container" v-size-ob="handleChange">
        <div class="v-scroll">
            <div class="content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import vSizeOb from '../sizeDirective';

import { reactive } from 'vue';

const s = reactive({
    width: 0,
    height: 0,
});
function handleChange(size: any) {
    s.width = size.width;
    s.height = size.height;
    console.log(size)
}
</script>

<style scoped>
.scroll-container {
    outline: 4px solid red;
    width: 100%;
    height: 100%;
}

.v-scroll {
    width: calc(v-bind('s.height') * 1px);
    height: calc(v-bind('s.width') * 1px);
    outline: 4px solid yellow;
    position: relative;
    overflow: auto;
    transform-origin: 0 0;
    transform: translateY(calc(v-bind('s.height') * 1px)) rotate(-90deg);
}

.content {
    height: calc(v-bind('s.height') * 1px);
    position: absolute;
    left: 100%;
    outline: 1px solid blue;
    transform-origin: 0 0;
    transform: rotate(90deg);
}
</style>