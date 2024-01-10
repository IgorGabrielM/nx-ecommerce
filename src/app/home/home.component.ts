import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { SwiperModule } from 'swiper/angular';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnPopoverCloseDirective,
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverCloseDirective, HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { ProductService } from 'src/services/product.service';
import { CategoryService } from 'src/services/category.service';
import { ProductModel } from 'src/models/product.model';
import { ImageService } from 'src/services/image.service';
import { ProductCarouselComponent } from '../components/product-carousel/product-carousel.component';
import { UserDetailService } from 'src/services/user.service';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { ShoppingCartModel } from 'src/models/shoppingCart.model';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';
import { CategoryModel } from 'src/models/category.model';

@Component({
  selector: 'nx-ecommerce-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SwiperModule,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    BrnPopoverContentDirective,
    BrnPopoverCloseDirective,
    HlmPopoverContentDirective,
    HlmPopoverCloseDirective,
    HlmInputDirective,
    ProductCarouselComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  categoriesWithProducts: { category: CategoryModel, products: ProductModel[] }[] = []
  products: ProductModel[] = [];
  shoppingCart: ShoppingCartModel

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private userDetailService: UserDetailService,
    private shoppingCartService: ShoppingCartService,

    private eventRealodShopingCartService: EventRealodShopingCartService,
  ) { }

  ngOnInit() {
    this.loadUserData()
    this.loadCategories()
  }

  loadUserData() {
    const userLogedId: string = JSON.parse(localStorage.getItem('sb-wdbzebrfirgiirdyqgku-auth-token')).user.identities[0].user_id
    this.userDetailService.findByIdUser(userLogedId).then(({ data: userDetail }) => {
      this.shoppingCartService.find(Number(userDetail[0].id_shopping_cart)).then(({ data: shoppingCart }) => {
        this.shoppingCart = shoppingCart[0]
        const userData = { shoppingCartId: shoppingCart[0].id, userDetailId: userDetail[0].id, positionId: userDetail[0].id_position }
        localStorage.setItem('userData', JSON.stringify(userData))
        setTimeout(() => this.eventRealodShopingCartService.sendEvent(true), 500)
      })
    })
  }

  loadCategories() {
    this.categoryService.list().then(({ data: categories }) => {
      categories.forEach((category) => {
        this.productService.listByCategory(category.id).then(({ data: products }) => {
          this.categoriesWithProducts.push({ category, products })
        })
      })
    })
  }

  sortedCategories(): { category: CategoryModel; products: ProductModel[]; }[] {
    return this.categoriesWithProducts.sort((a, b) => Number(a.category.id) - Number(b.category.id))
  }

}
