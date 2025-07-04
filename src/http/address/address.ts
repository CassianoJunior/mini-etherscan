/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Mini Etherscan ***DEV***
 * OpenAPI spec version: 0.1.0
 */
import {
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  GetAddressAddressAddressTransactionsGetParams,
  HTTPValidationError
} from '../miniEtherscanDEV.schemas';

import { api } from '../../lib/axios';
import type { ErrorType } from '../../lib/axios';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



/**
 * @summary Search for a account address
 */
export const getAddressAddressAddressGet = (
    address: string,
 options?: SecondParameter<typeof api>,signal?: AbortSignal
) => {
      
      
      return api<unknown>(
      {url: `/address/${address}`, method: 'GET', signal
    },
      options);
    }
  

export const getGetAddressAddressAddressGetQueryKey = (address: string,) => {
    return [`/address/${address}`] as const;
    }

    
export const getGetAddressAddressAddressGetQueryOptions = <TData = Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError = ErrorType<void | HTTPValidationError>>(address: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError, TData>>, request?: SecondParameter<typeof api>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAddressAddressAddressGetQueryKey(address);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAddressAddressAddressGet>>> = ({ signal }) => getAddressAddressAddressGet(address, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(address), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAddressAddressAddressGetQueryResult = NonNullable<Awaited<ReturnType<typeof getAddressAddressAddressGet>>>
export type GetAddressAddressAddressGetQueryError = ErrorType<void | HTTPValidationError>


export function useGetAddressAddressAddressGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAddressAddressAddressGet>>,
          TError,
          Awaited<ReturnType<typeof getAddressAddressAddressGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAddressAddressAddressGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAddressAddressAddressGet>>,
          TError,
          Awaited<ReturnType<typeof getAddressAddressAddressGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAddressAddressAddressGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError, TData>>, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Search for a account address
 */

export function useGetAddressAddressAddressGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressGet>>, TError, TData>>, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAddressAddressAddressGetQueryOptions(address,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



/**
 * @summary Fetch account address transactions
 */
export const getAddressAddressAddressTransactionsGet = (
    address: string,
    params?: GetAddressAddressAddressTransactionsGetParams,
 options?: SecondParameter<typeof api>,signal?: AbortSignal
) => {
      
      
      return api<unknown>(
      {url: `/address/${address}/transactions`, method: 'GET',
        params, signal
    },
      options);
    }
  

export const getGetAddressAddressAddressTransactionsGetQueryKey = (address: string,
    params?: GetAddressAddressAddressTransactionsGetParams,) => {
    return [`/address/${address}/transactions`, ...(params ? [params]: [])] as const;
    }

    
export const getGetAddressAddressAddressTransactionsGetQueryOptions = <TData = Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError = ErrorType<void | HTTPValidationError>>(address: string,
    params?: GetAddressAddressAddressTransactionsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError, TData>>, request?: SecondParameter<typeof api>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAddressAddressAddressTransactionsGetQueryKey(address,params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>> = ({ signal }) => getAddressAddressAddressTransactionsGet(address,params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(address), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAddressAddressAddressTransactionsGetQueryResult = NonNullable<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>>
export type GetAddressAddressAddressTransactionsGetQueryError = ErrorType<void | HTTPValidationError>


export function useGetAddressAddressAddressTransactionsGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string,
    params: undefined |  GetAddressAddressAddressTransactionsGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>,
          TError,
          Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAddressAddressAddressTransactionsGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string,
    params?: GetAddressAddressAddressTransactionsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>,
          TError,
          Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useGetAddressAddressAddressTransactionsGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string,
    params?: GetAddressAddressAddressTransactionsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError, TData>>, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Fetch account address transactions
 */

export function useGetAddressAddressAddressTransactionsGet<TData = Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError = ErrorType<void | HTTPValidationError>>(
 address: string,
    params?: GetAddressAddressAddressTransactionsGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAddressAddressAddressTransactionsGet>>, TError, TData>>, request?: SecondParameter<typeof api>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAddressAddressAddressTransactionsGetQueryOptions(address,params,options)

  const query = useQuery(queryOptions , queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}



