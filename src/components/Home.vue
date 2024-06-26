<template>
  <div class="container">
    <h1>My Surveys</h1>
    <div class="col-lg-12">
      <SurveyList :user="user"></SurveyList>
    </div>
  </div>
</template>
<style>
.jumbotron ul {
  font-size: 21px;
}
</style>
<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import SurveyList from "@/components/SurveyList.vue";
const store = useStore();
const user = computed(() => store.state.user);

</script>