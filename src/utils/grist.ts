interface GristRecord {
  [key: string]: unknown
}

interface GristOptions {
  [key: string]: unknown
}

interface GristReadyOptions {
  onEditOptions?: () => void
}

interface GristAPI {
  ready: (options?: GristReadyOptions) => void
  onRecord: (callback: (record: GristRecord) => void) => void
  onOptions: (callback: (options: GristOptions) => void) => void
  setOption: (key: string, value: unknown) => void
  getOption: (key: string) => unknown
}

declare global {
  interface Window {
    grist?: GristAPI
  }
}

export const grist = window.grist
