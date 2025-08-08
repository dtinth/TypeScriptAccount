<template>
  <header class="document-header">
    <div class="document-header__provider">
      <h1 class="document-header__provider-name">{{ record.Record.Provider.Name }}</h1>
      <div class="document-header__provider-details">
        <div class="document-header__address">{{ formatAddress(record.Record.Provider.Address) }}</div>
        <div v-if="record.Record.Provider.Email" class="document-header__email">
          อีเมล: {{ record.Record.Provider.Email }}
        </div>
        <div class="document-header__tax-id">เลขประจำตัวผู้เสียภาษี: {{ record.Record.Provider.Tax_ID }}</div>
      </div>
    </div>

    <div class="document-header__info">
      <h2 class="document-header__type">{{ getDocumentTypeInThai(record.Record.Document_Type[0]) }}</h2>
      <div class="document-header__details">
        <div class="document-header__number">เลขที่: {{ record.Record.Number }}</div>
        <div class="document-header__date">วันที่: {{ formatDate(record.Record.Date) }}</div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { GristRecord } from '../types/document-schema';
import { formatDate, getDocumentTypeInThai } from '../utils/document';

interface Props {
  record: GristRecord
}

defineProps<Props>()

function formatAddress(address: string): string {
  return address.replace(/\n/g, ' ')
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

.document-header__address,
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
.document-header__date {
  margin-bottom: var(--spacing-xs);
}
</style>
