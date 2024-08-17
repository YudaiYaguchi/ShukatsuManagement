<script setup>
import { ref,  watch, computed } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// props を使って親コンポーネントから渡された情報を受け取る
const props = defineProps({
  companyId: Number,
  isEditing: Boolean
});

const date = ref(new Date());
const showDate = ref(true); 
const defaultText = ref('未選択');
const dateText = computed(() => date.value.toLocaleString('ja-JP', {
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
});
</script>

<template>
  <div class="calendar">
    <li v-if="showDate">{{ dateText }} -</li>
    <Datepicker v-else v-model="date"></Datepicker>
  </div>
</template>


<style scoped>
.calendar {
  width: 75%;
}

.calendar li{
  padding-top: 7px;
}
</style>