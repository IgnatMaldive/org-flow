import { ChevronDown, ChevronRight } from 'lucide-react'
import { KeyboardEvent, useState, useRef, useEffect } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

interface Block {
  id: string
  level: number
  content: string
  visible: boolean
}

interface OrgBlockProps {
  block: Block
  onToggle: () => void
  hasChildren: boolean
  onUpdate: (content: string) => void
  onIndent: () => void
  onUnindent: () => void
  onNavigate: (direction: 'up' | 'down') => void
  isFocused: boolean
  onFocus: () => void
}

export default function OrgBlock({ 
  block, 
  onToggle, 
  hasChildren, 
  onUpdate,
  onIndent,
  onUnindent,
  onNavigate,
  isFocused,
  onFocus
}: OrgBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(block.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const blockRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.selectionStart = textareaRef.current.value.length
    } else if (isFocused && blockRef.current) {
      blockRef.current.focus()
    }
  }, [isEditing, isFocused])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        setIsEditing(false)
        onUpdate(editContent)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        if (e.shiftKey) {
          onUnindent()
        } else {
          onIndent()
        }
      } else if (e.key === 'Escape') {
        setIsEditing(false)
        setEditContent(block.content)
      }
    } else {
      if (e.key === ' ') {
        e.preventDefault()
        if (hasChildren) {
          onToggle()
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        onNavigate('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onNavigate('down')
      } else if (e.key === 'Enter') {
        e.preventDefault()
        setIsEditing(true)
      }
    }
  }

  return (
    <div
      ref={blockRef}
      tabIndex={0}
      onFocus={() => !isEditing && onFocus()}
      onKeyDown={handleKeyDown}
      className={`group flex space-x-2 rounded-lg p-1.5 transition-colors ${
        isFocused ? 'bg-slate-800 outline-none ring-1 ring-slate-600' : 'hover:bg-slate-800/50'
      }`}
      style={{ marginLeft: `${(block.level - 1) * 24}px` }}
    >
      <div className="flex-shrink-0 pt-1">
        {hasChildren ? (
          <button
            onClick={onToggle}
            className="p-0.5 hover:bg-slate-700 rounded transition-colors"
            tabIndex={-1}
          >
            {block.visible ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        {isEditing ? (
          <TextareaAutosize
            ref={textareaRef}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setIsEditing(false)
              onUpdate(editContent)
            }}
            className="w-full bg-transparent border-none outline-none focus:ring-1 focus:ring-slate-600 rounded px-1 resize-none"
            minRows={1}
            placeholder="Enter your text..."
          />
        ) : (
          <div 
            className="py-0.5 cursor-text break-words"
            onClick={() => setIsEditing(true)}
          >
            {block.content || <span className="text-slate-500 italic">Empty block...</span>}
          </div>
        )}
      </div>
    </div>
  )
}