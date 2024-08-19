<script setup>
import { ref, watch, computed, ReactiveEffect } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { supabase } from '../supabase';

// props を使って親コンポーネントから渡された情報を受け取る
const props = defineProps({
  companyId: Number,
  isEditing: Boolean
});


let currentFlag = true;
let index = ref(-1);
const companiesInfo = ref([]);
const date = ref(new Date());
const showDate = ref(true); 
const firstFlag = ref(true);
const defaultText = ref('未選択');
const calendar = ref(''); 
let currentDate = ref('');
let dateText = computed(() => date.value.toLocaleString('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}));

// 編集状態が変更されたときに表示を切り替える
watch(() => props.isEditing, () => {
    showDate.value = !showDate.value;
    //calendar.value = null;
    if(currentFlag){//編集ボタンが押された時に現在時刻を保存
    currentDate.value = dateText.value;
    currentFlag = false;
    }else{//完了ボタンが押され時の処理
    addCalendar();
    currentFlag = true;
    }

  });

const getCompanyInfo = async () => {
  let { data, error, status } = await supabase.from('CompaniesName').select('*');
  if (error) {
    console.error("Error fetching company info:", error);
    return;
  }
  companiesInfo.value = data;
  index.value = companiesInfo.value.findIndex((company) => company.id === props.companyId);
  calendar.value = companiesInfo.value[index.value].calendar;
  console.log(calendar.value)
//  console.log('getCompanyInfo:', companiesInfo.value);
};



getCompanyInfo();

const addCalendar = async () => {
  // console.log('currentDate:',currentDate.value);
  // console.log('dateText:',dateText.value) 
  if(currentDate.value != dateText.value){
  const { data, error } = await supabase.from('CompaniesName').update([{ calendar: dateText.value }]).eq('id', props.companyId).select('id');
  companiesInfo.value.unshift(data[0]);
  calendar.value = dateText.value;
  firstFlag.value = false;

  if (error) {
    console.error("Error adding calendar:", error);
    return;
  }
  }
};
</script>

<template>

  <div class="calendar">
    <li v-if="showDate && calendar">{{ calendar }}-</li>
    <li v-else-if="showDate && firstFlag">{{ defaultText }}</li>
    <li v-else-if="showDate">{{ dateText }}-</li>
    <Datepicker v-else v-model="date"></Datepicker>
  </div>
</template>

<style scoped>
.calendar {
  width: 75%;
}

.calendar li {
  padding-top: 0px;
}
</style>
