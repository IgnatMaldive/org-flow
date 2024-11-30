import { Document, Block } from '../types'

const DOCUMENTS_KEY = 'orgflow_documents'

export function loadDocuments(): Document[] {
  const stored = localStorage.getItem(DOCUMENTS_KEY)
  if (!stored) {
    // Initialize with welcome document for new users
    const welcomeDoc = createWelcomeDocument()
    saveDocuments([welcomeDoc])
    return [welcomeDoc]
  }
  return JSON.parse(stored)
}

export function saveDocuments(documents: Document[]) {
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents))
}

export function createNewDocument(): Document {
  return {
    id: crypto.randomUUID(),
    name: 'Untitled',
    blocks: [{
      id: 'block-0',
      level: 1,
      content: '',
      visible: true
    }],
    lastModified: Date.now()
  }
}

export function createWelcomeDocument(): Document {
  const defaultContent = `* Welcome to OrgFlow! 👋
** Getting Started
*** Click on any block to start editing
*** Press Enter to save your changes
*** Use Space to toggle section visibility
** Navigation 🚀
*** Use ↑ and ↓ keys to move between blocks
*** Tab and Shift+Tab to indent/unindent blocks
*** Escape key cancels editing
** Document Management 📂
*** Create new documents with the + button
*** Switch between documents in the sidebar
*** Import and export in .org or .md formats
** Pro Tips ⭐
*** Create hierarchies by indenting blocks
*** Collapse sections to focus on specific content
*** Empty blocks show as "Empty block..."
** Try it yourself!
*** Edit this block by clicking on it
*** Create a new block below
*** Practice indenting this section
** Need more help?
*** Check out the README.md file
*** Visit our GitHub repository
*** Enjoy organizing your thoughts with OrgFlow!`

  const blocks: Block[] = defaultContent.split('\n').map((line, index) => {
    const match = line.match(/^(\*+)\s(.+)/)
    return {
      id: `block-${index}`,
      level: match ? match[1].length : 1,
      content: match ? match[2] : line,
      visible: true
    }
  })

  return {
    id: crypto.randomUUID(),
    name: 'Welcome to OrgFlow',
    blocks,
    lastModified: Date.now()
  }
}