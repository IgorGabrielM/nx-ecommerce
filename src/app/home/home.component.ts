import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HeaderComponent } from '../components/header/header.component';

@Component({
  selector: 'nx-ecommerce-home',
  standalone: true,
  imports: [CommonModule, HlmButtonDirective, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
}
