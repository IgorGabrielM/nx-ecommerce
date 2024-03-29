import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImageService } from 'src/services/image.service';
import { ProductService } from 'src/services/product.service';
import { ProductModel } from 'src/models/product.model';
import { HeaderComponent } from '../components/header/header.component';
import { ProductCarouselComponent } from '../components/product-carousel/product-carousel.component';
import { CategoryModel } from 'src/models/category.model';
import { CategoryService } from 'src/services/category.service';
import { PurchaseService } from 'src/services/purchase.service';
import { DeliveryStatusModel, PurchaseModel } from 'src/models/purchase.model';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { CommentModel } from 'src/models/comment.model';
import { CommentService } from 'src/services/comment.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/services/subjects/toast.service';

@Component({
  selector: 'nx-ecommerce-purchase-information',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ProductCarouselComponent,
    HlmButtonDirective,
    FormsModule
  ],
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

  delivery_statuses_product: DeliveryStatusModel[] = []
  delivery_statuses_default: { id: string, name: string, icon?: string, changed_at?: Date }[] = [
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

  isCreateComment = false
  commentModel: CommentModel

  constructor(
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private categoryService: CategoryService,
    private imageService: ImageService,
    private commentService: CommentService,
    public toastService: ToastService,

    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.getQuerryParam();
    this.loadProduct();
    this.loadPurchase();
    this.changeDeliveryStatus();

    this.commentModel = new CommentModel()
  }

  getQuerryParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.productId = params['productId'];
      this.purchaseId = params['purchaseId'];
    });
  }

  loadProduct() {
    this.productService.find(this.productId.toString()).then(async ({ data: product }) => {
      this.product = (await this.imageService.loadImageForProducts(product))[0]
      this.loadProductsRecommended()
    })
  }

  loadPurchase() {
    this.purchaseService.find(this.purchaseId.toString()).then(({ data: purchase }) => {
      const delivery_statuses_by_purchase = purchase[0].products.find((product) => product.id.toString() === this.productId.toString()).delivery_statuses
      this.delivery_statuses_product = delivery_statuses_by_purchase ? delivery_statuses_by_purchase : undefined
      this.purchase = purchase[0]
    })
  }

  deletePurchase(product): boolean {
    if (this.purchase) {
      const productOfPurchase = this.purchase.products.find((productForPurchase) => productForPurchase.id === product.id)
      if (productOfPurchase.delivery_statuses.length < 4) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  getClassByRingDeliveryStatus(index: number): string {
    if (this.delivery_statuses_product && index < this.delivery_statuses_product.length) {
      return 'absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-green-500 bg-green-600 text-white'
    }
    return 'absolute flex items-center justify-center w-8 h-8 rounded-full -start-4 ring-4 ring-gray-400 bg-white'
  }

  loadProductsRecommended() {
    this.productService.listByCategory(this.product.id_category.toString()).then(({ data: productsRecommended }) => {
      this.categoryService.find(this.product.id_category.toString()).then(({ data: category }) => {
        this.category = { ...category[0], name: 'Produtos relacionados' }
      })
      this.productsRecommended = productsRecommended;
    })
  }

  changeDeliveryStatus() {
    setTimeout(() => {
      const lastDeliveryStatus = this.delivery_statuses_product[this.delivery_statuses_product.length - 1]
      if (lastDeliveryStatus.id != '4') {
        if (new Date(lastDeliveryStatus.changed_at).getDate() < new Date().getDate() - 2) {
          const product = this.purchase.products.find((product) => product.id.toString() === this.productId.toString())
          const statusToChangeIndex = this.delivery_statuses_product.indexOf(lastDeliveryStatus) + 1
          const statusToChange: { id: string; name: string; icon: string, changed_at?: Date; } = {
            ...this.delivery_statuses_default[statusToChangeIndex],
            icon: undefined, changed_at: new Date()
          }
          product.delivery_statuses.push(statusToChange)
          this.purchaseService.update({ ...this.purchase }).then()
        }
      }
    }, 2000)
  }

  deleteProduct() {
    /*     this.purchaseService.delete(this.purchase.id).then(() => {
          this.router.navigate(['/user'])
          this.toastService.show('Compra cancelada!');
        }) */
  }

  selectStar(starsCount: number) {
    this.commentModel.stars = starsCount
  }

  sendComment() {
    const payload: CommentModel = {
      ...this.commentModel,
      id_product: this.product.id,
      id_user_detail: JSON.parse(localStorage.getItem('userData')).userDetailId,
      stars: this.commentModel.stars ? this.commentModel.stars : 0
    }
    this.commentService.create(payload).then(() => {
      this.toastService.show('Comentário enviado!');
      this.isCreateComment = false
      this.commentModel.comment_message = undefined
      this.commentModel.stars = 0
    })
  }
}
