import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from 'src/models/product.model';
import { SwiperModule } from 'swiper/angular';
import { HlmPopoverCloseDirective, HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { BrnPopoverCloseDirective, BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ProductService } from 'src/services/product.service';
import { ImageService } from 'src/services/image.service';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';

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
  ],
  templateUrl: './product-carousel.component.html',
  styleUrl: './product-carousel.component.scss',
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer: ElementRef;

  @Input() products: ProductModel[];

  widthSwiper: number

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private shoppingCartService: ShoppingCartService,

    private eventRealodShopingCartService: EventRealodShopingCartService,

    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts()
  }

  ngAfterViewInit(): void {
    this.widthSwiper = this.swiperContainer.nativeElement.offsetWidth;

    this.cdr.detectChanges();
  }

  loadProducts() {
    this.productService.list().then(({ data: products }) => {
      products = this.imageService.loadImageForProducts(products)
      this.products = products
    })
  }

  insertOnShoppingCart(product: ProductModel) {
    this.shoppingCartService.insertProduct(product).then(() => {
      this.eventRealodShopingCartService.sendEvent(true)
    })
  }
}
