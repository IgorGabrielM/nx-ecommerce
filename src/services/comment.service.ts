import { Injectable } from '@angular/core'
import { PostgrestSingleResponse, SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment'
import { CommentModel } from 'src/models/comment.model'

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    private supabase: SupabaseClient

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
    }

    async listByProduct(productId: string): Promise<PostgrestSingleResponse<CommentModel[]>> {
        return await this.supabase.from('comment').select("*").eq("id_product", productId)
    }

    async delete(commentId: string): Promise<PostgrestSingleResponse<CommentModel>> {
        return await this.supabase.from('comment').delete().eq('id', commentId)
    }

    async create(payload: CommentModel) {
        payload = {
            ...payload,
            id_user_detail: JSON.parse(localStorage.getItem('userData')).userDetailId,
        };
        return await this.supabase.from('comment').insert<CommentModel>(payload).select();
    }

}