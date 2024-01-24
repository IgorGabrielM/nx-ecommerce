import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from 'src/services/supabase.service';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from 'src/services/subjects/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, ToastComponent, CommonModule],
  selector: 'nx-ecommerce-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  session = this.supabase.session

  constructor(
    private readonly supabase: SupabaseService,
    public toastService: ToastService,

  ) { }

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}
