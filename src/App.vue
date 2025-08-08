<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reference the Grist types
/// <reference path="./types/grist.d.ts" />

const recordData = ref<string>('Waiting for data...')

onMounted(() => {
  // Check if grist is available
  if (typeof window.grist !== 'undefined') {
    window.grist.ready()
    window.grist.onRecord(function (record) {
      recordData.value = JSON.stringify(record, null, 2)
    })
  } else {
    recordData.value = 'Grist API not available. Running in standalone mode.'
  }
})
</script>

<template>
  <div>
    <h1>Grist Widget</h1>
    <pre id="readout">{{ recordData }}</pre>
  </div>
</template>

<style scoped>
pre {
  background-color: white;
  color: black;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Courier New', Courier, monospace;
  border: 1px solid #ddd;
}
</style>
