import { Injectable } from '@angular/core'
import { PostgrestSingleResponse, SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { UserDetailModel } from 'src/models/user.model'

@Injectable({
    providedIn: 'root',
})
export class UserDetailService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async find(id: number): Promise<PostgrestSingleResponse<UserDetailModel[]>> {
        return await this.supabase.from('user_detail').select("*").eq('id', id).select('*')
    }

    async findByIdUser(userId: string): Promise<PostgrestSingleResponse<UserDetailModel[]>> {
        return await this.supabase.from('user_detail').select("*").eq('id_user', userId).select('*')
    }

    async create(payload: UserDetailModel) {
        return await this.supabase
            .from('user_detail')
            .insert(payload)
    }
}