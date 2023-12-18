import { Injectable } from '@angular/core'
import { PostgrestSingleResponse, SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { ProductModel } from 'src/models/product.model'
import { ShoppingCartModel } from 'src/models/shoppingCart.model'

@Injectable({
    providedIn: 'root',
})
export class ShoppingCartService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async create(payload: ShoppingCartModel): Promise<PostgrestSingleResponse<ShoppingCartModel>> {
        return await this.supabase
            .from('shopping_cart')
            .insert(payload)
    }

    async find(id: number): Promise<PostgrestSingleResponse<ShoppingCartModel[]>> {
        return await this.supabase.from('shopping_cart').select("*").eq('id', id)
    }

    async insertProduct(product: ProductModel): Promise<PostgrestSingleResponse<ShoppingCartModel[]>> {
        const shoppingCart = await this.find(JSON.parse(localStorage.getItem('userData')).shoppingCartId)
        if (!shoppingCart.data[0].products) {
            const payload: ShoppingCartModel = { ...shoppingCart.data[0], products: [product] }
            return await this.supabase
                .from('shopping_cart')
                .update(payload).eq('id', payload.id).select()
        } else {
            const payload: ShoppingCartModel = { ...shoppingCart.data[0], products: [...shoppingCart.data[0].products, product] }
            return await this.supabase
                .from('shopping_cart')
                .update(payload).eq('id', payload.id).select()
        }
    }

    async update(payload: ShoppingCartModel): Promise<PostgrestSingleResponse<ShoppingCartModel[]>> {
        return await this.supabase
            .from('shopping_cart')
            .update(payload).eq('id', payload.id).select()
    }
}