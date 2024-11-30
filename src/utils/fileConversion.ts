interface Block {
  id: string
  level: number
  content: string
  visible: boolean
}

// Convert from internal blocks to Org Mode format
export function blocksToOrg(blocks: Block[]): string {
  return blocks
    .map(block => `${'*'.repeat(block.level)} ${block.content}`)
    .join('\n')
}

// Convert from internal blocks to Markdown format
export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map(block => `${'#'.repeat(block.level)} ${block.content}`)
    .join('\n')
}

// Parse Org Mode content to blocks
export function parseOrgContent(text: string): Block[] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map((line, index) => {
    const match = line.match(/^(\*+)\s(.+)/)
    if (match) {
      return {
        id: `block-${index}`,
        level: match[1].length,
        content: match[2],
        visible: true
      }
    }
    // Fallback for invalid lines
    return {
      id: `block-${index}`,
      level: 1,
      content: line,
      visible: true
    }
  })
}

// Parse Markdown content to blocks
export function parseMarkdownContent(text: string): Block[] {
  const lines = text.split('\n').filter(line => line.trim())
  return lines.map((line, index) => {
    const match = line.match(/^(#{1,6})\s(.+)/)
    if (match) {
      return {
        id: `block-${index}`,
        level: match[1].length,
        content: match[2],
        visible: true
      }
    }
    // Fallback for invalid lines
    return {
      id: `block-${index}`,
      level: 1,
      content: line,
      visible: true
    }
  })
}

// Download content as a file
export function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}