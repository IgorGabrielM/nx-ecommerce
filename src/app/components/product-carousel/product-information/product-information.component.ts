import { ImageService } from './../../../../services/image.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductModel } from 'src/models/product.model';
import { ProductService } from 'src/services/product.service';
import { HeaderComponent } from '../../header/header.component';
import { ShoppingCartService } from 'src/services/shopping-cart.service';
import { EventRealodShopingCartService } from 'src/services/subjects/ev-reload-shoping-cart.subject.service';
import { PurchaseService } from 'src/services/purchase.service';
import { UserDetailService } from 'src/services/user.service';
import { SwiperModule } from 'swiper/angular';
import { CommentService } from 'src/services/comment.service';
import { CommentModel } from 'src/models/comment.model';
import { FormsModule } from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ToastService } from 'src/services/subjects/toast.service';

@Component({
  selector: 'nx-ecommerce-product-information',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule,
    FormsModule,
    SwiperModule,
    HlmInputDirective,
    HlmButtonDirective
  ],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.scss',
})
export class ProductInformationComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer: ElementRef;

  product: ProductModel
  comments: CommentModel[] = []

  widthSwiper: number

  constructor(
    private productService: ProductService,
    private imageService: ImageService,
    private shoppingCartService: ShoppingCartService,
    private purchaseService: PurchaseService,
    private userDetailService: UserDetailService,
    private commentService: CommentService,
    public toastService: ToastService,

    private eventRealodShopingCartService: EventRealodShopingCartService,

    private activatedRoute: ActivatedRoute,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.loadQueryParamId();
    setTimeout(() => this.loadComments(), 1000)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.widthSwiper = this.swiperContainer.nativeElement.offsetWidth;
      if (this.widthSwiper > 400 && this.widthSwiper < 650) {
        this.widthSwiper = this.widthSwiper / 2
      } else if (this.widthSwiper > 650) {
        this.widthSwiper = this.widthSwiper / 4
      } else {
        this.widthSwiper = this.widthSwiper / 2
      }
    }, 500)
  }

  loadQueryParamId() {
    const productId = this.activatedRoute.snapshot.queryParams['id']
    this.productService.find(productId).then(async ({ data: products }) => {
      this.product = (await this.imageService.loadImageForProducts(products))[0]
    })
  }

  laodImages() {
    this.product.comments.map((comment) => {
      return {
        ...comment,
        user_image_url: this.userDetailService.find(comment.id_user_detail).then(({ data: usr }) => {
          return this.imageService.getByPath(usr[0].image)
        }),
        stars_array: [null, null, null, null, null]
      }
    })
  }

  loadComments() {
    this.commentService.listByProduct(this.product.id).then(async ({ data: comments }) => {
      const commentsWithImage: CommentModel[] = await Promise.all(comments.map(async (comment) => {
        const userDetail = await this.userDetailService.find(comment.id_user_detail);
        const usr = userDetail.data;
        const userImageUrl = await this.imageService.getByPath(usr[0].image).data.publicUrl;
        return {
          ...comment,
          stars_array: new Array(comment.stars),
          user_image_url: userImageUrl,
        };
      }));

      this.comments = commentsWithImage;
    });
  }

  insertOnShoppingCart() {
    this.shoppingCartService.insertProduct(this.product).then(() => {
      this.eventRealodShopingCartService.sendEvent(true)
      this.toastService.show('Produto adicionado ao carrinho!');
    })
  }

  purchaseProduct() {
    this.purchaseService.create({ product_id: Number(this.product.id), products: [this.product] }).then(({ data: purchase }) => {
      this.router.navigate(['/purchase-details'], { queryParams: { id: purchase[0].id } })
    })
  }
}
