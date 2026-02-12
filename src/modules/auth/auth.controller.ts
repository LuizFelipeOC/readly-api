import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.services";
import { ILoginRequest, IRegistrationRequest } from "./auth.types";
import { IAuthError } from "./auth.errors";

export class AuthController {
    constructor(private readonly authService: AuthService) { }

    async authentication(
        request: FastifyRequest<{ Body: ILoginRequest }>,
        reply: FastifyReply,
    ) {
        try {
            const result = await this.authService.login(request.body)

            return reply.code(200).send(result)
        } catch (err: any) {
            if (err instanceof IAuthError) {
                if (err.code === 400) {
                    return reply.code(401).send({
                        message: 'As credenciais fornecidas são inválidas. Por favor, verifique seu email e senha e tente novamente.',
                    })
                }

                return reply.code(err.code ?? 500).send({
                    message: 'Ocorreu um erro durante a autenticação. Por favor, tente novamente mais tarde.',
                })
            }

            return reply.code(500).send({
                message: 'Ocorreu um erro inesperado durante a autenticação. Por favor, tente novamente mais tarde.',
            })
        }
    }

    async registration(
        request: FastifyRequest<{ Body: IRegistrationRequest }>,
        reply: FastifyReply,
    ) {
        try {
            const result = await this.authService.registration(request.body)

            return reply.code(201).send(result)
        } catch (err: any) {
            if (err instanceof IAuthError) {
                return reply.code(err.code ?? 500).send({
                    message: err.message ?? 'Ocorreu um erro durante o registro. Por favor, tente novamente mais tarde.',
                })
            }

            return reply.code(500).send({
                message: 'Ocorreu um erro inesperado durante o registro. Por favor, tente novamente mais tarde.',
            })
        }
    }
}