export interface MyResponse<T>{
    status: 'ok' | 'Created';
    statusCode: 200 | 201;
    message: string;
    reply: T;
}