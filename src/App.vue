<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import ActionButtons from './components/ActionButtons.vue'
import PrintableDocument from './components/PrintableDocument.vue'
import type { GristRecord } from './types/document-schema'
import { GristRecordSchema } from './types/document-schema'
import { grist } from './utils/grist'

// Import fonts and styles
import '@fontsource/sarabun/400.css'
import '@fontsource/sarabun/500.css'
import '@fontsource/sarabun/600.css'
import '@fontsource/sarabun/700.css'
import '@fontsource/share-tech-mono/400.css'
import './styles/global.css'
import './styles/print.css'
import './styles/variables.css'

const record = ref<GristRecord | null>(null)
const rawGristData = ref<unknown>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)

function onLoadScenario(data: GristRecord) {
  record.value = data
  rawGristData.value = data
  error.value = null
  isLoading.value = false
}

watch(record, (r) => {
  if (r?.Record?.Number) {
    document.title = r.Record.Number
  }
})

onMounted(() => {
  // Check if grist is available
  if (
    grist &&
    !new URLSearchParams(window.location.search).has('standalone') &&
    window.parent !== window.self
  ) {
    grist.ready()
    grist.onRecord(function (recordData: unknown) {
      try {
        // Store raw data for JSON copy functionality
        rawGristData.value = recordData
        // Validate the record data with Zod
        const validatedRecord = GristRecordSchema.parse(recordData)
        record.value = validatedRecord
        error.value = null
      } catch (err) {
        console.error('Invalid record data:', err)
        error.value = 'ข้อมูลไม่ถูกต้อง: ' + (err instanceof Error ? err.message : String(err))
        record.value = null
        rawGristData.value = null
      } finally {
        isLoading.value = false
      }
    })
  } else {
    // Standalone mode with sample data for testing
    const sampleData: GristRecord = {
      id: 5,
      Record: {
        Client: {
          Address: '123/45 หมู่ 6 ถ.ตัวอย่าง แขวงบ้านใหม่\nอ.ปากเกร็ด จ.นนทบุรี 11120',
          Name: 'บริษัท ลูกค้า จำกัด',
          Tax_ID: '9999999999999',
          id: 3,
        },
        Date: '2025-08-09T00:00:00.000Z',
        Document_Type: ['Receipt'],
        Items: [
          {
            Description: '**ไอเทมทดสอบ** - รายการสำคัญ\n- คุณภาพสูง\n- รหัสสินค้า: `TEST001`',
            Document: {
              tableId: 'Documents',
              rowId: 5,
            },
            Manual_Sort: 1,
            Quantity: 2,
            Total: 198,
            Unit_Price: 99,
            id: 5,
          },
        ],
        Number: 'TEST-001',
        Payment_Method: {
          Account_Holder: 'นาย ทด สอบ',
          Account_Number: '012-1-23456-7',
          Bank: 'ธนาคารกรุงศรี',
          Branch: 'เอสพละนาด รัชดาภิเษก',
          Name: 'TEST payment',
          PromptPay: '0123456789',
          id: 2,
        },
        Provider: {
          Address: '99/9 ซอยตัวอย่าง ถ.สุขุมวิท แขวงบางจาก\nเขตพระโขนง กรุงเทพฯ 10260',
          Email: 'provider@example.com',
          Name: 'บริษัท ผู้ให้บริการ จำกัด',
          Personnel_Name: 'นาย โปร แก้ได้หมด',
          Tax_ID: '8888888888888',
          id: 2,
        },
        Reference: {
          Number: 'REF-001',
          id: 1,
        },
        Remarks: '### หมายเหตุสำคัญ\n\nเอกสารนี้เป็น **ตัวอย่าง** สำหรับการทดสอบระบบ\n\n- กรุณาตรวจสอบข้อมูลก่อนชำระเงิน\n- `TEST001` คือรหัสสินค้าทดสอบ\n- สินค้าจะจัดส่งภายใน 7 วัน',
        Tax: 0.07,
        id: 5,
      },
    }

    record.value = sampleData
    rawGristData.value = sampleData
    error.value = null
    isLoading.value = false
  }
})
</script>

<template>
  <div class="app">
    <div v-if="isLoading" class="app__loading">กำลังโหลดข้อมูล...</div>

    <div v-else-if="error" class="app__error">
      <h2>เกิดข้อผิดพลาด</h2>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="record" class="app__content">
      <ActionButtons :record="record" :raw-grist-data="rawGristData" :disablePrint="!!record.Record.Signed_Document_URL"
        @load-scenario="onLoadScenario" />
      <div class="app__main-content">
        <template v-if="record.Record.Signed_Document_URL">
          <div class="app__signed">
            <p class="app__signed-text">เอกสารนี้ได้ถูกลงชื่อเรียบร้อยแล้ว</p>
            <a class="app__signed-link" :href="record.Record.Signed_Document_URL" target="_blank"
              rel="noopener noreferrer">
              🔗 ดาวน์โหลดเอกสารที่ลงชื่อแล้ว
            </a>
          </div>
        </template>
        <template v-else>
          <PrintableDocument :record="record" />
        </template>
      </div>
    </div>

    <div v-else class="app__no-data">ไม่มีข้อมูลให้แสดง</div>
  </div>
</template>

<style>
.app {
  font-family: var(--font-family);
}

.app__loading,
.app__error,
.app__no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: var(--spacing-xl);
}

.app__signed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  text-align: center;
  gap: var(--spacing-md);
  background: white;
  border-radius: 8px;
}

.app__signed-text {
  color: var(--text-primary);
  font-size: var(--font-size-lg);
}

.app__signed-link {
  display: inline-block;
  padding: var(--button-padding);
  background-color: var(--primary-blue);
  color: white;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.app__signed-link:hover {
  background-color: var(--primary-blue-dark);
}

.app__loading {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
}

.app__error {
  color: var(--text-error);
}

.app__error h2 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-xl);
}

.app__error p {
  margin: 0;
  font-size: var(--font-size-base);
  max-width: 600px;
}

.app__no-data {
  color: var(--text-muted);
  font-size: var(--font-size-lg);
}
</style>
