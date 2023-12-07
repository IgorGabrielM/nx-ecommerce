import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { UserDetailModel } from 'src/models/user.model';
import { UserDetailService } from 'src/services/user.service';

@Component({
  selector: 'nx-ecommerce-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    HlmButtonDirective, HlmInputDirective],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  loading: boolean = false

  signUpForm: FormGroup

  constructor(
    private authService: AuthService,
    private userDetailsService: UserDetailService,
    private shoppingCartService: ShoppingCartService,

    private readonly fb: FormBuilder,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      this.authService.signUpNewUser(this.signUpForm.value).then((res) => {
        const userIdCreated = Number(res.data.user.identities[0].user_id)
        console.log(res.data.user)
        console.log(userIdCreated)
        this.shoppingCartService.create({}).then((shoppingCart) => {
          if (shoppingCart) {
            const payload: UserDetailModel = { id_user: userIdCreated, id_position: 1, id_shopping_cart: Number(shoppingCart.data.id) }
            this.userDetailsService.create(payload).then(() => this.loading = false)
          }
        })
        /*toast-> this.snackBar.open('Conta criada com sucesso', 'Fechar', { duration: 2000 }); */
      }, (err) => {
        this.loading = false
      })
    }
    finally {
      this.signUpForm.reset()
    }
  }

  confirmationPasswordIsCorrect(): boolean {
    if (this.signUpForm.value.password !== this.signUpForm.value.passwordConfirmation
      && this.signUpForm.value.password.length > 0 && this.signUpForm.value.passwordConfirmation.length > 0) {
      return false
    } else {
      return true
    }
  }
}
