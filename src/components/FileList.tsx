import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Document } from '../types'
import { useState } from 'react'

interface FileListProps {
  documents: Document[]
  currentDocId: string | null
  onSelectDocument: (id: string) => void
  onCreateDocument: () => void
  onDeleteDocument: (id: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function FileList({
  documents,
  currentDocId,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
  isCollapsed,
  onToggleCollapse,
}: FileListProps) {
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null)

  return (
    <div className={`h-full bg-slate-900 border-r border-slate-800 transition-all ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!isCollapsed && <h2 className="text-sm font-semibold text-slate-200">Documents</h2>}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-800 rounded transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="p-2">
            <button
              onClick={onCreateDocument}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              <Plus size={16} />
              New Document
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`group flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-800 transition-colors ${
                  currentDocId === doc.id ? 'bg-slate-800' : ''
                }`}
                onClick={() => onSelectDocument(doc.id)}
                onMouseEnter={() => setHoveredDoc(doc.id)}
                onMouseLeave={() => setHoveredDoc(null)}
              >
                <div className="truncate text-sm">{doc.name || 'Untitled'}</div>
                {hoveredDoc === doc.id && doc.id === currentDocId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteDocument(doc.id)
                    }}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}