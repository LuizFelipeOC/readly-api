import { z } from "zod";

export const authenticationRequestSchema = z.object({
    email: z.string().nonempty("E-mail do usuário é obrigatório").email("E-mail do usuário é inválido"),
    password: z.string().nonempty("Senha do usuário é obrigatória"),
});

export type AuthenticationRequest = z.infer<typeof authenticationRequestSchema>;