import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
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
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { ShoppingCartModel } from 'src/models/shoppingCart.model';
import { ImageService } from 'src/services/image.service';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductModel } from 'src/models/product.model';


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
    RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private $reloadProductsSubscription: Subscription;

  shoppingCart: ShoppingCartModel
  showFiller: boolean = false;
  positionId: number

  constructor(
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private imageService: ImageService,

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
  }

  getPosition() {
    if (localStorage.getItem('userData')) {
      this.positionId = JSON.parse(localStorage.getItem('userData')).positionId
    }
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
