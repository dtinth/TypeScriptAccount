interface GristRecord {
  [key: string]: unknown
}

interface GristAPI {
  ready: () => void
  onRecord: (callback: (record: GristRecord) => void) => void
}

declare global {
  interface Window {
    grist?: GristAPI
  }
}

export const grist = window.grist
