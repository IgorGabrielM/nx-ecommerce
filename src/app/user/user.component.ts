import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { UserDetailService } from 'src/services/user.service';
import { ImageService } from 'src/services/image.service';
import { UserDetailModel } from 'src/models/user.model';
import { PurchaseService } from 'src/services/purchase.service';
import { PurchaseModel } from 'src/models/purchase.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'nx-ecommerce-user',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  userImageUrl: string
  user: UserDetailModel
  purchases: PurchaseModel[] = []

  constructor(
    private userDetailsService: UserDetailService,
    private imageService: ImageService,
    private purchaseService: PurchaseService
  ) { }

  ngOnInit() {
    this.loadImage()
    this.loadPurchases()
  }

  loadImage() {
    this.userDetailsService.find(JSON.parse(localStorage.getItem('userData')).userDetailId).then(({ data: user }) => {
      this.userImageUrl = this.imageService.getByPath(user[0].image).data.publicUrl
      this.user = user[0]
    })
  }

  loadPurchases() {
    this.purchaseService.listByUser(JSON.parse(localStorage.getItem('userData')).userDetailId).then(({ data: purchases }) => {
      purchases.forEach(async (purchase) => {
        purchase.products = await this.imageService.loadImageForProducts(purchase.products)
      })
      this.purchases = purchases
    })
  }

}
