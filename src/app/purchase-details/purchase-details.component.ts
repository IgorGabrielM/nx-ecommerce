import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmCommandGroupDirective, HlmCommandInputWrapperComponent, HlmCommandListDirective } from '@spartan-ng/ui-command-helm';

type Framework = { label: string; value: string };

@Component({
  selector: 'nx-ecommerce-purchase-details',
  standalone: true,
  imports: [CommonModule,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    HlmCommandInputWrapperComponent,
    HlmCommandListDirective,
    HlmCommandGroupDirective
  ],
  templateUrl: './purchase-details.component.html',
  styleUrl: './purchase-details.component.scss',
})

export class PurchaseDetailsComponent implements OnInit {
  delivery: {
    cep: string
    street: string
    neighbourhood: string
    numberHouse: number
  }

  formOfPayment: {
    type: 'debit' | 'credit' | 'ticket' | 'cash'
    installments: { installmentNumber: number, value: number }
  }

  public frameworks = [
    {
      label: 'AnalogJs',
      value: 'analogjs',
    },
    {
      label: 'Angular',
      value: 'angular',
    },
    {
      label: 'Vue',
      value: 'vue',
    },
    {
      label: 'Nuxt',
      value: 'nuxt',
    },
    {
      label: 'React',
      value: 'react',
    },
    {
      label: 'NextJs',
      value: 'nextjs',
    },
  ];
  public currentFramework = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  stateChanged(event: any) {
    console.log(event)
    //this.state.set(state);
  }
  /*   stateChanged(state: 'open' | 'closed') {
      this.state.set(state);
    } */

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentFramework()?.value === framework.value) {
      this.currentFramework.set(undefined);
    } else {
      this.currentFramework.set(framework);
    }
  }

  constructor() { }

  ngOnInit(): void {
  }
}
