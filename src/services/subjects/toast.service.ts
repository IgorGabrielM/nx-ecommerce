import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastSubject = new BehaviorSubject<{ message: string, type: 'success' | 'danger' }[]>([]);
    toasts$ = this.toastSubject.asObservable();

    show(message: string, type: 'success' | 'danger' = 'success', duration: number = 2000) {
        const toasts = this.toastSubject.value.slice();
        toasts.push({ message: message, type: type });
        this.toastSubject.next(toasts);
        setTimeout(() => this.clear(), duration);
    }

    clear() {
        this.toastSubject.next([]);
    }
}
