import { z } from "zod";

export const authenticationRequestSchema = z.object({
    email: z.string().nonempty("E-mail do usuário é obrigatório").email("E-mail do usuário é inválido"),
    password: z.string().nonempty("Senha do usuário é obrigatória"),
});

export type AuthenticationRequest = z.infer<typeof authenticationRequestSchema>;

export const registrationRequestSchema = z.object({
    email: z.string().nonempty("E-mail do usuário é obrigatório").email("E-mail do usuário é inválido"),
    password: z.string().nonempty("Senha do usuário é obrigatória").min(8, "A senha deve ter ao menos 8 caracteres"),
    firstName: z.string().nonempty("Nome é obrigatório"),
    lastName: z.string().nonempty("Sobrenome é obrigatório"),
});

export type RegistrationRequest = z.infer<typeof registrationRequestSchema>;