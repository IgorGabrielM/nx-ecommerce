import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../components/header/header.component';
import { ImageService } from 'src/services/image.service';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';

@Component({
  selector: 'nx-ecommerce-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent,
    HlmButtonDirective,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  formData = {
    name: '',
    description: '',
    image: null,
    price: null,
    discount: null
  };

  fileUrl: {
    urlObj: string
    path: string
  }

  constructor(
    private imageService: ImageService
  ) { }

  ngOnInit() {
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileUrl = { path: '', urlObj: '' }

      this.formData.image = fileList[0];
      this.imageService.uploadImage(this.formData.image).then(({ data: img }) => {
        this.fileUrl.urlObj = URL.createObjectURL(this.formData.image)
        this.fileUrl.path = img.path
        this.formData.image = img.path
      })
    }
  }
}
