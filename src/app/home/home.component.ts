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

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.loadProducts()
    this.loadCategories()
  }

  loadProducts() {
    this.productService.list().then((res) => console.log(res))
  }

  loadCategories() {
    this.categoryService.list().then((res) => console.log(res))
  }
}
