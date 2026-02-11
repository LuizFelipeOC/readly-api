import { supabase } from "../plugins/supabase";
import { IAuthError } from "./auth.errors";
import { ILoginRequest } from "./auth.types";

export class AuthService {
    async login(userRequest: ILoginRequest) {
        const { email, password } = userRequest;

        const loginWithSupabase = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (loginWithSupabase.error) {
            throw new IAuthError(loginWithSupabase.error.message, loginWithSupabase.error.status);
        }

        return loginWithSupabase.data
    }
}