<script setup>
import { ref, computed, watch } from 'vue'; // ここでcomputedをインポート

const props = defineProps({
  isEditing: Boolean
});


// 選択された選考状況
const selectedStatus = ref('');
const showSelected = ref(true);



// 選考状況のオプションリスト
const optionStatus = ref([
  { id: 1, name: '説明会' }, 
  { id: 2, name: 'ES (エントリーシート)' }, 
  { id: 3, name: 'webテスト(適性検査)' }, 
  { id: 4, name: '一次面接'},
  { id: 5, name: '二次面接'},
  { id: 6, name: '三次面接'},
  { id: 7, name: '四次面接'},
  { id: 8, name: '最終面接'},
  { id: 9, name: '内々定'},
  { id: 10, name: '内定'}
]);

watch(() => props.isEditing, () =>{
  showSelected.value = !showSelected.value;
})


// 選択されたIDを取得
const selectedId = computed(() => {
  const selected = optionStatus.value.find(status => status.name === selectedStatus.value);
  return selected ? selected.name : null;
});
</script>

<template>
 
<div class="schedule" v-if="showSelected">
  <!-- <li v-if="status.name">{{ status.name }}</li>
  <li v-else>未選択</li> -->
  <div v-if="selectedId">{{ selectedId }}</div>
  <div v-else>未選択</div>
  </div>
<div class="schedule" v-else>
  <select v-model="selectedStatus">
    <option disabled value="">選考状況</option>
    <option v-for="status in optionStatus" 
            :value="status.name" 
            :key="status.id">
      {{ status.name }}
    </option>
  </select>
</div>

</template>

<style scoped>
.schedule {
  display: flex;
  flex-direction: row; /* Flex items を一行に並べる */
  white-space: nowrap; /* 改行を防ぐ */
  gap: 10px; /* 要素間の間隔 */
}
/* スタイルをここに追加 */
</style>
