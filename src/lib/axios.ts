import { env } from '@/env'
import Axios, { AxiosError, AxiosRequestConfig } from 'axios'

export const AXIOS_INSTANCE = Axios.create({
	baseURL: env.NEXT_PUBLIC_API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})

// add a second `options` argument here if you want to pass extra options to each generated query
export const api = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = Axios.CancelToken.source()
	const promise = AXIOS_INSTANCE({
		...config,
		...options,
		cancelToken: source.token,
	}).then(({ data }) => data)

	// @ts-ignore
	promise.cancel = () => {
		source.cancel('Query was cancelled')
	}

	return promise
}

export type ErrorType<Error> = AxiosError<Error>

export type BodyType<BodyData> = BodyData
