<template>
  <section class="client-info">
    <h3 class="client-info__title">ลูกค้า</h3>
    <div class="client-info__details">
      <div class="client-info__name">{{ record.Record.Client.Name }}</div>
      <div class="client-info__address">{{ formatAddress(record.Record.Client.Address) }}</div>
      <div class="client-info__tax-id">เลขประจำตัวผู้เสียภาษี: {{ record.Record.Client.Tax_ID }}</div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GristRecord } from '../types/document-schema'

interface Props {
  record: GristRecord
}

defineProps<Props>()

function formatAddress(address: string): string {
  return address.replace(/\n/g, ' ')
}
</script>

<style>
.client-info {
  margin-bottom: var(--spacing-lg);
}

.client-info__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-default);
  padding-bottom: var(--spacing-xs);
}

.client-info__details {
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-primary);
}

.client-info__name {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.client-info__address,
.client-info__tax-id {
  margin-bottom: var(--spacing-xs);
}
</style>