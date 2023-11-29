import { Route } from '@angular/router';
import { AuthGuard } from 'src/guard/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

export const appRoutes: Route[] = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth'
    },
    {
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'sign-up',
                component: SignUpComponent
            }
        ]
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
];
