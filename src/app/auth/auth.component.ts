import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from 'src/services/subjects/toast.service';
import { ToastComponent } from '../components/toast/toast.component';


@Component({
  selector: 'nx-ecommerce-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule,
    HlmButtonDirective, HlmInputDirective, ToastComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  loading: boolean = false

  signInForm: FormGroup

  constructor(
    private authService: AuthService,
    public toastService: ToastService,

    private readonly fb: FormBuilder,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true;
      const res = await this.authService.signInWithEmail(this.signInForm.value);
      this.loading = false;
      localStorage.setItem('token', res.data.session.access_token);
      this.router.navigate(['/home']);
      this.toastService.show('Login executado com sucesso!');
    } catch (error) {
      this.toastService.show('Credenciais inválidas', 'danger');
      this.loading = false;
    } finally {
      this.signInForm.reset();
    }
  }
}
