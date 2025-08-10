<script setup lang="ts">
import { onMounted } from 'vue'
import ActionButtons from './components/ActionButtons.vue'
import PrintableDocument from './components/PrintableDocument.vue'
import { useAppState } from './composables/useAppState'

// Import fonts and styles
import '@fontsource/sarabun/400.css'
import '@fontsource/sarabun/500.css'
import '@fontsource/sarabun/600.css'
import '@fontsource/sarabun/700.css'
import '@fontsource/share-tech-mono/400.css'
import './styles/global.css'
import './styles/print.css'
import './styles/variables.css'

const {
  record,
  rawGristData,
  error,
  isLoading,
  customCss,
  showSettings,
  settingsRef,
  isCssChanged,
  saveCustomCss,
  initializeGrist
} = useAppState()

onMounted(async () => {
  await initializeGrist()
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
      <ActionButtons :record="record" :raw-grist-data="rawGristData" :disablePrint="!!record.Record.Signed_Document_URL" />
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

      <!-- CSS Settings Section -->
      <div ref="settingsRef" class="app__settings" :class="{ 'app__settings--open': showSettings }">
        <div class="app__settings-header">
          <button type="button" class="app__settings-toggle" @click="showSettings = !showSettings">
            {{ showSettings ? '▼' : '▶' }} Custom CSS Settings
          </button>
        </div>

        <div v-if="showSettings" class="app__settings-content">
          <div class="app__settings-field">
            <label for="custom-css" class="app__settings-label">
              Custom CSS:
            </label>
            <textarea id="custom-css" v-model="customCss" class="app__settings-textarea" placeholder=".document {
  --font-family: Comic Sans MS, Itim, sans-serif;
}" rows="10"></textarea>
          </div>

          <div class="app__settings-actions">
            <button 
              type="button" 
              class="app__settings-apply" 
              :disabled="!isCssChanged"
              @click="saveCustomCss"
            >
              Apply CSS
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="app__no-data">ไม่มีข้อมูลให้แสดง</div>
  </div>
</template>

<style>
.app {
  font-family: var(--font-family-system);
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
  max-width: var(--document-width);
  margin: 0 auto;
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

/* CSS Settings Styles */
.app__settings {
  max-width: var(--document-width);
  margin: var(--spacing-lg) auto;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  background: white;
  overflow: hidden;
}

@media print {
  .app__settings {
    display: none !important;
  }
}

.app__settings-header {
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.app__settings-toggle {
  width: 100%;
  padding: var(--spacing-md);
  background: transparent;
  border: none;
  text-align: left;
  font-family: var(--font-family-system);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  color: var(--text-primary);
  transition: background-color 0.2s;
}

.app__settings-toggle:hover {
  background: #f0f0f0;
}

.app__settings-content {
  padding: var(--spacing-lg);
}

.app__settings-field {
  margin-bottom: var(--spacing-lg);
}

.app__settings-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

.app__settings-textarea {
  width: 100%;
  min-height: 200px;
  padding: var(--spacing-md);
  border: 1px solid #d0d0d0;
  border-radius: var(--border-radius);
  font-family: var(--font-family-mono);
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
  background: #fafafa;
  color: var(--text-primary);
}

.app__settings-textarea:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.app__settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.app__settings-apply {
  padding: var(--button-padding);
  background-color: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-family: var(--font-family-system);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: background-color 0.2s;
}

.app__settings-apply:hover {
  background-color: var(--primary-blue-dark);
}

.app__settings-apply:active {
  transform: translateY(1px);
}

.app__settings-apply:disabled {
  background-color: #d1d5db;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.app__settings-apply:disabled:hover {
  background-color: #d1d5db;
}
</style>
