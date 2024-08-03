<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '../supabase';

const route = useRoute();
const companyInfo = ref(null);

const getCompanyInfo = async (id) => {
  let { data, error } = await supabase
    .from('CompaniesName')
    .select('*')
    .eq('id', id)
    .single();
  if (!error) {
    companyInfo.value = data;
  }
};

onMounted(() => {
  const id = route.params.id;
  getCompanyInfo(id);
});
</script>

<template>
  <div v-if="companyInfo">
    <h1>{{ companyInfo.companyName }}</h1>
    <p>Completed: {{ companyInfo.completed ? 'Yes' : 'No' }}</p>
    <!-- 他の情報もここに追加可能 -->
  </div>
  <p v-else>Loading...</p>
</template>
