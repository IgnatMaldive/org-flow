import { useEffect, useState } from 'react'
import './index.css'
import OrgDocument from './components/OrgDocument'
import FileList from './components/FileList'
import { Document } from './types'
import { loadDocuments, saveDocuments, createNewDocument } from './utils/storage'

function App() {
  const [documents, setDocuments] = useState<Document[]>(() => loadDocuments())
  const [currentDocId, setCurrentDocId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Load initial documents and set current document
  useEffect(() => {
    const docs = loadDocuments()
    if (docs.length === 0) {
      const newDoc = createNewDocument()
      setDocuments([newDoc])
      setCurrentDocId(newDoc.id)
    } else {
      setCurrentDocId(docs[0].id)
    }
  }, [])

  const handleCreateDocument = () => {
    const newDoc = createNewDocument()
    const updatedDocs = [...documents, newDoc]
    setDocuments(updatedDocs)
    setCurrentDocId(newDoc.id)
    saveDocuments(updatedDocs)
  }

  const handleDeleteDocument = (id: string) => {
    if (documents.length <= 1) {
      alert("Can't delete the last document")
      return
    }

    const updatedDocs = documents.filter(doc => doc.id !== id)
    setDocuments(updatedDocs)
    if (currentDocId === id) {
      setCurrentDocId(updatedDocs[0].id)
    }
    saveDocuments(updatedDocs)
  }

  const handleUpdateDocument = (updatedDoc: Document) => {
    const updatedDocs = documents.map(doc =>
      doc.id === updatedDoc.id ? updatedDoc : doc
    )
    setDocuments(updatedDocs)
    saveDocuments(updatedDocs)
  }

  const currentDocument = documents.find(doc => doc.id === currentDocId)

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200">
      <FileList
        documents={documents}
        currentDocId={currentDocId}
        onSelectDocument={setCurrentDocId}
        onCreateDocument={handleCreateDocument}
        onDeleteDocument={handleDeleteDocument}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-mono mb-6 text-slate-200 px-1.5">OrgFlow</h1>
          {currentDocument && (
            <OrgDocument
              doc={currentDocument}
              onUpdate={handleUpdateDocument}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
