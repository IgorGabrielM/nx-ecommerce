import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from 'src/services/product.service';
import { ProductModel } from 'src/models/product.model';
import { ImageService } from 'src/services/image.service';

@Component({
  selector: 'nx-ecommerce-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  products: ProductModel[] = [];

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
  ) { }

  searchStr: string

  onInput(event: any): void {
    this.productService.search(this.searchStr).then(async ({ data: products }) => {
      this.products = await this.imageService.loadImageForProducts(products)
    })
  }

}
