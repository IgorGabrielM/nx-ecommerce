import { Injectable } from '@angular/core'
import { SupabaseClient, User, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { UserAuthModel } from 'src/models/user.model'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async isAuthenticated(): Promise<boolean> {
        try {
            const user = await this.supabase.auth.getUser();
            return user.data.user !== null;
        } catch (error) {
            return false;
        }
    }

    async signUpNewUser(user: UserAuthModel) {
        return await this.supabase.auth.signUp({
            email: user.email,
            password: user.password,
        })
    }

    async signInWithEmail(user: UserAuthModel) {
        return await this.supabase.auth.signInWithPassword({
            email: user.email,
            password: user.password
        })
    }

    async signOut() {
        return await this.supabase.auth.signOut()
    }

}