export interface Block {
  id: string
  level: number
  content: string
  visible: boolean
}

export interface Document {
  id: string
  name: string
  blocks: Block[]
  lastModified: number
}