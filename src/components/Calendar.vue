<script setup>
import { ref } from 'vue'
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const date = ref(new Date())
</script>

<template>
  <div class="calrendar"> <Datepicker v-model="date"></Datepicker></div>
</template>

<style scoped>
.calrendar{
    
    width: 75%;
}
</style>