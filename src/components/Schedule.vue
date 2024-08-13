<script setup>
import { ref } from 'vue';

// 選択された選考状況
const selectedStatus = ref('');

// 選考状況のオプションリスト
const optionStatus = ref([
  { id: 1, name: '説明会' }, 
  { id: 2, name: 'ES (エントリーシート)' }, 
  { id: 3, name: 'webテスト(適性検査)' }, // 追加オプションの例
  { id: 4, name: '一次面接'},
  { id: 5, name: '二次面接'},
  { id: 6, name: '三次面接'},
  { id: 7, name: '四次面接'},
  { id: 8, name: '最終面接'},
  { id: 9, name: '内々定'},
  { id: 10, name: '内定'}
]);
</script>

<template>
  <select v-model="selectedStatus">
    <option disabled value="">選考状況</option>
    <option v-for="status in optionStatus" 
            :value="status.name" 
            :key="status.id">
      {{ status.name }}
    </option>
  </select>
</template>

<style scoped>
/* スタイルをここに追加 */
</style>
