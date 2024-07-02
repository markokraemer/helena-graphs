import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Upload, File, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onUploadSuccess, onUploadError }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setError(null)
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds 10MB limit")
      onUploadError("File size exceeds 10MB limit")
      return
    }
    if (uploadedFile.type !== 'application/pdf') {
      setError("Only PDF files are allowed")
      onUploadError("Only PDF files are allowed")
      return
    }
    setFile(uploadedFile)
  }, [onUploadError])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      // TODO: Implement actual file upload to backend
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating upload
      onUploadSuccess()
    } catch (err) {
      const errorMessage = "An error occurred while uploading the file. Please try again."
      setError(errorMessage)
      onUploadError(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center">Upload Your Book PDF</h2>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-4">
        <motion.div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <input {...getInputProps()} />
          <AnimatePresence mode="wait">
            {isDragActive ? (
              <motion.p
                key="drag-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-primary"
              >
                Drop the PDF file here...
              </motion.p>
            ) : (
              <motion.div
                key="drag-inactive"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p>Drag &amp; drop a PDF file here, or click to select one</p>
                <p className="text-sm text-muted-foreground mt-2">Max file size: 10MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 bg-muted p-2 rounded"
          >
            <File className="h-5 w-5 text-primary" />
            <span className="text-sm truncate">{file.name}</span>
          </motion.div>
        )}
        <Button 
          onClick={handleUpload} 
          disabled={!file || uploading} 
          className="w-full"
        >
          {uploading ? 'Uploading...' : 'Upload and Process'}
          <Upload className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}