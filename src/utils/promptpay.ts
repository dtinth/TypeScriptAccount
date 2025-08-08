import generatePayload from 'promptpay-qr'
import QRCode from 'qrcode'

export async function generatePromptPayQR(promptPayId: string, amount: number): Promise<string> {
  try {
    const payload = generatePayload(promptPayId, { amount })
    const qrDataUrl = await QRCode.toDataURL(payload, {
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 200,
    })
    return qrDataUrl
  } catch (error) {
    console.error('Error generating PromptPay QR code:', error)
    throw error
  }
}
