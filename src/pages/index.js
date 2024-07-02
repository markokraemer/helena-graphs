import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import KnowledgeGraphVisualization from '@/components/KnowledgeGraphVisualization'
import ChatEngine from '@/components/ChatEngine'
import FileUpload from '@/components/FileUpload'
import Header from '@/components/Header'
import LoadingAnimation from '@/components/LoadingAnimation'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function Home() {
  const [pdfUploaded, setPdfUploaded] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleUploadSuccess = () => {
    setIsProcessing(true)
    setError(null)
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      setPdfUploaded(true)
    }, 3000)
  }

  const handleUploadError = (errorMessage) => {
    setError(errorMessage)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <ErrorBoundary>
      <motion.div 
        className="min-h-screen bg-gradient text-foreground"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Head>
          <title>KnowledgeGraph AI - Visualize and Chat with Your Books</title>
          <meta name="description" content="Upload your books, visualize knowledge graphs, and chat with AI based on book content" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="container mx-auto px-4 py-24 sm:py-32">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            KnowledgeGraph AI
          </h1>
          <p className="text-xl text-center mb-12 text-muted-foreground">
            Upload your books, visualize knowledge graphs, and chat with AI
          </p>
          
          <ThemeSwitcher />

          <AnimatePresence mode="wait">
            {!pdfUploaded && !isProcessing && (
              <motion.div
                key="upload"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                <FileUpload onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-red-500 text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}

            {isProcessing && (
              <motion.div
                key="processing"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
                className="flex flex-col items-center justify-center"
              >
                <LoadingAnimation />
                <p className="mt-4 text-xl">Processing your PDF...</p>
              </motion.div>
            )}

            {pdfUploaded && !isProcessing && (
              <motion.div
                key="content"
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <Tabs defaultValue="graph" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="graph">Knowledge Graph</TabsTrigger>
                    <TabsTrigger value="chat">Chat Engine</TabsTrigger>
                  </TabsList>
                  <TabsContent value="graph">
                    <KnowledgeGraphVisualization />
                  </TabsContent>
                  <TabsContent value="chat">
                    <ChatEngine />
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="text-center py-8 text-muted-foreground">
          <p>&copy; 2023 KnowledgeGraph AI. All rights reserved.</p>
        </footer>
      </motion.div>
    </ErrorBoundary>
  )
}