<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  label: {
    type: [String, Function],
    default: ''
  }
});
</script>