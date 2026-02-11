export class IAuthError extends Error {

    constructor(public message: string, public code?: number) {
        super();

        this.message = message;
        this.code = code;
    }
}