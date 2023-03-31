<script setup lang="ts">
import XScroll from './components/XScroll.vue';
</script>

<template>
  <div style="width:100%;height:100%">
    <XScroll>
      <div class="card-list">
        <img class="card" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" />
        <img class="card" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" />
        <img class="card" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" />
        <img class="card" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" />
        <img class="card" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" />
        <img class="card" src="https://t7.baidu.com/it/u=4162611394,4275913936&fm=193&f=GIF" />

      </div>
    </XScroll>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.card-list {
  display: flex;
}

.card {
  display: block;
  height: 500px;
}
</style>
