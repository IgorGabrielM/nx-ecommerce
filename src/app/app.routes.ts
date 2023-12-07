import { Route } from '@angular/router';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { CreateProductComponent } from './create-product/create-product.component';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
    },
    {
        path: 'auth',
        component: AuthComponent,
    },
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'create-product',
        component: CreateProductComponent,
        canActivate: [AuthGuard]
    },
];
