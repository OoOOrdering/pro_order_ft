"use client"

import React from "react"

import { useState, useRef } from "react"
import { cn } from "../lib/utils"
import Button from "./Button"
import Input from "./Input"
import Card from "./Card"

interface FormField {
  id: string
  type: "text" | "radio" | "checkbox" | "date" | "file"
  label: string
  required: boolean
  options?: string[]
  placeholder?: string
}

interface OrderFormData {
  id: string
  title: string
  description: string
  fields: FormField[]
}

interface OrderFormProps {
  formData: OrderFormData
  onSubmit: (data: Record<string, any>) => void
  isAdmin?: boolean
  onEditForm?: () => void
  className?: string
}

export default function OrderForm({ formData, onSubmit, isAdmin = false, onEditForm, className }: OrderFormProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }))
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: "" }))
    }
  }

  const handleCheckboxChange = (fieldId: string, option: string, checked: boolean) => {
    const currentValues = formValues[fieldId] || []
    const newValues = checked ? [...currentValues, option] : currentValues.filter((v: string) => v !== option)
    handleInputChange(fieldId, newValues)
  }

  const handleFileChange = (fieldId: string, files: FileList | null) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      handleInputChange(fieldId, fileArray)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    formData.fields.forEach((field) => {
      if (field.required) {
        const value = formValues[field.id]
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.id] = `${field.label}은(는) 필수 항목입니다.`
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formValues)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            label={field.label}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={errors[field.id]}
          />
        )

      case "radio":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={formValues[field.id] === option}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              ))}
            </div>
            {errors[field.id] && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        )

      case "checkbox":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <label key={option} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formValues[field.id] || []).includes(option)}
                    onChange={(e) => handleCheckboxChange(field.id, option, e.target.checked)}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-foreground">{option}</span>
                </label>
              ))}
            </div>
            {errors[field.id] && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        )

      case "date":
        return (
          <Input
            type="date"
            label={field.label}
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            error={errors[field.id]}
          />
        )

      case "file":
        return (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                ref={(el) => {
                  fileInputRefs.current[field.id] = el
                }}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(field.id, e.target.files)}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRefs.current[field.id]?.click()}
                className="text-primary hover:text-primary/80 font-medium"
              >
                📷 이미지 선택
              </button>
              <p className="text-sm text-muted-foreground mt-2">또는 파일을 여기로 드래그하세요</p>
              {formValues[field.id] && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formValues[field.id].map((file: File, index: number) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {errors[field.id] && <p className="text-sm text-destructive">{errors[field.id]}</p>}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn("max-w-2xl mx-auto", className)}>
      <Card className="mb-20">
        {/* Form Header */}
        <div className="border-b pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{formData.title}</h1>
              {formData.description && <p className="text-muted-foreground mt-2">{formData.description}</p>}
            </div>
            {isAdmin && onEditForm && (
              <Button variant="outline" size="sm" onClick={onEditForm}>
                ✏️ 양식 수정
              </Button>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.fields.map((field) => (
            <div key={field.id}>{renderField(field)}</div>
          ))}
        </form>
      </Card>

      {/* Fixed Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            size="lg"
            fullWidth
            disabled={isSubmitting}
            className="shadow-lg"
          >
            {isSubmitting ? "제출 중..." : "주문서 제출"}
          </Button>
        </div>
      </div>
    </div>
  )
}
