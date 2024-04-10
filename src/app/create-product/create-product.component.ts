import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { ImageService } from 'src/services/image.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { ProductService } from 'src/services/product.service';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective, BrnPopoverCloseDirective } from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { CategoryService } from 'src/services/category.service';
import { CategoryModel } from 'src/models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SwiperModule } from 'swiper/angular';
import { ProductModel } from 'src/models/product.model';
import { ToastService } from 'src/services/subjects/toast.service';


type Framework = { label: string; value: string };

@Component({
  selector: 'nx-ecommerce-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ReactiveFormsModule,
    HlmButtonDirective,
    HlmCommandImports,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverCloseDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
    SwiperModule
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  formData: FormGroup

  fileUrl: {
    urlObj: string
    path?: string
  }[] = []

  categories: CategoryModel[] = []
  currentCategory: CategoryModel | undefined
  productId: string
  product: ProductModel

  public state = signal<'closed' | 'open'>('closed');

  constructor(
    private imageService: ImageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    public toastService: ToastService,

    private readonly fb: FormBuilder,
    private router: Router
  ) {
    this.formData = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      image: ['', Validators.required],
      price: [0, Validators.required],
      discount: [0],
    });
  }

  ngOnInit() {
    this.getQuerryParam()
    this.loadCategories()
  }

  getQuerryParam() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.productId = params['id'];
      if (this.productId) {
        this.productService.find(this.productId).then(async ({ data: product }) => {
          if (product) {
            this.product = product[0]
            this.formData = this.fb.group({
              name: [product[0].name, Validators.required],
              description: [product[0].description, Validators.required],
              images: [product[0].images, Validators.required],
              price: [product[0].price, Validators.required],
              discount: [product[0].discount],
            });

            this.fileUrl = product[0].images.map((file) => {
              return {
                urlObj: this.imageService.getByPath(file).data.publicUrl,
                path: file
              };
            });
            this.currentCategory = (await this.categoryService.find(product[0].id_category.toString())).data[0]
          }
        })
      }
    });
  }

  loadCategories() {
    this.categoryService.list().then(({ data: categories }) => {
      this.categories = categories;
    })
  }

  stateChanged(state: any) {
    this.state.set(state);
  }

  commandSelected(category: CategoryModel) {
    this.state.set('closed');
    if (this.currentCategory?.id === category.id) {
      this.currentCategory = undefined;
    } else {
      this.currentCategory = category;
    }
  }

  selectCategory(event: any) {
    const categoryFinded = this.categories.find((category) => category.id.toString() === event.target.value.toString())
    if (!categoryFinded) {
      this.currentCategory = undefined;
    } else {
      this.currentCategory = categoryFinded;
    }
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      this.formData.value.images = fileList[0];
      this.imageService.uploadImage(this.formData.value.images).then(({ data: img }) => {
        this.fileUrl.push({
          urlObj: URL.createObjectURL(this.formData.value.images),
          path: img.path
        })
        this.formData.value.images = img.path
      })
    }
  }

  removeImage(file: { urlObj: string, path?: string }) {
    this.fileUrl = this.fileUrl.filter((f) => f !== file)
    this.productService.update({ ...this.product, images: this.fileUrl.map((file) => file.path) })
  }

  delete() {
    this.productService.delete(this.productId).then(() => {
      this.router.navigate(['/home'])
      this.toastService.show('Produto deletado com sucesso!');
    })
  }

  onSubmit() {
    if (!this.productId) {
      this.productService.create({ ...this.formData.value, images: this.fileUrl.map((file) => file.path), id_category: this.currentCategory.id, image: undefined }).then(() => {
        this.router.navigate(['/home'])
        this.toastService.show('Produto criado com sucesso!');
      })
    } else {
      this.productService.update({ ...this.formData.value, images: this.fileUrl.map((file) => file.path), id_category: this.currentCategory.id, id: this.productId, image: undefined }).then(() => {
        this.router.navigate(['/home'])
        this.toastService.show('Produto editado com sucesso!');
      })
    }
  }
}
