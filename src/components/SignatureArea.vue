<template>
  <footer class="signature">
    <div class="signature__grid">
      <div class="signature__section">
        <div class="signature__label">ผู้รับเงิน</div>
        <div class="signature__line"></div>
        <div class="signature__text">ลงชื่อ ................................</div>
        <div class="signature__date">วันที่ ..../..../......</div>
      </div>
      <div class="signature__section">
        <div class="signature__label">ผู้จ่ายเงิน</div>
        <div class="signature__line"></div>
        <div class="signature__text">ลงชื่อ ................................</div>
        <div class="signature__date">วันที่ ..../..../......</div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// No props needed for signature area
</script>

<style>
.signature {
  margin-top: var(--spacing-lg);
}

.signature__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
}

.signature__section {
  text-align: center;
}

.signature__label {
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.signature__line {
  height: 60px;
  border: 1px dashed var(--border-default);
  margin-bottom: var(--spacing-sm);
}

.signature__text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.signature__date {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>
