import { Injectable } from '@angular/core'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async getByPath(path: string) {
        return await this.supabase.storage.from('ecommerce').getPublicUrl(path)
    }

    async uploadImage(image) {
        return await this.supabase.storage.from('ecommerce').upload(`product_${Date.now()}.png`, image)
    }
}