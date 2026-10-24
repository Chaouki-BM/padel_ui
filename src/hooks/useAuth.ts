"use client";

import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  signOut,
  verifyEmail,
} from "@/services/auth";
import type { LoginBody, RegisterBody } from "@/schemas/auth";

export function useLogin() {
  return useMutation({
    mutationFn: (body: LoginBody) => login(body),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (body: RegisterBody) => register(body),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: { token: string; password: string }) =>
      resetPassword(input.token, input.password),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: () => signOut(),
  });
}
