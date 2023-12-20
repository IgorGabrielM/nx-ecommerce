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
import { ImageService } from 'src/services/image.service';

@Component({
  selector: 'nx-ecommerce-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    HlmButtonDirective, HlmInputDirective],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  loading: boolean = false

  fileUrl: {
    urlObj: string
    path: string
  }

  signUpForm: FormGroup

  constructor(
    private authService: AuthService,
    private userDetailsService: UserDetailService,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,

    private readonly fb: FormBuilder,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      image: [''],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileUrl = { path: '', urlObj: '' }

      this.signUpForm.value.image = fileList[0];
      this.fileUrl.urlObj = URL.createObjectURL(this.signUpForm.value.image)
      this.imageService.uploadImageUser(this.signUpForm.value.image).then(({ data: img }) => {
        this.fileUrl.path = img.path
        this.signUpForm.value.image = img.path
      })
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      this.authService.signUpNewUser(this.signUpForm.value).then((res) => {
        const userIdCreated = res.data.user.identities[0].user_id
        this.shoppingCartService.create({ products: [] }).then((shoppingCart) => {
          if (shoppingCart && shoppingCart.data) {
            const payload: UserDetailModel = { id_user: userIdCreated, username: this.signUpForm.value.name, id_position: 1, id_shopping_cart: Number((shoppingCart.data[0] as any).id), image: this.fileUrl.path }
            this.userDetailsService.create(payload).then(() => {
              this.loading = false
              this.router.navigate(['/home'])
            })
          }
        })
        /*toast-> this.snackBar.open('Conta criada com sucesso', 'Fechar', { duration: 2000 }); */
      }, (err) => {
        this.loading = false
        this.signUpForm.reset()
        this.fileUrl = undefined
      })
    }
    finally {
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
