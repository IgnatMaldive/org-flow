import { FileDown, FileUp, Edit } from 'lucide-react'
import { useState } from 'react'
import { blocksToOrg, blocksToMarkdown, parseOrgContent, parseMarkdownContent, downloadFile } from '../utils/fileConversion'
import { Document } from '../types'

interface ToolbarProps {
  doc: Document
  onUpdate: (doc: Document) => void
}

export default function Toolbar({ doc, onUpdate }: ToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [name, setName] = useState(doc.name)

  const handleImport = async () => {
    const input = globalThis.document.createElement('input') // Use globalThis.document to refer to the global document object
    input.type = 'file'
    input.accept = '.org,.md'
    
    input.addEventListener('change', async (e: Event) => { // Use addEventListener with Event type
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const content = await file.text()
      const fileExtension = file.name.split('.').pop()?.toLowerCase()

      let blocks
      if (fileExtension === 'org') {
        blocks = parseOrgContent(content)
      } else if (fileExtension === 'md') {
        blocks = parseMarkdownContent(content)
      } else {
        alert('Unsupported file format')
        return
      }

      onUpdate({
        ...doc,
        blocks,
        lastModified: Date.now()
      })
    })

    input.click()
  }

  const handleExport = (format: 'org' | 'md') => {
    const content = format === 'org' 
      ? blocksToOrg(doc.blocks)
      : blocksToMarkdown(doc.blocks)
    
    const filename = `${doc.name || 'document'}.${format}`
    downloadFile(content, filename)
  }

  const handleNameUpdate = () => {
    setIsEditingName(false)
    if (name.trim() !== doc.name) {
      onUpdate({
        ...doc,
        name: name.trim() || 'Untitled',
        lastModified: Date.now()
      })
    }
  }

  return (
    <div className="flex justify-between items-center gap-1.5 mb-4">
      <div className="flex items-center gap-2">
        {isEditingName ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameUpdate}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameUpdate()
              if (e.key === 'Escape') {
                setName(doc.name)
                setIsEditingName(false)
              }
            }}
            className="bg-slate-700 px-2 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="flex items-center gap-1.5 group"
          >
            <span className="text-sm font-medium">{doc.name || 'Untitled'}</span>
            <Edit className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={handleImport}
          className="flex items-center gap-1.5 px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          <FileUp className="w-3.5 h-3.5" />
          Import
        </button>
        
        <button
          onClick={() => handleExport('org')}
          className="flex items-center gap-1.5 px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          .org
        </button>
        
        <button
          onClick={() => handleExport('md')}
          className="flex items-center gap-1.5 px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 rounded transition-colors"
        >
          <FileDown className="w-3.5 h-3.5" />
          .md
        </button>
      </div>
    </div>
  )
}
