// server/utils/passwordVerifyError.ts
export class AuthError extends Error {
    constructor(message: string) {
      super(message)
      this.name = 'AuthError'
    }
  }
  
  // isPasswordVerifyErrorガード関数
  export const isAuthError = (error: unknown): error is AuthError => {
    return error instanceof AuthError
  }