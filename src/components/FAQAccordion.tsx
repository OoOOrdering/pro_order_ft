"use client"

import { useState } from "react"
import { cn } from "../lib/utils"
import Card from "./Card"

interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
}

interface FAQAccordionProps {
  faqs: FAQ[]
  className?: string
}

export default function FAQAccordion({ faqs, className }: FAQAccordionProps) {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  const categories = [...new Set(faqs.map((faq) => faq.category).filter(Boolean))]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="질문을 검색하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-3 py-1 text-sm font-medium rounded-full transition-colors",
            !selectedCategory ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-full transition-colors",
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary hover:bg-primary/20",
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredFAQs.map((faq) => (
        <Card key={faq.id} className="overflow-hidden">
          <button
            onClick={() => toggleFAQ(faq.id)}
            className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {faq.category && <span className="text-xs text-primary font-medium mb-1 block">{faq.category}</span>}
                <h3 className="font-semibold text-foreground">{faq.question}</h3>
              </div>
              <div className="ml-4">
                <span
                  className={cn(
                    "transition-transform duration-300 ease-in-out",
                    openFAQ === faq.id ? "rotate-180" : "",
                  )}
                >
                  ▼
                </span>
              </div>
            </div>
          </button>

          {/* Answer */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              openFAQ === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            )}
          >
            <div className="px-4 pb-4 border-t bg-muted/20">
              <div className="pt-4 prose prose-sm max-w-none text-muted-foreground">
                <p className="whitespace-pre-wrap">{faq.answer}</p>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
