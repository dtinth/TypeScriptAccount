# Receipt/Invoice/Quotation Widget for Grist

A Vue 3 + TypeScript widget for Grist that generates professional Thai business documents (receipts, invoices, and quotations) with print-optimized A4 layout, PromptPay QR codes, and Thai language support.

## Features

- 📄 **Professional Thai Documents**: Generate receipts, invoices, and quotations in Thai
- 🖨️ **Print-Optimized**: A4 layout with perfect print formatting using `@page` CSS
- 💳 **PromptPay Integration**: Automatic QR code generation for PromptPay payments
- 🔤 **Thai Language Support**: Sarabun font and Thai text rendering
- 📊 **Tax Calculations**: Automatic VAT (7%) and WHT (Withholding Tax) display
- 🎨 **Customizable**: BEM methodology and CSS variables for easy styling
- 🔧 **Type Safe**: Full TypeScript with Zod runtime validation
- 📱 **Responsive**: Scales to fit viewport on screen, optimized for print

## Grist Integration

This widget integrates with [Grist](https://www.getgrist.com/) spreadsheet application as a custom widget.

**Grist template file:** [template.grist](template.grist)

## Document Types

- **Receipt** (ใบเสร็จรับเงิน) - Payment confirmation
- **Invoice** (ใบแจ้งหนี้) - Payment request
- **Quotation** (ใบเสนอราคา) - Price estimate

## Technology Stack

- **Frontend**: Vue 3 with Composition API + TypeScript
- **Build Tool**: Vite
- **Package Manager**: Bun

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20.19.0+
- Modern browser with print support

### IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

### Installation

```bash
# Clone the repository
git clone https://github.com/dtinth/TypeScriptAccount.git
cd TypeScriptAccount

# Install dependencies
bun install
```

## Development Commands

```bash
# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun preview

# Run unit tests
bun test:unit

# Run E2E tests (install browsers first: npx playwright install)
bun test:e2e

# Lint and fix code
bun lint

# Format code
bun format

# Type checking only
bun run type-check
```

**Note:** To load example data for debugging outside Grist, append `?standalone=true` to the URL in your browser.

## License

MIT

## Related Documentation

- [Vite Configuration Reference](https://vite.dev/config/)
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zod Validation](https://zod.dev/)
- [Grist Custom Widgets Guide](https://support.getgrist.com/widget-custom/)
- [Grist Widget API Reference](https://support.getgrist.com/widget-custom-api/)
- [Grist Templates](https://templates.getgrist.com/)
