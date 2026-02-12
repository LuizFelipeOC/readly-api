import { supabase } from "../plugins/supabase";
import { IAuthError } from "./auth.errors";
import { ILoginRequest, IRegistrationRequest } from "./auth.types";

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

        const user = loginWithSupabase.data?.user;
        const session = loginWithSupabase.data?.session;

        if (!user) {
            throw new IAuthError('User not found after successful sign-in', 500);
        }

        // fetch profile from public.profiles (may be created by trigger)
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('firstName, lastName, created_at')
            .eq('id', user.id)
            .single();

        // do not throw if profile missing; return minimal info
        if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 = no rows? Keep generic handling
        }

        return {
            user: {
                id: user.id,
                email: user.email,
            },
            profile: profileData
                ? {
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    createdAt: profileData.created_at,
                }
                : null,
            accessToken: session?.access_token ?? null,
        };
    }

    async registration(userRegistrationRequest: IRegistrationRequest) {
        const { email, password, firstName, lastName } = userRegistrationRequest;

        const registrationWithSupabase = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: { firstName, lastName }
            }
        });

        if (registrationWithSupabase.error) {
            throw new IAuthError(registrationWithSupabase.error.message, registrationWithSupabase.error.status);
        }



        // Profile row is created by DB trigger (auth.users -> public.profiles).
        // Rely on the trigger to avoid race conditions and FK issues.
        return registrationWithSupabase.data
    }
}