import { useState } from 'react'
import OrgBlock from './OrgBlock'
import Toolbar from './Toolbar'
import { Block, Document } from '../types'

interface OrgDocumentProps {
  doc: Document
  onUpdate: (doc: Document) => void
}

export default function OrgDocument({ doc, onUpdate }: OrgDocumentProps) {
  const blocks = doc.blocks
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null)

  // Determine if a block should be visible based on its ancestors
  const isBlockVisible = (index: number): boolean => {
    const currentBlock = blocks[index]

    // Look at all blocks before this one
    for (let i = index - 1; i >= 0; i--) {
      const previousBlock = blocks[i]
      // If we find a parent (level is less than current block)
      if (previousBlock.level < currentBlock.level) {
        // If parent is not visible, this block shouldn't be visible
        if (!previousBlock.visible) return false
        // If the level difference is 1, this is the immediate parent
        // Otherwise, keep looking for other ancestors
        if (previousBlock.level === currentBlock.level - 1) {
          return previousBlock.visible
        }
      }
    }
    return true
  }

  const updateDocument = (newBlocks: Block[]) => {
    onUpdate({
      ...doc,
      blocks: newBlocks,
      lastModified: Date.now()
    })
  }

  const toggleBlock = (blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId)
    const block = blocks[blockIndex]
    const newVisibility = !block.visible
    const newBlocks = [...blocks]
    
    // Toggle the clicked block and all its descendants
    for (let i = blockIndex; i < blocks.length; i++) {
      // Stop when we find a block with level <= the original block's level
      if (i > blockIndex && blocks[i].level <= block.level) break
      
      // Update visibility for the block and all its descendants
      newBlocks[i] = { ...blocks[i], visible: newVisibility }
    }
    
    updateDocument(newBlocks)
  }

  const updateBlock = (blockId: string, newContent: string) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId 
        ? { ...block, content: newContent }
        : block
    )
    updateDocument(newBlocks)
  }

  const indentBlock = (blockId: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId)
    if (blockIndex <= 0) return // Can't indent first block

    const prevBlock = blocks[blockIndex - 1]
    const block = blocks[blockIndex]
    
    // Can only indent one level deeper than previous block
    if (block.level <= prevBlock.level + 1) {
      const newBlocks = blocks.map((b, i) => 
        i === blockIndex 
          ? { ...b, level: b.level + 1 }
          : b
      )
      updateDocument(newBlocks)
    }
  }

  const unindentBlock = (blockId: string) => {
    const newBlocks = blocks.map(block => 
      block.id === blockId && block.level > 1
        ? { ...block, level: block.level - 1 }
        : block
    )
    updateDocument(newBlocks)
  }

  const handleNavigate = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(b => b.id === blockId)
    if (currentIndex === -1) return

    let targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    // Find the next visible block in the specified direction
    while (targetIndex >= 0 && targetIndex < blocks.length) {
      if (isBlockVisible(targetIndex)) {
        setFocusedBlockId(blocks[targetIndex].id)
        break
      }
      targetIndex += direction === 'up' ? -1 : 1
    }
  }

  // Filter blocks to only show visible ones
  const visibleBlocks = blocks.filter((_, index) => isBlockVisible(index))

  return (
    <div>
      <Toolbar doc={doc} onUpdate={onUpdate} />
      <div className="space-y-1 font-mono">
        {visibleBlocks.map((block, index) => (
          <OrgBlock
            key={block.id}
            block={block}
            onToggle={() => toggleBlock(block.id)}
            hasChildren={
              index < blocks.length - 1 && 
              blocks.findIndex(b => b.id === block.id) < blocks.length - 1 && 
              blocks[blocks.findIndex(b => b.id === block.id) + 1].level > block.level
            }
            onUpdate={(content) => updateBlock(block.id, content)}
            onIndent={() => indentBlock(block.id)}
            onUnindent={() => unindentBlock(block.id)}
            onNavigate={(direction) => handleNavigate(block.id, direction)}
            isFocused={focusedBlockId === block.id}
            onFocus={() => setFocusedBlockId(block.id)}
          />
        ))}
      </div>
    </div>
  )
}
