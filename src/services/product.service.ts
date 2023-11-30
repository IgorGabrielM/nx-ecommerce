import { Injectable } from '@angular/core'
import { PostgrestSingleResponse, SupabaseClient, User, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { ProductModel } from 'src/models/product.model'

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async list(): Promise<PostgrestSingleResponse<ProductModel[]>> {
        return await this.supabase.from('product').select()
    }

    async create(product: ProductModel) {
        return await this.supabase
            .from('product')
            .insert(product)
    }

}