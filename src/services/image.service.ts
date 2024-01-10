import { Injectable } from '@angular/core'
import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { ProductModel } from 'src/models/product.model'

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    getByPath(path: string) {
        return this.supabase.storage.from('ecommerce').getPublicUrl(path)
    }

    async uploadImage(image) {
        return await this.supabase.storage.from('ecommerce').upload(`products/product_${Date.now()}.png`, image)
    }

    async uploadImageUser(image) {
        return await this.supabase.storage.from('ecommerce').upload(`users/user_${Date.now()}.png`, image)
    }

    loadImageForProducts(products: ProductModel[]): ProductModel[] {
        products.forEach(async (product) => {
            product.imageUrl = (await this.getByPath(product.image)).data.publicUrl
        })
        return products
    }
}