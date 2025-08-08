# Thai Receipt/Invoice/Quotation Widget for Grist

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

### Required Grist Table Structure

- **Documents** table with fields: `Client`, `Provider`, `Items`, `Payment_Method`, `Date`, `Number`, `Document_Type`, `Tax`
- **Clients** table: `Name`, `Address`, `Tax_ID`  
- **Providers** table: `Name`, `Address`, `Email`, `Tax_ID`
- **Items** table: `Description`, `Quantity`, `Unit_Price`, `Total`, `Manual_Sort`
- **Payment_Methods** table: `Bank`, `Branch`, `Account_Number`, `Account_Holder`, `PromptPay`

### Grist Template

*Grist template file will be provided in the future - placeholder for now*

### Documentation Links

- [Grist Custom Widgets Guide](https://support.getgrist.com/widget-custom/)
- [Grist Widget API Reference](https://support.getgrist.com/widget-custom-api/)
- [Grist Templates](https://templates.getgrist.com/)

## Document Types

- **Receipt** (ใบเสร็จรับเงิน) - Payment confirmation
- **Invoice** (ใบแจ้งหนี้) - Payment request  
- **Quotation** (ใบเสนอราคา) - Price estimate

## Technology Stack

- **Frontend**: Vue 3 with Composition API + TypeScript
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Fonts**: Sarabun (Thai font from Google Fonts)
- **QR Codes**: promptpay-qr + qrcode libraries
- **Validation**: Zod schema validation
- **Currency**: Thai Baht formatting with 'baht' library
- **Testing**: Vitest (unit) + Playwright (E2E)

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 20.19.0+
- Modern browser with print support

### IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)

### Installation

```bash
# Clone the repository
git clone <repository-url>
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

## Usage

### As Grist Widget

1. Open your Grist document
2. Add a new widget and select "Custom Widget"
3. Set the widget URL to your deployed application
4. Configure the widget to use your Documents table
5. Select a document record to generate the printable version

### Standalone Development

The widget includes sample data for development when Grist API is not available.

### Printing

- Click "พิมพ์เอกสาร" (Print Document) to print or save as PDF
- Documents are optimized for A4 paper with proper margins
- Print styles hide action buttons and optimize layout

### Customization

#### CSS Variables

Customize appearance using CSS variables in `src/styles/variables.css`:

```css
:root {
  --font-family: 'Sarabun', sans-serif;
  --text-primary: #1f2937;
  --document-padding: 2rem;
  /* ... more variables */
}
```

#### Document Type Styling

Use data attributes for document-specific styling:

```css
.document[data-document-type="receipt"] {
  /* Receipt-specific styles */
}

.document[data-document-type="invoice"] {
  /* Invoice-specific styles */  
}

.document[data-document-type="quotation"] {
  /* Quotation-specific styles */
}
```

#### BEM Class Structure

Components follow BEM methodology:

```css
.document__header {}
.document__header--highlighted {}
.signature__section {}
.signature__section--signed {}
```

## Configuration

### Print Settings

Print styles use CSS `@page` rules for perfect A4 output:

```css
@page {
  size: A4;
  margin: 15mm 20mm;
}
```

### Font Loading

Sarabun font weights are loaded:
- 400 (Regular)
- 500 (Medium)  
- 600 (SemiBold)
- 700 (Bold)

### PromptPay QR Codes

Automatically generated when PromptPay ID is provided:
- Uses Thai PromptPay standard
- Includes payment amount
- Optimized for mobile scanning

## Troubleshooting

### Common Issues

1. **Font not loading**: Ensure Sarabun font files are properly imported
2. **Print margins incorrect**: Check `@page` CSS rules and printer settings
3. **QR code not generating**: Verify PromptPay ID format and network connectivity
4. **Grist data not loading**: Check widget permissions and API availability

### Debug Mode

Use the "คัดลอก JSON" (Copy JSON) button to inspect record data structure.

## Contributing

See [CLAUDE.md](./CLAUDE.md) for development guidelines and architectural decisions.

## License

MIT License - see LICENSE file for details.

## Related Documentation

- [Vite Configuration Reference](https://vite.dev/config/)
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zod Validation](https://zod.dev/)
- [PromptPay Standard](https://www.bot.or.th/Thai/PaymentSystems/StandardPS/Pages/PromptPay.aspx)