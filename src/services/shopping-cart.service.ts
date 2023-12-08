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

    async findWithQuantity(id: number): Promise<ShoppingCartModel> {
        const shoppingCart: ShoppingCartModel = (await this.supabase.from('shopping_cart').select("*").eq('id', id)).data[0]
        shoppingCart.products.forEach((product) => {
            if (!product.quantity) {
                product.quantity = 1
            }
        })

        const result = shoppingCart.products.reduce((accumulator: ProductModel[], currentProduct) => {
            const existingProductIndex = accumulator.findIndex(p => p.id === currentProduct.id);

            if (existingProductIndex !== -1) {
                // Se o id já existe, adicione as quantidades
                accumulator[existingProductIndex].quantity += 1;
            } else {
                accumulator.push({ ...currentProduct, quantity: currentProduct.quantity });
            }
            return accumulator;
        }, []);

        const payload: ShoppingCartModel = { ...shoppingCart, products: result }

        return payload
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