<script setup>
import { ref, computed, watch, callWithAsyncErrorHandling } from 'vue'; // ここでcomputedをインポート
import { supabase } from '../supabase';

const props = defineProps({
  companyId: Number,
  isEditing: Boolean
});


let index      = ref();
const schedule = ref('');
const selectedStatus = ref('');
const companiesInfo  = ref([]);
let selectedName     = ref('');
const showSelected = ref(true);
let firstFlag      = ref(true);

// 選考状況のオプションリスト
const optionStatus = ref([
  { id: 1, name: '説明会' }, 
  { id: 2, name: '面談'},
  { id: 3, name: 'ES (エントリーシート)' }, 
  { id: 4, name: 'webテスト(適性検査)' }, 
  { id: 5, name: '一次面接'},
  { id: 6, name: '二次面接'},
  { id: 7, name: '三次面接'},
  { id: 8, name: '四次面接'},
  { id: 9, name: '最終面接'},
]);

watch(() => props.isEditing, () =>{
  showSelected.value = !showSelected.value;
  firstFlag.value = false;
})



const selectedId = computed(() => {
  const selected = optionStatus.value.find(status => status.name === selectedStatus.value);

  if (selected) {
    selectedName.value = selected.name;
    firstFlag.value = false;
    schedule.value = selected.name;
    addSchedule();
    return selected.name;
  } else {
    return schedule.value;
  }
});



const getCompanyInfo = async () => {
  let { data, error} = await supabase.from('CompaniesName').select('*');

  companiesInfo.value = data;
  index.value = companiesInfo.value.findIndex((company) => company.id === props.companyId);
  schedule.value = companiesInfo.value[index.value].schedule;
};

getCompanyInfo();

const addSchedule = async () => {
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ schedule: selectedName.value })
    .eq('id', props.companyId)
    .select('id');
  
  if (error) {
    console.error("Error adding schedule:", error);
    return;
  }
  // 取得したデータを正しい方法で更新
  companiesInfo.value[index.value] = data[0];
};


</script>

<template>
 
<div class="schedule" v-if="showSelected">
  <div v-if="schedule && firstFlag">{{ schedule }}</div>
  <div v-else-if="selectedId">{{ schedule }}</div>
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
  flex-direction: row; 
  white-space: nowrap;
}
</style>
