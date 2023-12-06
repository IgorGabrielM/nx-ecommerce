import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductModel } from 'src/models/product.model';
import { SwiperModule } from 'swiper/angular';
import { HlmPopoverCloseDirective, HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { BrnPopoverCloseDirective, BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ProductService } from 'src/services/product.service';
import { ImageService } from 'src/services/image.service';

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

    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProducts()
  }

  ngAfterViewInit(): void {
    console.log(this.swiperContainer)
    this.widthSwiper = this.swiperContainer.nativeElement.offsetWidth;
    console.log('Largura do Swiper:', this.widthSwiper);

    this.cdr.detectChanges();
  }

  getSwiper() {
    console.log()
  }

  loadProducts() {
    this.productService.list().then(({ data: products }) => {
      products.forEach(async (product) => {
        product.image = (await this.imageService.getByPath(product.image)).data.publicUrl
      })
      this.products = products
    })
  }

}
