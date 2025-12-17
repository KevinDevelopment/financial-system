export interface HttpResponse {
    code: number | undefined;
    message: string | undefined;
    body?: any;
}

export interface HttpRequest {
    body?: any;
    headers?: any;
    params?: any;
    query?: any;
    tenant?: any;
    ip?: any;
}
