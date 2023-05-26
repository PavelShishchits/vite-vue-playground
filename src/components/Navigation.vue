<script setup lang="ts">

</script>

<template>
    <div class="logo"></div>
    <router-link to="/">Home</router-link>
    <router-link to="/recipies">Recipie List</router-link>
</template>    

<style scoped lang="scss">
.logo {
    background-image: url('@/assets/vue.svg');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    width: 50px;
    height: 50px;
}

</style>