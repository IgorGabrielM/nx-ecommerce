import { ImageService } from './../../../../services/image.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductModel } from 'src/models/product.model';
import { ProductService } from 'src/services/product.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'nx-ecommerce-product-information',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule
  ],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.scss',
})
export class ProductInformationComponent implements OnInit {
  product: ProductModel

  zoom = 1;
  offsetX = 0;
  offsetY = 0;

  constructor(
    private productService: ProductService,
    private imageService: ImageService,

    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadQueryParamId();
  }

  loadQueryParamId() {
    const productId = this.activatedRoute.snapshot.queryParams['id']
    this.productService.find(productId).then(({ data: products }) => {
      this.product = { ...products[0], imageUrl: this.imageService.getByPath(products[0].image).data.publicUrl }
    })
  }

  onMouseMove(event: MouseEvent) {
    const { offsetX, offsetY, target } = event;
    const { offsetWidth, offsetHeight } = target as HTMLElement;

    const xPercent = offsetX / offsetWidth;
    const yPercent = offsetY / offsetHeight;

    this.offsetX = xPercent;
    this.offsetY = yPercent;
    this.zoom = 2
  }

  onMouseLeave() {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  getTransformStyle() {
    return `scale(${this.zoom}) translate(-${this.offsetX * 20}%, -${this.offsetY * 20}%)`;
  }
}
