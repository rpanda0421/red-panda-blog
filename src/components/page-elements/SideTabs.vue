<template>
  <Tabs :value="onePageMode ? 0 : 1">
    <TabPane label="主导航"> 
      <slot name="start"/>
    </TabPane>
    <TabPane v-if="!props.onePageMode" label="本页导航">
      <slot name="end"/>
    </TabPane>
  </Tabs>
</template>

<script setup>
import Tabs from '@components/content/Tabs.vue'; 
import TabPane from '@components/content/Tab.vue';
const props = defineProps({
  onePageMode: Boolean
})
</script>