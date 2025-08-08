<template>
  <article class="document" :data-document-type="documentType?.toLowerCase()" :data-document-id="record?.id">
    <DocumentHeader v-if="record" :record="record" />

    <ClientInfo v-if="record" :record="record" />

    <ItemsTable v-if="record" :record="record" />

    <TaxSummary v-if="record" :record="record" />

    <div v-if="record?.Record.Payment_Method" class="document__payment-section">
      <PaymentInfo v-if="record" :record="record" />
      <QRCodeSection v-if="record" :record="record" />
    </div>

    <SignatureArea />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'
import ClientInfo from './ClientInfo.vue'
import DocumentHeader from './DocumentHeader.vue'
import ItemsTable from './ItemsTable.vue'
import PaymentInfo from './PaymentInfo.vue'
import QRCodeSection from './QRCodeSection.vue'
import SignatureArea from './SignatureArea.vue'
import TaxSummary from './TaxSummary.vue'

interface Props {
  record: GristRecord | null
}

const props = defineProps<Props>()

const documentType = computed(() => {
  return props.record?.Record.Document_Type[0] || null
})
</script>

<style>
.document {
  padding: var(--document-padding);
  font-family: var(--font-family);
  color: var(--text-primary);
  line-height: var(--line-height-base);
  box-sizing: border-box;
  position: relative;
}

@media print {
  .document {
    zoom: 1 !important;
    width: 100% !important;
    min-height: auto !important;
  }
}

@media screen {
  .document {
    width: var(--document-width);
    min-height: var(--document-height);
    background: var(--bg-white);
    box-shadow: var(--document-shadow);
    zoom: var(--document-scale);
  }
}

.document__payment-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-xl);
  align-items: start;
}

@media print {
  .document {
    box-shadow: none;
    min-height: auto;
  }
}
</style>
