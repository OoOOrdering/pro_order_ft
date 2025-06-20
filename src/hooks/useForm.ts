import { useState } from "react";

export interface UseFormOptions<T> {
  initial: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => Promise<void>;
}

export function useForm<T>({ initial, validate, onSubmit }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement & { checked?: boolean };
    const checked = (e.target as HTMLInputElement).checked;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate) {
      const newErrors = validate(values);
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) return;
    }
    setLoading(true);
    setSuccess("");
    try {
      await onSubmit(values);
      setSuccess("성공적으로 처리되었습니다.");
    } catch (err) {
      setErrors({ form: (err as Error).message } as Partial<Record<keyof T, string>>);
    } finally {
      setLoading(false);
    }
  };

  return { values, setValues, errors, setErrors, loading, success, handleChange, handleSubmit };
}
