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

    async listByCategory(categoryId: string): Promise<PostgrestSingleResponse<ProductModel[]>> {
        return await this.supabase.from('product').select("*").eq("id_category", categoryId)
    }

    async find(id: string): Promise<PostgrestSingleResponse<ProductModel[]>> {
        return await this.supabase.from('product').select("*").eq('id', id)
    }

    async search(str: string): Promise<PostgrestSingleResponse<ProductModel[]>> {
        return await this.supabase.from('product').select("*").ilike('name', `%${str}%`)
    }

    async update(product: ProductModel): Promise<PostgrestSingleResponse<ProductModel>> {
        return await this.supabase.from('product').update(product).eq('id', product.id)
    }

    async delete(productId: string): Promise<PostgrestSingleResponse<ProductModel>> {
        return await this.supabase.from('product').delete().eq('id', productId)
    }

    async create(product: ProductModel) {
        return await this.supabase
            .from('product')
            .insert(product)
    }

}