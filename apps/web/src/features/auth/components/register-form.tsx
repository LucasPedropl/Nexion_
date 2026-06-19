"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@nexion/database";
import { Button } from "@/features/core/components/ui/button";
import { Input } from "@/features/core/components/ui/input";
import { FieldError, Label } from "@/features/core/components/ui/label";
import { useAuth } from "@/features/auth/providers/auth-provider";

export function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setError(null);
    setSuccess(null);
    try {
      const { needsEmailConfirmation } = await signUp(
        data.name,
        data.email,
        data.password,
      );
      if (needsEmailConfirmation) {
        setSuccess("Conta criada! Confirme seu e-mail para entrar.");
        return;
      }
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar a conta. Tente novamente.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" placeholder="Seu nome" autoComplete="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="voce@empresa.com"
          autoComplete="email"
          {...register("email")}
        />
        <FieldError message={errors.email?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("password")}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          {...register("confirmPassword")}
        />
        <FieldError message={errors.confirmPassword?.message} />
      </div>

      {success && <p className="text-sm text-brand">{success}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Criando conta..." : "Criar conta"}
      </Button>

      <p className="text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
