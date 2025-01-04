<template>
  <div class="box">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>
<style >
/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
* {
  padding: 0;
  margin: 0;
}
</style>
