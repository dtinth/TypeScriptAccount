<template>
  <div class="action-buttons action-buttons--print-hidden">
    <div v-if="standaloneMode" class="action-buttons__scenario">
      <select id="scenario-select" v-model="selectedScenarioSlug" class="action-buttons__select"
        @change="onScenarioChange">
        <option value="">— เลือกตัวอย่าง —</option>
        <option v-for="s in scenarios" :key="s.slug" :value="s.slug">{{ s.title }}</option>
      </select>
    </div>

    <button type="button" class="action-buttons__button action-buttons__button--primary" @click="handlePrint">
      🖨️ พิมพ์เอกสาร
    </button>
    <button type="button" class="action-buttons__button action-buttons__button--secondary" @click="handleCopyJson">
      📋 คัดลอก JSON
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { scenarios } from '../utils/scenarios'

interface Props {
  record: GristRecord | null
  rawGristData: unknown
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'load-scenario', data: GristRecord): void }>()

const selectedScenarioSlug = ref('')

const standaloneMode = computed(() => {
  const url = new URLSearchParams(window.location.search)
  const forcedStandalone = url.has('standalone')
  const notEmbedded = window.parent === window.self
  return forcedStandalone || notEmbedded
})

function handlePrint() {
  window.print()
}

function handleCopyJson() {
  if (props.rawGristData) {
    navigator.clipboard
      .writeText(JSON.stringify(props.rawGristData, null, 2))
      .then(() => {
        alert('JSON ถูกคัดลอกแล้ว')
      })
      .catch((err) => {
        console.error('Failed to copy JSON:', err)
        alert('ไม่สามารถคัดลอก JSON ได้')
      })
  }
}

function onScenarioChange() {
  const s = scenarios.find((x) => x.slug === selectedScenarioSlug.value)
  if (s) emit('load-scenario', s.data)
}
</script>

<style>
.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  justify-content: center;
}

.action-buttons__scenario {
  display: flex;
  align-items: center;
}

.action-buttons__select {
  padding: var(--button-padding);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-light);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  background: white;
}

.action-buttons__button {
  padding: var(--button-padding);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-family);
}

.action-buttons__button--primary {
  background-color: var(--primary-blue);
  color: white;
}

.action-buttons__button--primary:hover {
  background-color: var(--primary-blue-dark);
}

.action-buttons__button--secondary {
  background-color: var(--secondary-gray);
  color: white;
}

.action-buttons__button--secondary:hover:not([disabled]) {
  background-color: var(--secondary-gray-dark);
}

.action-buttons__button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

@media print {
  .action-buttons--print-hidden {
    display: none !important;
  }
}
</style>
