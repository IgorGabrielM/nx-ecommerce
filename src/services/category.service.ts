import { Injectable } from '@angular/core'
import { PostgrestSingleResponse, SupabaseClient, User, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { CategoryModel } from 'src/models/category.model'

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async list(): Promise<PostgrestSingleResponse<CategoryModel[]>> {
        return await this.supabase.from('category').select()
    }

}