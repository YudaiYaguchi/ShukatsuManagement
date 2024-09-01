<script setup>
import { ref, computed, watch, callWithAsyncErrorHandling } from 'vue'; // ここでcomputedをインポート
import { supabase } from '../supabase';
import StarRating from 'vue-star-rating';

const props = defineProps({
  id: Number,
  isEditing: Boolean
});



// 選択された選考状況
const selectedStatus = ref('');
const showSelected = ref(true);
const interview = ref('');
let index = ref();
const companiesInfo = ref([]);
let firstFlag = ref(true);
let selectedName = ref('');
let editFlag = ref(false);


// 選考状況のオプションリスト
const optionStatus = ref([
  { id: 1, name: '合格' }, 
  { id: 2, name: '不合格'}, 
]);



// 選択されたIDを取得
const selectedId = computed(() => {
  // selectedStatus.value が空の場合、または optionStatus 内に一致する項目がない場合に対応
  const selected = optionStatus.value.find(status => status.name == selectedStatus.value);
  // console.log('selectedName:',selectedName.value)
  if (selected) {
    selectedName.value = selected.name;
    // console.log(selected.name);
    firstFlag.value = false;
    interview.value = selected.name;
    // console.log('interview:',interview.value)
    addInterview();
    return selected.name;
  } else {
    return interview.value;
  }
});



const getCompanyInfo = async () => {
  let { data, error} = await supabase.from('CompaniesName').select('*');
  if (error) {
    console.error("Error fetching company info:", error);
    return;
  }
  companiesInfo.value = data;
  index.value = companiesInfo.value.findIndex((company) => company.id == props.id);
  console.log('index:',index.value ,'props.id:',props.id)
  interview.value = companiesInfo.value[index.value].interview;
  console.log(interview.value)
  // console.log('getCompanyInfo:', companiesInfo.value);
  // console.table(companiesInfo.value)
};

getCompanyInfo();

const addInterview = async () => {
  // console.log("addInterview")
  const { data, error } = await supabase
    .from('CompaniesName') // テーブル名のキャピタライゼーションに注意
    .update({ interview: selectedName.value }) 
    .eq('id', props.id)
    .select('id');
  
  if (error) {
    console.error("Error adding interview:", error);
    return;
  }
  // 取得したデータを正しい方法で更新
  companiesInfo.value[index.value] = data[0];
};

const edit = () => {
  editFlag.value = !editFlag.value;
  showSelected.value = !showSelected.value;
  interview.value = selectedName.value;
  addInterview();
}

</script>

<template>
  
<div class="form-container">
   
    <div class="rating-container">
    <h3>面接自己評価：</h3>
    <star-rating
      v-model="rate"
      :increment="0.5"
      :max-rating="5"
      inactive-color="#000"
      active-color="rgb(211, 247, 10)"
      :star-size="30"
      :show-rating="true"
      :rating="rating"
    ></star-rating>
    <input type="hidden" name="score" :value="rating" />
 
  </div>


<div class="interview" v-if="showSelected">
  選考結果：
  <div v-if="interview && firstFlag">{{ interview }}</div>
  <div v-else-if="selectedId">{{ interview }}</div>
  <div v-else>未選択</div>
  <button class="textRight" @click="edit" style="float: right;">{{ editFlag ? '完了' : '編集' }}</button>
  </div>
<div class="interview" v-else>
  選考結果：
  <select v-model="selectedStatus">
    <option disabled value="">選考結果</option>
    <option v-for="status in optionStatus" 
            :value="status.name" 
            :key="status.id">
      {{ status.name }}
    </option>
  </select>
  <button class="textRight" @click="edit" style="float: right;">{{ editFlag ? '完了' : '編集' }}</button>
</div>




    <form>
      <div class="form-group">
        <label for="interviewContent">面接内容</label>
        <textarea id="interviewContent" v-model="interviewContent" class="input-box"></textarea>
      </div>

      <div class="form-group">
        <label for="selfEvaluation">面接自己評価</label>
        <textarea id="selfEvaluation" v-model="selfEvaluation" class="input-box"></textarea>
      </div>

      <div class="form-group">
        <label for="reflection">反省点</label>
        <textarea id="reflection" v-model="reflection" class="input-box"></textarea>
      </div>
    </form>
  </div>

</template>

<style scoped>
.interview {
  display: flex;
  /* flex-direction: row; Flex items を一行に並べる */
  /* white-space: nowrap; 改行を防ぐ */
}
</style>

  
  <style scoped>
 .textRight {
  justify-self: end; /* ボタンを右端に配置 */
}


.form-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  margin: 0 auto;
}

h2 {
  color: #007BFF; /* 青色 */
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  color: #0056b3; /* 青色 */
  margin-bottom: 5px;
  display: block;
}

.input-box {
  width: 100%;
  padding: 10px;
  border: 2px solid #007BFF; /* 青色 */
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: #f9f9f9; /* 淡い背景色 */
}

.input-box:focus {
  outline: none;
  border-color: #0056b3; /* 濃い青色 */
  background-color: #e7f3ff; /* フォーカス時の背景色 */
}

.submit-button {
  background-color: #007BFF; /* 青色 */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3; /* ホバー時の濃い青色 */
}

  </style>
  
  