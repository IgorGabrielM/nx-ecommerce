import { Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  products: ProductModel[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    this.loadProducts()
    this.loadCategories()
  }

  loadProducts() {
    this.productService.list().then(({ data: products }) => {
      products.forEach(async (product) => {
        product.image = (await this.imageService.getByPath(product.image)).data.publicUrl
      })
      this.products = products
    })
  }

  loadCategories() {
    this.categoryService.list().then(({ data: categories }) => console.log(categories))
  }

}
