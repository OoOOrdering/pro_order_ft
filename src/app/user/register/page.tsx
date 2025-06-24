"use client"
import { useState } from "react"
import type React from "react"
import api from "@/utils/axios"
import { useRouter } from "next/navigation"
import Card from "@/components/Card"
import Button from "@/components/Button"
import Input from "@/components/Input"
import Link from "next/link"
import { useAsync } from "@/hooks/useAsync"
import Toast from "@/components/Toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [nicknameLength, setNicknameLength] = useState(0)
  const router = useRouter()
  const { loading, error, run } = useAsync(async (data: typeof formData) => {
    return api.post("/users/register/", {
      email: data.email,
      password: data.password,
      password_confirm: data.passwordConfirm,
      nickname: data.nickname.trim(),
    })
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "nickname") {
      setNicknameLength(value.trim().length)
      setFormData((prev) => ({ ...prev, [name]: value.slice(0, 10) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다"
    }
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 8자 이상이어야 합니다"
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다"
    }
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요"
    } else if (formData.nickname.trim().length > 10) {
      newErrors.nickname = "닉네임은 10자 이내로 입력해주세요"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      await run(formData)
      Toast.show({ type: "success", message: "회원가입이 완료되었습니다! 이메일 인증을 확인해주세요." })
      setTimeout(() => router.push("/login"), 2000)
    } catch (err: any) {
      const errorData = err?.response?.data
      if (typeof errorData === "object") {
        setErrors(errorData)
      } else {
        {
          const err: any = error;
          Toast.show({ type: "error", message: typeof err === "string" ? err : err?.message ? err.message : JSON.stringify(err) })
        }
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">PR</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
          <p className="mt-2 text-gray-600">새 계정을 만들어 서비스를 시작하세요</p>
        </div>

        {/* Registration Form */}
        <Card>
          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              label="이메일"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              error={errors.email}
              required
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              }
            />

            <Input
              label="닉네임"
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력하세요"
              error={errors.nickname}
              required
              maxLength={10}
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              }
              helperText={`(${nicknameLength}/10자)`}
            />

            <Input
              label="비밀번호"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="8자 이상 입력하세요"
              error={errors.password}
              helperText="영문, 숫자, 특수문자를 포함하여 8자 이상"
              required
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />

            <Input
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호를 다시 입력하세요"
              error={errors.passwordConfirm}
              required
              leftIcon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              </div>
            )}

            <Button type="submit" fullWidth size="lg" loading={loading}>
              {loading ? "가입 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                로그인
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
