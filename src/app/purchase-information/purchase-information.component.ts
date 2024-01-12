import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImageService } from 'src/services/image.service';
import { ProductService } from 'src/services/product.service';
import { ProductModel } from 'src/models/product.model';
import { HeaderComponent } from '../components/header/header.component';
import { ProductCarouselComponent } from '../components/product-carousel/product-carousel.component';
import { CategoryModel } from 'src/models/category.model';
import { CategoryService } from 'src/services/category.service';
import { PurchaseService } from 'src/services/purchase.service';
import { DeliveryStatusModel, PurchaseModel } from 'src/models/purchase.model';

@Component({
  selector: 'nx-ecommerce-purchase-information',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, ProductCarouselComponent],
  templateUrl: './purchase-information.component.html',
  styleUrl: './purchase-information.component.scss',
})
export class PurchaseInformationComponent {
  productId: number
  purchaseId: number

  category: CategoryModel
  product: ProductModel
  purchase: PurchaseModel
  productsRecommended: ProductModel[] = []
  delivery_statuses_default: { id: string, name: string, icon?: string }[] = [
    {
      id: '1',
      name: 'Pedido feito',
      icon: 'ph-clipboard'
    },
    {
      id: '2',
      name: 'Enviado',
      icon: 'ph-airplane-takeoff'
    },
    {
      id: '3',
      name: 'Saiu para entrega',
      icon: 'ph-truck'
    },
    {
      id: '4',
      name: 'Entregue',
      icon: 'ph-package'
    },
  ]

  constructor(
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private categoryService: CategoryService,
    private imageService: ImageService,

    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getQuerryParam();
    this.loadProduct();
    this.loadPurchase();
  }

  getQuerryParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.productId = params['productId'];
      this.purchaseId = params['purchaseId'];
    });
  }

  loadProduct() {
    this.productService.find(this.productId.toString()).then(({ data: product }) => {
      this.product = product[0]
      this.product.imageUrl = this.imageService.getByPath(product[0].image).data.publicUrl
      this.loadProductsRecommended()
    })
  }

  loadPurchase() {
    this.purchaseService.find(this.purchaseId.toString()).then(({ data: purchase }) => {
      this.purchase = purchase[0]
      this.product = { ...this.product, delivery_statuses: purchase[0].products.find((purchase) => String(purchase.id) === String(this.productId)).delivery_statuses }
      console.log(this.product)
    })
  }

  loadProductsRecommended() {
    this.productService.listByCategory(this.product.id_category.toString()).then(({ data: productsRecommended }) => {
      this.categoryService.find(this.product.id_category.toString()).then(({ data: category }) => {
        this.category = { ...category[0], name: 'Produtos relacionados' }
      })
      this.productsRecommended = productsRecommended;
    })
  }

}
