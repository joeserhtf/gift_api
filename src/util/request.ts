import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface RequestConfig extends AxiosRequestConfig { }

export interface Response<T = any> extends AxiosResponse<T> { }

export class Request {
    constructor(private request = axios) { }

    public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
        return this.request.get<T, Response<T>>(url, config);
    }

    public post<T>(url: string, data: any = {}, config: RequestConfig = {}): Promise<Response<T>> {
        return this.request.post<T, Response<T>>(url, data, config);
    }

    public put<T>(url: string, data: any = {}, config: RequestConfig = {}): Promise<Response<T>> {
        return this.request.put<T, Response<T>>(url, data, config);
    }

    public static isRequestError(error: AxiosError): boolean {
        return !!(error.response && error.response.status);
    }
}