<template>
  <header class="document-header">
    <div class="document-header__provider">
      <h1 class="document-header__provider-name">{{ record.Record.Provider.Name }}</h1>
      <div class="document-header__provider-details">
        <div class="document-header__address">
          {{ trimAddress(record.Record.Provider.Address) }}
        </div>
        <div v-if="record.Record.Provider.Email" class="document-header__email">
          อีเมล: {{ record.Record.Provider.Email }}
        </div>
        <div class="document-header__tax-id">
          เลขประจำตัวผู้เสียภาษี: {{ record.Record.Provider.Tax_ID }}
        </div>
      </div>
    </div>

    <div class="document-header__info">
      <h2 class="document-header__type">
        {{ getDocumentTypeInThai(record.Record.Document_Type[0]) }}
      </h2>
      <div class="document-header__details">
        <div class="document-header__number">เลขที่: {{ record.Record.Number }}</div>
        <div class="document-header__date">วันที่: {{ formatDate(record.Record.Date) }}</div>
        <div v-if="viewModel.reference.number" class="document-header__reference">
          อ้างอิง: {{ viewModel.reference.number }}
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { formatDate, getDocumentTypeInThai } from '../utils/document'
import { getViewModel } from '../utils/view-model'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const viewModel = computed(() => {
  return getViewModel(props.record)
})

function trimAddress(address: string): string {
  return address.trim()
}
</script>

<style>
.document-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
}

.document-header__provider {
  flex: 1;
}

.document-header__provider-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.document-header__provider-details {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
  color: var(--text-secondary);
}

.document-header__address {
  margin-bottom: var(--spacing-xs);
  white-space: pre-line;
}

.document-header__email,
.document-header__tax-id {
  margin-bottom: var(--spacing-xs);
}

.document-header__info {
  text-align: right;
  flex-shrink: 0;
}

.document-header__type {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.document-header__details {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.document-header__number,
.document-header__date,
.document-header__reference {
  margin-bottom: var(--spacing-xs);
}
</style>
