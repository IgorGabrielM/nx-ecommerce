import { Injectable } from '@angular/core'
import { PostgrestSingleResponse, SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { PurchaseModel } from 'src/models/purchase.model'

@Injectable({
    providedIn: 'root',
})
export class PurchaseService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async listByUser(userDetailId: number): Promise<PostgrestSingleResponse<PurchaseModel[]>> {
        return await this.supabase.from('purchase').select()
    }

    async find(id: string): Promise<PostgrestSingleResponse<PurchaseModel[]>> {
        return await this.supabase.from('purchase').select("*").eq('id', id)
    }

    async update(purchase: PurchaseModel): Promise<PostgrestSingleResponse<PurchaseModel>> {
        return await this.supabase.from('purchase').update(purchase).eq('id', purchase.id)
    }

    async delete(purchaseId: string): Promise<PostgrestSingleResponse<PurchaseModel>> {
        return await this.supabase.from('purchase').delete().eq('id', purchaseId)
    }

    async create(purchase: PurchaseModel) {
        purchase = {
            ...purchase,
            user_id: JSON.parse(localStorage.getItem('sb-wdbzebrfirgiirdyqgku-auth-token')).user.identities[0].user_id,
            user_detail_id: JSON.parse(localStorage.getItem('userData')).userDetailId,
            products: purchase.products.map((product) => { return { ...product, delivery_statuses: [{ id: '1', name: 'Pedido feito', changed_at: new Date() }] } })
        };
        return await this.supabase.from('purchase').insert<PurchaseModel>(purchase).select();
    }

}