<script setup>
import { ref, computed, watch, callWithAsyncErrorHandling } from 'vue'; // ここでcomputedをインポート
import { supabase } from '../supabase';

const props = defineProps({
  companyId: Number,
  isEditing: Boolean
});

let index    = ref();
const result = ref('');
const selectedStatus = ref('');
const companiesInfo  = ref([]);
let selectedName     = ref('');
const showSelected   = ref(true);
let firstFlag        = ref(true);

// 選考状況のオプションリスト
const optionStatus = ref([
    { id: 1, name: '内定'},
    { id: 2, name: '内々定'},
    { id: 3, name: '合格' }, 
    { id: 4, name: '不合格'}, 
]);

watch(() => props.isEditing, () =>{
  showSelected.value = !showSelected.value;
  firstFlag.value = false;
})


// 選択されたIDを取得
const selectedId = computed(() => {
  // selectedStatus.value が空の場合、または optionStatus 内に一致する項目がない場合に対応
  const selected = optionStatus.value.find(status => status.name === selectedStatus.value);
  
  if (selected) {
    selectedName.value = selected.name;
    firstFlag.value = false;
    result.value = selected.name;
    addResult();
    return selected.name;
  } else {
    return result.value;
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
  result.value = companiesInfo.value[index.value].result;
};

getCompanyInfo();

const addResult = async () => {
  const { data, error } = await supabase
    .from('CompaniesName') 
    .update({ result: selectedName.value }) 
    .eq('id', props.companyId)
    .select('id');
  
  companiesInfo.value[index.value] = data[0];
};


</script>

<template>
 
<div class="result" v-if="showSelected">
  <div v-if="result && firstFlag">{{ result }}</div>
  <div v-else-if="selectedId">{{ result }}</div>
  <div v-else>未選択</div>
  </div>
<div class="result" v-else>
  <select v-model="selectedStatus">
    <option disabled value="">選考結果</option>
    <option v-for="status in optionStatus" 
            :value="status.name" 
            :key="status.id">
      {{ status.name }}
    </option>
  </select>
</div>

</template>

<style scoped>
.result {
  display: flex;
  flex-direction: row; 
  white-space: nowrap;
}
</style>
