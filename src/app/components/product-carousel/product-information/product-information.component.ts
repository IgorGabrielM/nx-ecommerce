import { ImageService } from './../../../../services/image.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductModel } from 'src/models/product.model';
import { ProductService } from 'src/services/product.service';
import { HeaderComponent } from '../../header/header.component';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';
import { PurchaseService } from 'src/services/purchase.service';
import { UserDetailService } from 'src/services/user.service';

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
    private shoppingCartService: ShoppingCartService,
    private purchaseService: PurchaseService,
    private userDetailService: UserDetailService,

    private eventRealodShopingCartService: EventRealodShopingCartService,

    private activatedRoute: ActivatedRoute,
    private router: Router
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

  laodImages() {
    this.product.comments.map((comment) => {
      return {
        ...comment,
        user_image_url: this.userDetailService.find(comment.user_detail_id).then(({ data: usr }) => {
          return this.imageService.getByPath(usr[0].image)
        }),
        stars_array: [null, null, null, null, null]
      }
    })
  }

  insertOnShoppingCart() {
    this.shoppingCartService.insertProduct(this.product).then(() => {
      this.eventRealodShopingCartService.sendEvent(true)
    })
  }

  purchaseProduct() {
    this.purchaseService.create({ product_id: Number(this.product.id), products: [this.product] }).then(() => {
      this.router.navigate(['/home'])
    })
  }

  //Zoom image
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
