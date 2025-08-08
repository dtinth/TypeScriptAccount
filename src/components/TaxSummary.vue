<template>
  <section class="tax-summary">
    <div class="tax-summary__table">
      <div class="tax-summary__row">
        <div class="tax-summary__label">ยอดรวม</div>
        <div class="tax-summary__amount">{{ formatCurrency(subtotal) }}</div>
      </div>
      
      <div v-if="taxInfo.label" class="tax-summary__row">
        <div class="tax-summary__label">{{ taxInfo.label }}</div>
        <div class="tax-summary__amount" :class="{ 'tax-summary__amount--negative': taxInfo.percentage < 0 }">
          {{ taxInfo.percentage < 0 ? '-' : '' }}{{ formatCurrency(Math.abs(taxInfo.amount)) }}
        </div>
      </div>
      
      <div class="tax-summary__row tax-summary__row--total">
        <div class="tax-summary__label">จำนวนเงินสุทธิ</div>
        <div class="tax-summary__amount">{{ formatCurrency(total) }}</div>
      </div>
      
      <div class="tax-summary__row tax-summary__row--baht-text">
        <div class="tax-summary__label">จำนวนเงิน (ตัวอักษร)</div>
        <div class="tax-summary__baht-text">{{ formatBahtText(total) }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { calculateSubtotal } from '../utils/document'
import { formatCurrency, formatBahtText } from '../utils/currency'
import { getTaxInfo } from '../utils/tax'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const subtotal = computed(() => {
  return calculateSubtotal(props.record.Record.Items)
})

const taxInfo = computed(() => {
  return getTaxInfo(props.record.Record.Tax, subtotal.value)
})

const total = computed(() => {
  return subtotal.value + taxInfo.value.amount
})
</script>

<style>
.tax-summary {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: flex-end;
}

.tax-summary__table {
  width: 300px;
  font-size: var(--font-size-sm);
}

.tax-summary__row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-light);
}

.tax-summary__row--total {
  border-bottom: 2px solid var(--border-dark);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-base);
}

.tax-summary__row--baht-text {
  border-bottom: none;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-top: var(--spacing-md);
}

.tax-summary__label {
  color: var(--text-primary);
}

.tax-summary__amount {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.tax-summary__amount--negative {
  color: var(--text-error);
}

.tax-summary__baht-text {
  color: var(--text-primary);
  font-size: var(--font-size-xs);
  font-style: italic;
  text-align: right;
}

@media print {
  .tax-summary__table {
    width: 280px;
  }
  
  .tax-summary__row {
    padding: 0.4rem 0;
  }
}
</style>