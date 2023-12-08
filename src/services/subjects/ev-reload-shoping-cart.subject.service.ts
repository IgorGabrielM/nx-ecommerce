import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EventRealodShopingCartService {
    private reload = new Subject<boolean>();

    sendEvent(data: boolean) {
        this.reload.next(data);
    }

    getEvent() {
        return this.reload.asObservable();
    }
}
