<template>
  <section v-if="paymentMethod" class="payment-info">
    <h3 class="payment-info__title">ข้อมูลการชำระเงิน</h3>

    <div class="payment-info__details">
      <div v-if="paymentMethod.Bank" class="payment-info__row">
        <span class="payment-info__label">ธนาคาร:</span>
        <span class="payment-info__value">{{ paymentMethod.Bank }}</span>
      </div>

      <div v-if="paymentMethod.Branch" class="payment-info__row">
        <span class="payment-info__label">สาขา:</span>
        <span class="payment-info__value">{{ paymentMethod.Branch }}</span>
      </div>

      <div v-if="paymentMethod.Account_Number" class="payment-info__row">
        <span class="payment-info__label">เลขที่บัญชี:</span>
        <span class="payment-info__value">{{ paymentMethod.Account_Number }}</span>
      </div>

      <div v-if="paymentMethod.Account_Holder" class="payment-info__row">
        <span class="payment-info__label">ชื่อบัญชี:</span>
        <span class="payment-info__value">{{ paymentMethod.Account_Holder }}</span>
      </div>

      <div v-if="paymentMethod.PromptPay" class="payment-info__row">
        <span class="payment-info__label">PromptPay:</span>
        <span class="payment-info__value">{{ paymentMethod.PromptPay }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GristRecord } from '../types/document-schema'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const paymentMethod = props.record.Record.Payment_Method
</script>

<style>
.payment-info {
  margin-bottom: var(--spacing-lg);
}

.payment-info__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-default);
  padding-bottom: var(--spacing-xs);
}

.payment-info__details {
  font-size: var(--font-size-sm);
}

.payment-info__row {
  display: flex;
  margin-bottom: var(--spacing-sm);
}

.payment-info__label {
  width: 120px;
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.payment-info__value {
  color: var(--text-primary);
  flex: 1;
}
</style>
