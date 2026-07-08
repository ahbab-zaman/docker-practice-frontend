import api from "./api"
import type { ApiResponse } from "@/types/api.types"
import type { User, LoginPayload, RegisterPayload } from "@/types/auth.types"

export async function register(
  payload: RegisterPayload,
): Promise<ApiResponse<User>> {
  const { data } = await api.post<ApiResponse<User>>("/auth/register", payload)
  return data
}

export async function login(
  payload: LoginPayload,
): Promise<ApiResponse<User>> {
  const { data } = await api.post<ApiResponse<User>>("/auth/login", payload)
  return data
}

export async function logout(): Promise<ApiResponse<void>> {
  const { data } = await api.post<ApiResponse<void>>("/auth/logout")
  return data
}

export async function getMe(): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>("/user/me")
  return data
}
