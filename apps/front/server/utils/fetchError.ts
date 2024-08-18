import { FetchError } from 'ofetch'

// FetchErrorかどうかをチェックするガード関数
export const isFetchError = (error: unknown): error is FetchError => {
  return error instanceof FetchError;
}