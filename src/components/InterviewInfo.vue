<script setup>
import { ref, computed, watch, callWithAsyncErrorHandling } from 'vue'; // ここでcomputedをインポート
import { supabase } from '../supabase';

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
let content = ref('');
let evaluation = ref('')
let reflection = ref('')
let rate = ref(0);


const textInfo = ref([
  {id: 1, text: null, message: '面接で聞かれた内容を入力してください。'},
  {id: 2, text: null, message: '面接での自己評価を入力してください。'},
  {id: 3, text: null, message: '面接での反省点を入力してください。'},
]);

// 選考状況のオプションリスト
const optionStatus = ref([
  { id: 1, name: '合格' }, 
  { id: 2, name: '不合格'}, 
]);


// 変化を監視してコンソールに出力
watch(rate, () => {
  addRate();
});


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
  content.value = companiesInfo.value[index.value].content;
  evaluation.value = companiesInfo.value[index.value].evaluation;
  reflection.value = companiesInfo.value[index.value].reflection;
  rate.value = companiesInfo.value[index.value].rate;
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

const addContent = async (event) => {
  event.preventDefault();
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ content: content.value })
    .eq('id', props.id)
    .select('*');

  if (error) {
    console.error('Error updating company ES:', error);
  } else {
    console.log('Updated record:', data);
  }
  console.log('rate:',rate.value)
  companiesInfo.value[index.value] = data[0];
};


const addEvaluation = async (event) => {
  event.preventDefault();
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ evaluation: evaluation.value })
    .eq('id', props.id)
    .select('*');

  if (error) {
    console.error('Error updating company ES:', error);
  } else {
    console.log('Updated record:', data);
  }

  companiesInfo.value[index.value] = data[0];
};


const addReflection = async (event) => {
  event.preventDefault();
  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ reflection: reflection.value })
    .eq('id', props.id)
    .select('*');

  if (error) {
    console.error('Error updating company ES:', error);
  } else {
    // console.log('Updated record:', data);
  }
  companiesInfo.value[index.value] = data[0];
};

const addRate = async (event) => {

  const { data, error } = await supabase
    .from('CompaniesName')
    .update({ rate: rate.value })
    .eq('id', props.id)
    .select('*');

  companiesInfo.value[index.value] = data[0];
};
</script>

<template>
  
  <div class="form-container">
    <div class="rating-container">
      <h3>面接自己評価：</h3>
      <div class="stars" >
      <span 
        v-for="n in 5" 
        :key="n" 
        @click="rate = n"
        :style="{ color: n <= rate ? 'gold' : 'gray', cursor: 'pointer',fontSize: '25px' }"
      >
        ★
      </span>
    </div>
    <input type="hidden" name="score" :value="rate" />
    {{ rate }}
    </div>  

    <form>
      <label for="interviewContent">面接内容</label>
        <div class="form-group" v-if="companiesInfo.content != null">
          <textarea 
            @input="addContent" 
            id="interviewContent" 
            v-model="content" 
            :placeholder="textInfo[0].message"
            class="input-box">
          </textarea>
        </div>
        <div v-else>
          <textarea 
            @input="addContent" 
            id="interviewContent" 
            v-model="content"  
            :placeholder="textInfo[0].message"
            class="input-box">
          </textarea>
        </div>
      <div class="form-group" v-if="companiesInfo.evaluation">
        <label for="selfEvaluation">面接自己評価</label>
        <textarea @input="addEvaluation" :placeholder="textInfo[1].message" id="selfEvaluation" v-model="evaluation" class="input-box"></textarea>
      </div>
      <div v-else>
        <label for="selfEvaluation">面接自己評価</label>
        <textarea @input="addEvaluation" :placeholder="textInfo[1].message" id="selfEvaluation" v-model="evaluation" class="input-box"></textarea>
      </div>

      <div class="form-group" v-if="companiesInfo.reflection">
        <label for="reflection">反省点</label>
        <textarea @input="addReflection" :placeholder="textInfo[2].message" id="reflection"  v-model="reflection" class="input-box"></textarea>
      </div>
      <div v-else>
        <label for="reflection">反省点</label>
        <textarea @input="addReflection" :placeholder="textInfo[2].message" id="reflection"  v-model="reflection" class="input-box"></textarea>
      </div>
    </form>
  </div>
</template>

<style scoped>
.interview {
  display: flex;
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
  
  