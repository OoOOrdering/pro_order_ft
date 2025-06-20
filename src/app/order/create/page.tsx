"use client"
import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState } from "react"
import React from "react"

import { createOrder } from "@/api/swagger"
import type { OrderCreate, OrderItem } from "@/types/swagger"
import Button from "@/components/Button"
import Input from "@/components/Input"
import Card from "@/components/Card"
import PageHeader from "@/components/PageHeader"
import Loading from "@/components/Loading"
import ErrorMessage from "@/components/ErrorMessage"
import { useRouter } from "next/navigation";
import { useAsync } from "@/hooks/useAsync";
import Toast from "@/components/Toast";

const defaultItem: OrderItem = { product_name: "", quantity: 1, price: "0" };

const schema: yup.Schema<OrderCreate> = yup.object({
  shipping_address: yup.string().required("주소를 입력하세요."),
  shipping_phone: yup.string().required("연락처를 입력하세요."),
  shipping_name: yup.string().required("수령인을 입력하세요."),
  shipping_memo: yup.string(),
  items: yup.array().of(
    yup.object({
      product_name: yup.string().required("상품명을 입력하세요."),
      quantity: yup.number().min(1, "수량은 1 이상이어야 합니다.").required("수량을 입력하세요.").typeError("수량은 숫자여야 합니다."),
      price: yup.string().required("가격을 입력하세요.").test("is-number", "가격은 숫자여야 합니다.", v => !isNaN(Number(v)))
    }) as yup.Schema<OrderItem>
  ).min(1, "최소 1개 상품을 입력하세요.").required(),
  payment_method: yup.string().required("결제수단을 선택하세요."),
  payment_id: yup.string().notRequired().nullable(),
  total_amount: yup.string(),
});

export default function OrderCreatePage() {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<OrderCreate>({
    defaultValues: {
      shipping_address: "",
      shipping_phone: "",
      shipping_name: "",
      shipping_memo: "",
      items: [{ ...defaultItem }],
      payment_method: "카드",
      total_amount: "0",
    },
    resolver: yupResolver(schema) as any,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter();

  // 주문 등록 useAsync 적용
  const { run: createOrderAsync, loading: creating } = useAsync(createOrder, {
    onSuccess: (res) => {
      Toast.show({ type: "success", message: "주문이 생성되었습니다!" });
      setTimeout(() => router.push(`/order/${res.data.id}`), 1500);
    },
    onError: (err) => {
      Toast.show({ type: "error", message: err?.message || "오류 발생" });
    },
  });

  const updateTotal = (items: OrderItem[]) => {
    const total = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    setValue("total_amount", String(total));
  };

  // 상품 정보 변경 시 합계 자동 계산
  const items = watch("items");
  React.useEffect(() => { updateTotal(items); }, [items]);

  const onSubmit = async (data: OrderCreate) => {
    await createOrderAsync(data);
  };

  if (creating) return <Loading text="주문을 생성하는 중..." />

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="새 주문 생성"
        subtitle="주문 정보를 입력하여 새로운 주문을 생성하세요"
        breadcrumb={[{ label: "주문", href: "/order" }, { label: "새 주문" }]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 배송 정보 */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            배송 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...register("shipping_name")}
              label="수령인"
              placeholder="받으실 분 성함"
              error={errors.shipping_name?.message}
            />
            <Input
              {...register("shipping_phone")}
              label="연락처"
              placeholder="010-0000-0000"
              error={errors.shipping_phone?.message}
            />
          </div>
          <Input
            {...register("shipping_address")}
            label="주소"
            placeholder="배송지 주소"
            error={errors.shipping_address?.message}
          />
          <Input
            {...register("shipping_memo")}
            label="배송 메모"
            placeholder="요청사항 등"
            error={errors.shipping_memo?.message}
          />
        </Card>

        {/* 상품 정보 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              주문 상품
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ ...defaultItem })}>
              상품 추가
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, idx) => {
              const item = items[idx] || {};
              return (
                <div key={field.id || idx} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                  <Input
                    {...register(`items.${idx}.product_name` as const)}
                    label="상품명"
                    error={errors.items?.[idx]?.product_name?.message}
                  />
                  <Input
                    {...register(`items.${idx}.quantity` as const)}
                    label="수량"
                    type="number"
                    error={errors.items?.[idx]?.quantity?.message}
                  />
                  <Input
                    {...register(`items.${idx}.price` as const)}
                    label="가격"
                    type="number"
                    error={errors.items?.[idx]?.price?.message}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.price && item.quantity ? (Number(item.price) * Number(item.quantity)).toLocaleString() : 0}원</span>
                    <Button type="button" onClick={() => remove(idx)} variant="danger">삭제</Button>
                  </div>
                </div>
              );
            })}
            {errors.items?.message && <div className="text-destructive mt-2">{errors.items.message}</div>}
          </div>
        </Card>

        {/* 결제 정보 */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            결제 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">결제 방법</label>
              <select
                {...register("payment_method")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="카드">신용카드</option>
                <option value="계좌이체">계좌이체</option>
                <option value="무통장입금">무통장입금</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                총 {Number(watch("total_amount")).toLocaleString()}원
              </div>
              <div className="text-sm text-gray-500">VAT 포함</div>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={loading}
            disabled={
              !watch("shipping_name") ||
              !watch("shipping_phone") ||
              !watch("shipping_address") ||
              fields.some((item) => !item.product_name)
            }
          >
            {loading ? "주문 생성 중..." : "주문하기"}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push("/order")} className="sm:w-auto">
            취소
          </Button>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-green-700">{success}</span>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
