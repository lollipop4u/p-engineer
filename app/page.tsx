'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Copy, Check, AlertCircle, Sparkles } from 'lucide-react'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function PromptEngineer() {
  const [userPrompt, setUserPrompt] = useState('')
  const [transformedPrompt, setTransformedPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setTransformedPrompt('')

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)
      const model = genAI.getGenerativeModel({ model: "gemini-pro" })

      const prompt = `As an expert prompt engineer, improve the following prompt to make it more effective, clear, and likely to produce the desired outcome: "${userPrompt}"`

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      if (text) {
        setTransformedPrompt(text)
      } else {
        throw new Error('No response text received from the API')
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transformedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Prompt Engineer</h1>
        </div>
      </header>

      <main className="flex-grow bg-gradient-to-br from-purple-100 to-indigo-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8"
          >
            <h2 className="text-3xl font-bold text-center mb-4 text-indigo-700">Craft the Perfect Prompt</h2>
            <p className="text-center text-gray-600 mb-6">
              Unleash the power of AI with our Prompt Engineer. Transform your ideas into finely-tuned prompts that yield
              exceptional results. Whether you're a writer, researcher, or creative professional, elevate your AI interactions
              with expertly crafted prompts tailored to your needs.
            </p>
            <div className="flex justify-center mb-8">
              <Sparkles className="text-yellow-400 w-12 h-12" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Prompt
                </label>
                <textarea
                  id="userPrompt"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
                  rows={4}
                  placeholder="Enter your prompt here..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  'Transform'
                )}
              </button>
            </form>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start"
              >
                <AlertCircle className="mr-2 flex-shrink-0 mt-1" size={18} />
                <p>{error}</p>
              </motion.div>
            )}

            {transformedPrompt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-indigo-50 rounded-lg p-4 shadow-inner"
              >
                <h2 className="text-xl font-semibold mb-2 text-indigo-700">Improved Version:</h2>
                <p className="text-gray-800 mb-4">{transformedPrompt}</p>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
                >
                  {copied ? (
                    <>
                      <Check size={20} className="mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={20} className="mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <footer className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Prompt Engineer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}