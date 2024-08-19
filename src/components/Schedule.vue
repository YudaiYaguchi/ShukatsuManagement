<script setup>
import { ref, computed, watch, callWithAsyncErrorHandling } from 'vue'; // ここでcomputedをインポート
import { supabase } from '../supabase';

const props = defineProps({
  companyId: Number,
  isEditing: Boolean
});


// 選択された選考状況
const selectedStatus = ref('');
const showSelected = ref(true);
const schedule = ref('');
let index = ref();
const companiesInfo = ref([]);
let firstFlag = ref(true);
let selectedName = ref('');

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
  firstFlag.value = false;
})


// 選択されたIDを取得
const selectedId = computed(() => {
  // selectedStatus.value が空の場合、または optionStatus 内に一致する項目がない場合に対応
  const selected = optionStatus.value.find(status => status.name === selectedStatus.value);
  console.log('selectedName:',selectedName.value)
  if (selected) {
    selectedName.value = selected.name;
    // console.log(selected.name);
    firstFlag.value = false;
    addSchedule();
    return selected.name;
  } else {
    return null;
  }
});



const getCompanyInfo = async () => {
  let { data, error} = await supabase.from('CompaniesName').select('*');
  if (error) {
    console.error("Error fetching company info:", error);
    return;
  }
  companiesInfo.value = data;
  index.value = companiesInfo.value.findIndex((company) => company.id === props.companyId);
  schedule.value = companiesInfo.value[index.value].schedule;
  console.log(schedule.value)
//  console.log('getCompanyInfo:', companiesInfo.value);
};

getCompanyInfo();

const addSchedule = async () => {
  const { data, error } = await supabase
    .from('CompaniesName') // テーブル名のキャピタライゼーションに注意
    .update({ schedule: selectedName.value }) // "calendar" フィールドを更新
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
  <div v-else-if="selectedId">{{ selectedId }}</div>
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
}
</style>
