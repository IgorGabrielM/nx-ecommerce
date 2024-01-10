import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';
import { Subscription } from 'rxjs';
import { ShoppingCartModel } from 'src/models/shoppingCart.model';
import { AuthService } from 'src/services/auth.service';
import { ImageService } from 'src/services/image.service';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';
import { UserDetailService } from 'src/services/user.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component'
import { PurchaseService } from 'src/services/purchase.service';

@Component({
  selector: 'nx-ecommerce-header',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    HlmButtonDirective,
    BrnSheetCloseDirective,
    BrnSheetComponent,
    BrnSheetContentDirective,
    BrnSheetDescriptionDirective,
    BrnSheetOverlayComponent,
    BrnSheetTitleDirective,
    BrnSheetTriggerDirective,
    HlmSheetCloseDirective,
    HlmSheetContentDirective,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetOverlayDirective,
    HlmSheetTitleDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    RouterModule,
    SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private $reloadProductsSubscription: Subscription;

  shoppingCart: ShoppingCartModel
  showFiller: boolean = false;
  positionId: number
  userImageUrl: string

  constructor(
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,
    private userDetailsService: UserDetailService,
    private purchaseService: PurchaseService,

    private eventRealodShopingCartService: EventRealodShopingCartService,

    private router: Router,
  ) {
    this.$reloadProductsSubscription = this.eventRealodShopingCartService.getEvent().subscribe(() => {
      this.loadingShoppingCart()
    });
  }

  ngOnInit(): void {
    this.loadingShoppingCart()
    this.getPosition()
    this.loadImage()
  }

  getPosition() {
    if (localStorage.getItem('userData')) {
      this.positionId = JSON.parse(localStorage.getItem('userData')).positionId
    }
  }

  loadImage() {
    setTimeout(() => {
      this.userDetailsService.find(JSON.parse(localStorage.getItem('userData')).userDetailId).then(({ data: user }) => {
        this.userImageUrl = this.imageService.getByPath(user[0].image).data.publicUrl
      })
    }, 1000)
  }

  loadingShoppingCart() {
    if (localStorage.getItem('userData')) {
      const shoppingCartId = JSON.parse(localStorage.getItem('userData')).shoppingCartId
      this.shoppingCartService.find(shoppingCartId).then(({ data: shoppingCart }) => {
        shoppingCart[0].products = this.imageService.loadImageForProducts(shoppingCart[0].products)
        this.shoppingCart = shoppingCart[0]
      })
    }
  }

  removeProductOfShoppingCart(index: number) {
    this.shoppingCart.products.splice(index, 1)
    this.shoppingCartService.update(this.shoppingCart).then()
  }

  getTotalValue(): number {
    let total: number = 0
    this.shoppingCart.products.forEach((product) => {
      total += (product.price - product.discount)
    })
    return total
  }

  getTotalValueWithoutDiscount(): number {
    let total: number = 0
    this.shoppingCart.products.forEach((product) => {
      total += product.price
    })
    return total
  }

  purchaseShoppingCart() {
    this.purchaseService.create({ shopping_cart_id: Number(this.shoppingCart.id), products: this.shoppingCart.products })
    this.shoppingCart = { ...this.shoppingCart, products: [] }
    this.shoppingCartService.update(this.shoppingCart).then(() => {
      //rota para pós compra
    })
  }

  logout() {
    this.authService.signOut()
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    localStorage.removeItem('sb-wdbzebrfirgiirdyqgku-auth-token')
    this.router.navigate(['/auth'])
  }

  ngOnDestroy(): void {
    this.$reloadProductsSubscription.unsubscribe()
  }

}
