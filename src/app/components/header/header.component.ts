import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnSheetCloseDirective,
  BrnSheetComponent,
  BrnSheetContentDirective,
  BrnSheetDescriptionDirective,
  BrnSheetOverlayComponent,
  BrnSheetTitleDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/ui-sheet-brain';
import {
  HlmSheetCloseDirective,
  HlmSheetContentDirective,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetOverlayDirective,
  HlmSheetTitleDirective,
} from '@spartan-ng/ui-sheet-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';


@Component({
  selector: 'nx-ecommerce-header',
  standalone: true,
  imports: [CommonModule,
    HlmButtonDirective,
    BrnSheetCloseDirective,
    BrnSheetComponent,
    BrnSheetContentDirective,
    BrnSheetDescriptionDirective,
    BrnSheetOverlayComponent,
    BrnSheetTitleDirective,
    BrnSheetTriggerDirective,
    HlmSheetCloseDirective,
    HlmSheetContentDirective,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetOverlayDirective,
    HlmSheetTitleDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  showFiller: boolean = false;

  constructor(
    private authService: AuthService,

    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  openCartShopping() {
    /*   dialog->  const dialogRef = this.dialog.open(CartShopComponent);
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        }); */
  }

  logout() {
    this.authService.signOut()
    localStorage.removeItem('token')
    this.router.navigate(['/auth'])
  }

}
