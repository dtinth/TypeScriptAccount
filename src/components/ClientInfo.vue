<template>
  <section class="client-info">
    <h3 class="client-info__title">ลูกค้า</h3>
    <div class="client-info__name">{{ record.Record.Client.Name }}</div>
    <div class="client-info__details">
      <div class="client-info__address">{{ trimAddress(record.Record.Client.Address) }}</div>
      <div class="client-info__tax-id">
        เลขประจำตัวผู้เสียภาษี: {{ record.Record.Client.Tax_ID }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GristRecord } from '../types/document-schema';

interface Props {
  record: GristRecord
}

defineProps<Props>()

function trimAddress(address: string): string {
  return address.trim()
}
</script>

<style>
.client-info {
  margin-bottom: var(--spacing-lg);
}

/* Styling provided by global h3 selector */

.client-info__details {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
  color: var(--text-secondary);
}

.client-info__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.client-info__address {
  margin-bottom: var(--spacing-xs);
  white-space: pre-line;
}

.client-info__tax-id {
  margin-bottom: var(--spacing-xs);
}
</style>
