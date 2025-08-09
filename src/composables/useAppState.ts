import { computed, nextTick, ref, watch } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { GristRecordSchema } from '../types/document-schema'
import { grist } from '../utils/grist'

// App state
const record = ref<GristRecord | null>(null)
const rawGristData = ref<unknown>(null)
const error = ref<string | null>(null)
const isLoading = ref(true)

// Settings state
const customCss = ref<string>('')
const savedCustomCss = ref<string>('')
const showSettings = ref(false)
const settingsRef = ref<HTMLElement | null>(null)

// Dynamic style element for custom CSS
let customStyleElement: HTMLStyleElement | null = null

export function useAppState() {
  // Initialize dynamic style element
  if (!customStyleElement && typeof document !== 'undefined') {
    customStyleElement = document.createElement('style')
    customStyleElement.id = 'grist-custom-css'
    document.head.appendChild(customStyleElement)
  }

  // Check if CSS has been modified
  const isCssChanged = computed(() => {
    return customCss.value !== savedCustomCss.value
  })

  // Apply custom CSS to the page
  const applyCustomCss = (css: string) => {
    if (customStyleElement) {
      customStyleElement.textContent = css
    }
  }

  // Save custom CSS to Grist options
  const saveCustomCss = () => {
    if (grist && grist.setOption) {
      grist.setOption('customCss', customCss.value)
    }
    applyCustomCss(customCss.value)
    savedCustomCss.value = customCss.value
  }

  // Load custom CSS from Grist options
  const loadCustomCss = async () => {
    if (grist && grist.getOption) {
      try {
        const savedCss = await Promise.resolve(grist.getOption('customCss'))
        if (savedCss) {
          const cssString = String(savedCss)
          customCss.value = cssString
          savedCustomCss.value = cssString
          applyCustomCss(cssString)
        }
      } catch (error) {
        console.error('Failed to load custom CSS:', error)
      }
    }
  }

  // Scroll to settings area
  const scrollToSettings = async () => {
    showSettings.value = true
    await nextTick()
    if (settingsRef.value) {
      settingsRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Load scenario data
  const onLoadScenario = (data: GristRecord) => {
    record.value = data
    rawGristData.value = data
    error.value = null
    isLoading.value = false
  }

  // Initialize Grist integration
  const initializeGrist = async () => {
    if (
      grist &&
      !new URLSearchParams(window.location.search).has('standalone') &&
      window.parent !== window.self
    ) {
      grist.ready({
        onEditOptions: scrollToSettings
      })

      // Handle record data
      grist.onRecord(function (recordData: unknown) {
        try {
          rawGristData.value = recordData
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

      // Handle options changes
      if (grist.onOptions) {
        grist.onOptions((options: { [key: string]: unknown }) => {
          if (options && options.customCss !== undefined) {
            const cssString = String(options.customCss || '')
            customCss.value = cssString
            savedCustomCss.value = cssString
            applyCustomCss(cssString)
          }
        })
      }

      // Load initial custom CSS
      await loadCustomCss()
    } else {
      // Standalone mode with sample data
      initializeStandaloneMode()
    }
  }

  // Initialize standalone mode
  const initializeStandaloneMode = () => {
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
        Remarks:
          '### หมายเหตุสำคัญ\n\nเอกสารนี้เป็น **ตัวอย่าง** สำหรับการทดสอบระบบ\n\n- กรุณาตรวจสอบข้อมูลก่อนชำระเงิน\n- `TEST001` คือรหัสสินค้าทดสอบ\n- สินค้าจะจัดส่งภายใน 7 วัน',
        Tax: 0.07,
        id: 5,
      },
    }

    record.value = sampleData
    rawGristData.value = sampleData
    error.value = null
    isLoading.value = false
  }

  // Watch for record changes to update document title
  watch(record, (r) => {
    if (r?.Record?.Number) {
      document.title = r.Record.Number
    }
  })

  return {
    // State
    record,
    rawGristData,
    error,
    isLoading,
    customCss,
    showSettings,
    settingsRef,

    // Computed
    isCssChanged,

    // Actions
    onLoadScenario,
    saveCustomCss,
    loadCustomCss,
    scrollToSettings,
    initializeGrist,
    applyCustomCss,
  }
}
