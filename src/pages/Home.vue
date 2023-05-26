<script setup lang="ts">
import pic from '@/assets/tshirt.jpg'
console.log(import.meta.env);
</script>

<template>

    <img src="/vite.svg" alt="logo" /> 
    <img :src="pic" alt="tshirt"/>
    Home Page
</template>