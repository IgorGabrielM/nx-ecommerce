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
        path: 'product-information',
        canActivate: [AuthGuard],
        loadComponent: () => import('../app/components/product-carousel/product-information/product-information.component').then((c => c.ProductInformationComponent))
    },
    {
        path: 'create-product',
        canActivate: [AuthGuard],
        loadComponent: () => import('../app/create-product/create-product.component').then((c => c.CreateProductComponent))
    },
    {
        path: 'user',
        canActivate: [AuthGuard],
        loadComponent: () => import('../app/user/user.component').then((c => c.UserComponent))
    },
    {
        path: 'purchase-information',
        canActivate: [AuthGuard],
        loadComponent: () => import('../app/purchase-information/purchase-information.component').then((c => c.PurchaseInformationComponent))
    }
];
