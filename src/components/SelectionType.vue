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
const selectionType = ref('');
let index = ref();
const companiesInfo = ref([]);
let firstFlag = ref(true);
let selectedName = ref('');

// 選考状況のオプションリスト
const optionStatus = ref([
  { id: 1, name: '本選考' }, 
  { id: 2, name: '早期選考'},
  { id: 3, name: 'インターン' }, 
]);

watch(() => props.isEditing, () =>{
  showSelected.value = !showSelected.value;
  firstFlag.value = false;
})


// 選択されたIDを取得
const selectedId = computed(() => {
  // selectedStatus.value が空の場合、または optionStatus 内に一致する項目がない場合に対応
  const selected = optionStatus.value.find(status => status.name === selectedStatus.value);
  // console.log('selectedName:',selectedName.value)
  if (selected) {
    selectedName.value = selected.name;
    // console.log(selected.name);
    firstFlag.value = false;
    selectionType.value = selected.name;
    addSelectionType();
    return selected.name;
  } else {
    return selectionType.value;
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
  selectionType.value = companiesInfo.value[index.value].selection_type;
};

getCompanyInfo();

const addSelectionType = async () => {
  const { data, error } = await supabase
    .from('CompaniesName') 
    .update({ selection_type: selectedName.value }) 
    .eq('id', props.companyId)
    .select('id');
  
  if (error) {
    console.error("Error adding selection_type:", error);
    return;
  }
  companiesInfo.value[index.value] = data[0];
};


</script>

<template>
 
<div class="selectionType" v-if="showSelected">
  <div v-if="selectionType && firstFlag">{{ selectionType }}</div>
  <div v-else-if="selectedId">{{ selectionType }}</div>
  <div v-else>未選択</div>
  </div>
<div class="selectionType" v-else>
  <select v-model="selectedStatus">
    <option disabled value="">選考種類</option>
    <option v-for="status in optionStatus" 
            :value="status.name" 
            :key="status.id">
      {{ status.name }}
    </option>
  </select>
</div>

</template>

<style scoped>
.selectionType {
  display: flex;
  flex-direction: row; /* Flex items を一行に並べる */
  white-space: nowrap; /* 改行を防ぐ */
}
</style>
