<template>
  <section class="items-section">
    <table class="items-table">
      <thead class="items-table__head">
        <tr class="items-table__row">
          <th class="items-table__header items-table__header--number">ลำดับ</th>
          <th class="items-table__header items-table__header--description">รายการ</th>
          <th class="items-table__header items-table__header--quantity">จำนวน</th>
          <th class="items-table__header items-table__header--unit-price">ราคาต่อหน่วย</th>
          <th class="items-table__header items-table__header--total">จำนวนเงิน</th>
        </tr>
      </thead>
      <tbody class="items-table__body">
        <tr v-for="(item, index) in sortedItems" :key="item.id" class="items-table__row">
          <td class="items-table__cell items-table__cell--number">{{ index + 1 }}</td>
          <td class="items-table__cell items-table__cell--description">
            <div
              v-if="isMarkdown(item.Description)"
              class="items-table__description items-table__description--markdown"
              v-html="renderMarkdown(item.Description)"
            />
            <div v-else class="items-table__description">{{ item.Description }}</div>
          </td>
          <td class="items-table__cell items-table__cell--quantity">{{ item.Quantity }}</td>
          <td class="items-table__cell items-table__cell--unit-price">
            {{ formatCurrency(item.Unit_Price) }}
          </td>
          <td class="items-table__cell items-table__cell--total">
            {{ formatCurrency(item.Total) }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { formatCurrency } from '../utils/currency'
import { sortItems } from '../utils/document'
import { isMarkdown, renderMarkdown } from '../utils/markdown'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const sortedItems = computed(() => {
  return sortItems(props.record.Record.Items)
})
</script>

<style>
.items-section {
  margin-bottom: var(--spacing-lg);
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.items-table__header {
  background-color: var(--bg-gray-50);
  border: 1px solid var(--border-default);
  padding: var(--table-cell-padding);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.items-table__cell {
  border: 1px solid var(--border-default);
  padding: var(--table-cell-padding);
  color: var(--text-primary);
  vertical-align: top;
}

.items-table__header--number,
.items-table__cell--number {
  width: 1cm;
  text-align: center;
}

.items-table__header--description,
.items-table__cell--description {
  width: auto;
  min-width: 7cm;
}

.items-table__header--quantity,
.items-table__cell--quantity {
  width: 80px;
  text-align: right;
}

.items-table__header--unit-price,
.items-table__cell--unit-price {
  width: 120px;
  text-align: right;
}

.items-table__header--total,
.items-table__cell--total {
  width: 120px;
  text-align: right;
}

/* Markdown description styling */
.items-table__description--markdown {
  line-height: var(--line-height-base);
}

/* Remove vertical margins from first and last elements */
.items-table__description--markdown > *:first-child {
  margin-top: 0 !important;
}

.items-table__description--markdown > *:last-child {
  margin-bottom: 0 !important;
}

.items-table__description--markdown p {
  margin: 0 0 var(--spacing-xs) 0;
}

.items-table__description--markdown strong {
  font-weight: var(--font-weight-semibold);
}

.items-table__description--markdown em {
  font-style: italic;
}

.items-table__description--markdown code {
  background-color: var(--bg-gray-100);
  padding: 0.5mm 1mm;
  border-radius: 1mm;
  font-size: 8pt;
  font-family: 'Courier New', monospace;
}

.items-table__description--markdown ul,
.items-table__description--markdown ol {
  margin: var(--spacing-xs) 0;
  padding-left: 3mm;
  font-size: 8pt;
}

.items-table__description--markdown li {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-tight);
}

.items-table__description--markdown a {
  color: var(--primary-blue);
  text-decoration: underline;
}

@media print {
  .items-table__description--markdown a {
    color: #000 !important;
    text-decoration: none;
  }
}
</style>
