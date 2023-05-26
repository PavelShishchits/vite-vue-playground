<script setup lang="ts">
import { useFetch } from '@vueuse/core';
const modules = import.meta.glob('@/modules/*.ts', { import: 'default'});

console.log(modules);
for (const path in modules) {
    modules[path]().then((mod: any) => {        
        mod();
        setTimeout(() => {
            // mod();
        }, 3000)
    });
}

type Product = {
    id: string;
    title: string;
    price: string;
}

const { data: products, execute } = useFetch<Product[]>('https://fakestoreapi.com/products', { immediate: false })
    .get()
    .json<Product[]>();

execute();


</script>

<template>
    Recipie List Page
    <ul class="recipie-list">
        <li
            v-for="product in products"
            :key="product.id"
            class="recipie-list__item"
        >
            <div>{{ product.title }}</div>
            <div>{{ product.price }}</div>
        </li>
    </ul>
</template>

<style scoped lang="scss">
.recipie-list {
    
    &__item {
        margin-bottom: 5px;
    }
}
</style>