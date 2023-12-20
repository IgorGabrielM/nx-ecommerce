import { Route } from '@angular/router';
import { AuthGuard } from 'src/guard/auth.guard';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
    },
    {
        path: 'auth',
        loadComponent: () => import('../app/auth/auth.component').then((c => c.AuthComponent))
    },
    {
        path: 'sign-up',
        loadComponent: () => import('../app/auth/sign-up/sign-up.component').then((c => c.SignUpComponent))
    },
    {
        path: 'home',
        canActivate: [AuthGuard],
        loadComponent: () => import('../app/home/home.component').then((c => c.HomeComponent))
    },
    {
        path: 'create-product',
        canActivate: [AuthGuard],
        loadComponent: () => import('../app/create-product/create-product.component').then((c => c.CreateProductComponent))
    },
];
