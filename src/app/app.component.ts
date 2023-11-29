import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SupabaseService } from 'src/services/supabase.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'nx-ecommerce-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  session = this.supabase.session

  constructor(
    private readonly supabase: SupabaseService
  ) { }

  ngOnInit() {
    this.supabase.authChanges((_, session) => (this.session = session))
  }
}
