export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  password: string
  name: string
}
