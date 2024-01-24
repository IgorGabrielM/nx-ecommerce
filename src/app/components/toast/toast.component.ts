import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nx-ecommerce-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})

export class ToastComponent {
  @Input() message: string;
  @Input() type: 'success' | 'danger'

  constructor() { }

}
