<template>
  <div class="action-buttons action-buttons--print-hidden">
    <button
      type="button"
      class="action-buttons__button action-buttons__button--primary"
      @click="handlePrint"
    >
      🖨️ พิมพ์เอกสาร
    </button>
    <button
      type="button"
      class="action-buttons__button action-buttons__button--secondary"
      @click="handleCopyJson"
    >
      📋 คัดลอก JSON
    </button>
  </div>
</template>

<script setup lang="ts">
import type { GristRecord } from '../types/document-schema'

interface Props {
  record: GristRecord | null
}

const props = defineProps<Props>()

function handlePrint() {
  window.print()
}

function handleCopyJson() {
  if (props.record) {
    navigator.clipboard
      .writeText(JSON.stringify(props.record, null, 2))
      .then(() => {
        alert('JSON ถูกคัดลอกแล้ว')
      })
      .catch((err) => {
        console.error('Failed to copy JSON:', err)
        alert('ไม่สามารถคัดลอก JSON ได้')
      })
  }
}
</script>

<style>
.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  justify-content: center;
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

.action-buttons__button--secondary:hover {
  background-color: var(--secondary-gray-dark);
}

@media print {
  .action-buttons--print-hidden {
    display: none !important;
  }
}
</style>
