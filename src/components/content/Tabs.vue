// Tabs.vue
<template>
  <div class="tabs w-full h-full">
    <div class="tabs-nav-wrap flex flex-row rounded-full">
      <div class="tabs-tab rounded-full text-center text-xl font-bold" :class="{ active: activeKey == index }"
        v-for="(item, index) in navList" @click="updateActiveKey(index)" :key="index">
        {{ item.label }}
      </div>
    </div>
    <div class="tabs-content">
      <!-- <slot></slot> -->
      <Transition name="fade" mode="out-in">
        <component :key="activeKey" :is="activeTab" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
import Tab from "./Tab.vue";
import { ref, onMounted, computed } from "vue";
const props = defineProps({
  value: { type: [String, Number], default: 0 }
});

const slots = defineSlots();
const tabItems = ref([]);
const activeKey = ref(props.value);
const navList = computed(() => {
  return tabItems.value.map((tab, index) => {
    const label = tab.props.label
    return { label, index }
  })
});
const activeTab = computed(() => {
  return tabItems.value.at(activeKey.value) || 'div'
})
const getTabs = () => {
  const defaults = slots.default()
  return defaults.filter(child => child.type === Tab);
}
const updateTabs = () => {
  tabItems.value = getTabs();

}
const updateActiveKey = (key) => {
  activeKey.value = key
}
onMounted(() => {
  updateTabs();
})
</script>

<style scoped>
.tabs {
  padding-block-start: 16px;
  padding-inline: 8px;
}

.tabs-nav-wrap {
  position: relative;
  background-color: var(--s-color-surface-variant);
  color: var(--s-color-on-surface-variant);
  z-index: 1;
}

.tabs-tab {
  position: relative;
  flex-grow: 1;
  cursor: pointer;
  padding: .75rem .3rem;
}

.tabs-tab::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transform: scaleX(0.32);
  transition:
    opacity 0.2s ease-in, transform 0.2s ease-in;
  z-index: -1;
  border-radius: 999px;
  background-color: var(--s-color-tertiary-container);
}

.tabs-tab.active::before {
  opacity: 1;
  transform: scaleX(1);
}

.tabs-tab.active {
  color: var(--s-color-on-tertiary-container);
}

.tabs-tab:hover {
  color: var(--s-color-on-surface);
  background-color: rgba(var(--s-color-surface-container-highest-rgb), .5);
  
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>