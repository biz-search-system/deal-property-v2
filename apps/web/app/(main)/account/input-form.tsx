"use client";

import { Button } from "@workspace/ui/components/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export default function InputForm<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  form,
  name,
  label,
  autoComplete,
  placeholder = "********",
  description,
}: {
  form: UseFormReturn<TFieldValues>;
  name: TName;
  label: string;
  autoComplete?: string;
  placeholder?: string;
  description?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, formState: { errors } }) => (
        <FormItem>
          <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:items-center">
            <div className="flex items-center md:col-span-5">
              <FormLabel>{label}</FormLabel>
            </div>
            <div className="flex items-center col-span-7 gap-4">
              <FormControl>
                <Input
                  {...field}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className="text-sm leading-4 px-3 py-2 max-w-72"
                />
              </FormControl>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:items-center">
            <div className="flex col-span-7 col-start-6 items-center">
              {description && !errors[name] && (
                <FormDescription>{description}</FormDescription>
              )}
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
}
