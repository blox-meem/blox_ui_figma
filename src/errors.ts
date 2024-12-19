abstract class BloxUIError implements Error {
    name: string;
    message: string;
    stack?: string | undefined;
    
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        this.name = params?.name ?? 'BloxUIError';
        this.message = params?.message ?? 'A generic error occurred';
        this.stack = params?.stack;
    }
}

export class ValidationError extends BloxUIError {
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        super({
            name: params?.name ?? 'ValidationError',
            message: params?.message ?? 'A validation error occurred',
            stack: params?.stack,
        });
    }
}

export class CodeConvertionError extends BloxUIError {
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        super({
            name: params?.name ?? 'CodeConvertionError',
            message: params?.message ?? 'A code convertion error occurred',
            stack: params?.stack,
        });
    }
}

export class ObjectConvertionError extends BloxUIError {
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        super({
            name: params?.name ?? 'ObjectConvertionError',
            message: params?.message ?? 'A object convertion error occurred',
            stack: params?.stack,
        });
    }
}

export class DownloadError extends BloxUIError {
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        super({
            name: params?.name ?? 'DownloadError',
            message: params?.message ?? 'A download error occurred',
            stack: params?.stack,
        });
    }
}

export class NavigationError extends BloxUIError {
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        super({
            name: params?.name ?? 'NavigationError',
            message: params?.message ?? 'A navigation error occurred',
            stack: params?.stack,
        });
    }
}

export class UnhandledKeyError extends BloxUIError {
    constructor(params?: {
        name?: string,
        message?: string,
        stack?: string | undefined,
    }) {
        super({
            name: params?.name ?? 'NavigationError',
            message: params?.message ?? 'A navigation error occurred',
            stack: params?.stack,
        });
    }
}
