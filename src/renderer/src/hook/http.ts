import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  Method,
} from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

const CancelToken = axios.CancelToken;

const http = axios.create({
  baseURL: "http://localhost:3000/api/webfolder",
  headers: {
    mac: "",
    "content-type": "application/json;utf-8",
  },
});

interface Response<T> {
  result: number;
  data: T;
}

class HttpError extends Error {
  /**
   * @param {string} message 错误信息
   * @param {number} code 错误代码
   */
  constructor(message: string, public code?: number) {
    super(message);
  }
}

function isResponseObject<T>(obj: unknown): obj is Response<T> {
  return (
    typeof obj === "object" &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (obj as unknown as any).result === "number"
  );
}

class Http {
  private currentId = 0;
  private requestMap = new Map<number, CancelTokenSource>();

  public dispose(message?: string) {
    this.requestMap.forEach(source => {
      source.cancel(message);
    });
  }

  public request<T>(
    method: Method,
    url: string,
    options: AxiosRequestConfig
  ): Promise<T> {
    this.currentId++;

    const requestID = this.currentId;

    // 设置取消
    options.cancelToken = options.cancelToken
      ? options.cancelToken
      : (() => {
          const source = CancelToken.source();
          this.requestMap.set(requestID, source);
          return source.token;
        })();

    return http
      .request<T>({
        method: method,
        url: url,
        timeout: 1000 * 60,
        ...options,
      })
      .then((resp: AxiosResponse<T>) => {
        this.requestMap.delete(requestID);

        if (isResponseObject<T>(resp.data)) {
          // -1 才是正确的
          if ((resp.data as unknown as Response<T>).result === -1) {
            return Promise.resolve(resp.data.data);
          } else {
            return Promise.reject(new HttpError("请求错误", resp.data.result));
          }
        }

        return Promise.resolve(resp.data);
      })
      .catch(err => {
        this.requestMap.delete(requestID);

        if (axios.isCancel(err)) {
          return Promise.reject(new HttpError("请求被取消"));
        }
        if (axios.isAxiosError(err)) {
          return Promise.reject(
            new HttpError(err.response?.statusText || err.message)
          );
        }
        return Promise.reject(err);
      });
  }

  public get<T>(url: string, options: AxiosRequestConfig = {}) {
    return this.request<T>("GET", url, options);
  }

  public post<T>(url: string, options: AxiosRequestConfig = {}) {
    return this.request<T>("POST", url, options);
  }
}

export function useHttp(): Http {
  const client = useMemo(() => new Http(), []);

  // 页面销毁的时候，取消所有未完成的请求
  useEffect(() => {
    return () => {
      client.dispose("组建销毁，中止请求");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return client;
}

export function useApi<T>(
  method: Method,
  url: string,
  options: AxiosRequestConfig = {},
  immediately = false
): [
  boolean,
  HttpError | null,
  T | null,
  () => Promise<void>,
  (message?: string) => void
] {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [err, setError] = useState<Error | null>(null);
  const client = useMemo(() => new Http(), []);
  const cancel = useCallback(() => client.dispose.bind(client), [client]);

  const memoizedRequestCallback = useCallback(() => {
    setLoading(true);
    return client
      .request<T>(method, url, options)
      .then(resp => {
        setLoading(false);
        setData(resp);
        setError(null);
      })
      .catch(err => {
        setLoading(false);
        setData(null);
        setError(err);
      });
  }, [client, method, url, options]);

  // 页面销毁的时候，取消所有未完成的请求
  useEffect(() => {
    if (immediately) {
      memoizedRequestCallback();
    }

    return () => {
      client.dispose("组建销毁，中止请求");
    };
  }, [client, immediately, memoizedRequestCallback]);

  return [loading, err, data, memoizedRequestCallback, cancel];
}
