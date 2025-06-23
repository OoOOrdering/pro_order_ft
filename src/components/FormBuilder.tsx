"use client"

import * as React from "react"

import { useState } from "react"
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

interface FormBuilderProps {
  onSave: (formData: { title: string; description: string; fields: FormField[] }) => void
  className?: string
}

export default function FormBuilder({ onSave, className }: FormBuilderProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<FormField[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const addField = (type: FormField["type"]) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: `새 ${getFieldTypeName(type)} 항목`,
      required: false,
      options: type === "radio" || type === "checkbox" ? ["옵션 1", "옵션 2"] : undefined,
      placeholder: type === "text" ? "입력해주세요" : undefined,
    }
    setFields([...fields, newField])
  }

  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const moveField = (fromIndex: number, toIndex: number) => {
    const newFields = [...fields]
    const [movedField] = newFields.splice(fromIndex, 1)
    newFields.splice(toIndex, 0, movedField)
    setFields(newFields)
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== index) {
      moveField(draggedIndex, index)
      setDraggedIndex(index)
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const getFieldTypeName = (type: string) => {
    const names = {
      text: "텍스트",
      radio: "단일선택",
      checkbox: "다중선택",
      date: "날짜",
      file: "파일업로드",
    }
    return names[type as keyof typeof names] || type
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert("양식 제목을 입력해주세요.")
      return
    }
    onSave({ title, description, fields })
  }

  const renderFieldEditor = (field: FormField, index: number) => (
    <Card
      key={field.id}
      className={cn("p-4 cursor-move", draggedIndex === index && "opacity-50")}
    >
      <div
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-primary">{getFieldTypeName(field.type)}</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 cursor-move">⋮⋮</span>
            <Button variant="ghost" size="sm" onClick={() => removeField(index)} className="text-destructive">
              ✕
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            label="항목 제목"
            value={field.label}
            onChange={(e) => updateField(index, { label: e.target.value })}
            placeholder="항목 제목을 입력하세요"
          />

          {field.type === "text" && (
            <Input
              label="플레이스홀더"
              value={field.placeholder || ""}
              onChange={(e) => updateField(index, { placeholder: e.target.value })}
              placeholder="입력 안내 문구"
            />
          )}

          {(field.type === "radio" || field.type === "checkbox") && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">선택 옵션</label>
              {field.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(field.options || [])]
                      newOptions[optionIndex] = e.target.value
                      updateField(index, { options: newOptions })
                    }}
                    placeholder={`옵션 ${optionIndex + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newOptions = field.options?.filter((_, i) => i !== optionIndex)
                      updateField(index, { options: newOptions })
                    }}
                    className="text-destructive"
                  >
                    ✕
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newOptions = [...(field.options || []), `옵션 ${(field.options?.length || 0) + 1}`]
                  updateField(index, { options: newOptions })
                }}
              >
                + 옵션 추가
              </Button>
            </div>
          )}

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(index, { required: e.target.checked })}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm text-foreground">필수 항목</span>
          </label>
        </div>
      </div>
    </Card>
  )

  const renderPreview = () => (
    <Card className="p-6">
      <h3 className="text-xl font-bold text-foreground mb-2">{title || "양식 제목"}</h3>
      {description && <p className="text-muted-foreground mb-6">{description}</p>}

      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-sm font-medium text-foreground mb-2">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border border-input rounded-md"
                disabled
              />
            )}

            {field.type === "radio" && (
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input type="radio" name={field.id} disabled className="w-4 h-4" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <div className="space-y-2">
                {field.options?.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2">
                    <input type="checkbox" disabled className="w-4 h-4" />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "date" && (
              <input type="date" className="px-3 py-2 border border-input rounded-md" disabled />
            )}

            {field.type === "file" && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <span className="text-muted-foreground">📷 이미지 선택</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Builder */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">양식 정보</h2>
            <div className="space-y-4">
              <Input label="양식 제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">양식 설명</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md resize-none"
                  rows={3}
                  placeholder="양식에 대한 설명을 입력하세요"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">항목 추가</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => addField("text")}>
                📝 텍스트
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("radio")}>
                ⚪ 단일선택
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("checkbox")}>
                ☑️ 다중선택
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("date")}>
                📅 날짜
              </Button>
              <Button variant="outline" size="sm" onClick={() => addField("file")} className="col-span-2">
                📷 파일업로드
              </Button>
            </div>
          </Card>

          <div className="space-y-4">{fields.map((field, index) => renderFieldEditor(field, index))}</div>

          <div className="flex space-x-4">
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline" fullWidth>
              {showPreview ? "편집 모드" : "미리보기"}
            </Button>
            <Button onClick={handleSave} fullWidth disabled={!title.trim()}>
              양식 저장
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">미리보기</h3>
          {showPreview ? (
            renderPreview()
          ) : (
            <div className="text-center text-muted-foreground py-12">미리보기 모드를 활성화하세요</div>
          )}
        </div>
      </div>
    </div>
  )
}
