<script setup lang="ts">
import RouterPage from "./router/RoutePage.vue";
import "bootstrap/dist/css/bootstrap.css";
import Header from './components/Header.vue'
import AdminHeader from './components/AdminHeader.vue'
const isAdmin = false;
</script>
<template>
  <div id="app">
    <Header v-if="!isAdmin"></Header>
    <AdminHeader v-if="isAdmin"></AdminHeader>
    <RouterPage class="view"></RouterPage>
  </div>
</template>