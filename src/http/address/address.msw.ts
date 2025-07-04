/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * Mini Etherscan ***DEV***
 * OpenAPI spec version: 0.1.0
 */
import {
  HttpResponse,
  delay,
  http
} from 'msw';



export const getGetAddressAddressAddressGetMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown)) => {
  return http.get('*/address/:address', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 200,
        
      })
  })
}

export const getGetAddressAddressAddressTransactionsGetMockHandler = (overrideResponse?: unknown | ((info: Parameters<Parameters<typeof http.get>[1]>[0]) => Promise<unknown> | unknown)) => {
  return http.get('*/address/:address/transactions', async (info) => {await delay(1000);
  if (typeof overrideResponse === 'function') {await overrideResponse(info); }
    return new HttpResponse(null,
      { status: 200,
        
      })
  })
}
export const getAddressMock = () => [
  getGetAddressAddressAddressGetMockHandler(),
  getGetAddressAddressAddressTransactionsGetMockHandler()
]
