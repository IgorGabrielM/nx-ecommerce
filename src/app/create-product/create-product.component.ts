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
import { ActivatedRoute } from '@angular/router';


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
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  formData: FormGroup

  fileUrl: {
    urlObj: string
    path?: string
  }

  categories: CategoryModel[] = []
  currentCategory: CategoryModel | undefined
  productId: number

  public state = signal<'closed' | 'open'>('closed');

  constructor(
    private imageService: ImageService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,

    private readonly fb: FormBuilder,
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
        this.productService.find(this.productId).then(({ data: product }) => {
          if (product) {
            this.formData = this.fb.group({
              name: [product[0].name, Validators.required],
              description: [product[0].description, Validators.required],
              image: [product[0].image, Validators.required],
              price: [product[0].price, Validators.required],
              discount: [product[0].discount],
            });
            this.fileUrl = {
              urlObj: this.imageService.getByPath(product[0].image).data.publicUrl,
              path: product[0].image
            }
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

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileUrl = { path: '', urlObj: '' }

      this.formData.value.image = fileList[0];
      this.imageService.uploadImage(this.formData.value.image).then(({ data: img }) => {
        this.fileUrl.urlObj = URL.createObjectURL(this.formData.value.image)
        this.fileUrl.path = img.path
        this.formData.value.image = img.path
      })
    }
  }

  onSubmit() {
    if (!this.productId) {
      this.productService.create({ ...this.formData.value, image: this.fileUrl.path, id_category: this.currentCategory.id }).then()
    } else {
      this.productService.update({ ...this.formData.value, image: this.fileUrl.path, id_category: this.currentCategory.id, id: this.productId }).then()
    }
  }
}
