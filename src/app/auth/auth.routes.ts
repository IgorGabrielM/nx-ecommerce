import { Route } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const authRoutes: Route[] = [
    {
        path: '',
        component: AuthComponent,
    },
];
