import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnPopoverCloseDirective,
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverCloseDirective, HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { CategoryModel } from 'src/models/category.model';
import { ProductModel } from 'src/models/product.model';
import { ImageService } from 'src/services/image.service';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';
import { ToastService } from 'src/services/subjects/toast.service';
import { SwiperModule } from 'swiper/angular';

@Component({
  selector: 'nx-ecommerce-product-carousel',
  standalone: true,
  imports: [
    CommonModule,
    SwiperModule,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    BrnPopoverContentDirective,
    BrnPopoverCloseDirective,
    HlmPopoverContentDirective,
    HlmPopoverCloseDirective,
    RouterModule
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer: ElementRef;

  @Input() minimized: boolean = false;
  @Input() categoryWithProduct: { category: CategoryModel, products: ProductModel[] }

  widthSwiper: number
  positionId: number

  constructor(
    private imageService: ImageService,
    private shoppingCartService: ShoppingCartService,
    private eventRealodShopingCartService: EventRealodShopingCartService,
    public toastService: ToastService,

    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPosition()
    this.loadImagesProducts()
  }

  ngAfterViewInit(): void {
    this.widthSwiper = this.swiperContainer.nativeElement.offsetWidth;
    if (this.widthSwiper > 400 && this.widthSwiper < 650) {
      this.widthSwiper = this.widthSwiper / 2
    } else if (this.widthSwiper > 650) {
      this.widthSwiper = this.widthSwiper / 4
    } else if (this.widthSwiper < 400 && this.minimized) {
      this.widthSwiper = this.widthSwiper / 2.5
    }
    this.cdr.detectChanges();
  }

  async loadImagesProducts() {
    this.categoryWithProduct.products = await this.imageService.loadImageForProducts(this.categoryWithProduct.products)
  }

  insertOnShoppingCart(product: ProductModel) {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 10)
    this.shoppingCartService.insertProduct(product).then(() => {
      this.eventRealodShopingCartService.sendEvent(true)
      this.toastService.show('Produto adicionado ao carrinho!');
    })
  }

  editProduct(productId: string) {
    const queryParams = {
      id: productId
    };
    setTimeout(() => {
      this.router.navigate(['/create-product'], {
        queryParams,
        queryParamsHandling: 'merge'
      });
    }, 100)
  }

  getPosition() {
    if (localStorage.getItem('userData')) {
      this.positionId = JSON.parse(localStorage.getItem('userData')).positionId
    }
  }
}
