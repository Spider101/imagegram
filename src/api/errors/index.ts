export interface ApiError {
    code: number;
    message: string;
}

export default {
    badRequest: (errMessage: string): ApiError => ({ code: 400, message: errMessage }),
    notFound: (errMessage: string): ApiError => ({ code: 404, message: errMessage }),
    unprocessable: (errMessage: string): ApiError => ({ code: 422, message: errMessage }),
    unauthorized: (errMessage: string): ApiError => ({ code: 401, message: errMessage }),
    internal: (errMessage: string): ApiError => ({ code: 500, message: errMessage })
};