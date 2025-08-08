import { micromark } from 'micromark'

export function renderMarkdown(markdown: string): string {
  try {
    // Convert markdown to HTML
    const html = micromark(markdown)
    // Basic sanitization - remove script tags and other dangerous elements
    return html
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .trim()
  } catch (error) {
    console.warn('Failed to render markdown:', error)
    return markdown // Fallback to plain text
  }
}

export function isMarkdown(text: string): boolean {
  // Simple heuristic to detect if text contains markdown
  const markdownPatterns = [
    /\*\*[^*]+\*\*/, // Bold
    /\*[^*]+\*/, // Italic  
    /_[^_]+_/, // Italic underscore
    /`[^`]+`/, // Code
    /^\s*[-*+]\s+/m, // Lists
    /^\s*\d+\.\s+/m, // Numbered lists
    /^#+\s+/m, // Headers
    /\[([^\]]+)\]\(([^)]+)\)/, // Links
  ]
  
  return markdownPatterns.some(pattern => pattern.test(text))
}