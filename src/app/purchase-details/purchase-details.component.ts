import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrnPopoverComponent, BrnPopoverContentDirective, BrnPopoverTriggerDirective } from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmCommandGroupDirective, HlmCommandInputWrapperComponent, HlmCommandListDirective } from '@spartan-ng/ui-command-helm';
import { PurchaseService } from 'src/services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseModel } from 'src/models/purchase.model';
import { HeaderComponent } from '../components/header/header.component';
import { FormsModule } from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { CepService } from 'src/services/cep.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastService } from 'src/services/subjects/toast.service';

export class DeliveryModel {
  cep: string
  street: string
  neighbourhood: string
  numberHouse: number
}

export class PaymentModel {
  type: 'debit' | 'credit' | 'ticket' | 'pix'
  installments: { installmentNumber: number, value: number }
}

@Component({
  selector: 'nx-ecommerce-purchase-details',
  standalone: true,
  imports: [CommonModule,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    HeaderComponent,
    BrnPopoverContentDirective,
    HlmCommandInputWrapperComponent,
    HlmCommandListDirective,
    HlmCommandGroupDirective,
    FormsModule,
    HlmInputDirective,
    HttpClientModule,
  ],
  templateUrl: './purchase-details.component.html',
  providers: [HttpClient, CepService,],
  styleUrl: './purchase-details.component.scss',
})

export class PurchaseDetailsComponent implements OnInit {
  purchase: PurchaseModel

  delivery: DeliveryModel

  formOfPayments: { id: number, name: string }[] = [
    {
      id: 1,
      name: 'Debito',
    },
    {
      id: 2,
      name: 'Credito',
    },
    {
      id: 3,
      name: 'Ticket',
    },
    {
      id: 4,
      name: 'PIX',
    },
  ];
  formOfPaymentSelected: PaymentModel

  public currentFormPaymont = signal<{ id: number, name: string } | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  constructor(
    private purchaseService: PurchaseService,
    private cepService: CepService,
    public toastService: ToastService,

    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPurchase()

    this.delivery = new DeliveryModel()
    this.formOfPaymentSelected = new PaymentModel()

    setTimeout(() => {
      this.formOfPaymentSelected.installments = { installmentNumber: 1, value: this.purchase.products.reduce((total, product) => total + product.price, 0) }
    }, 1000)
  }

  stateChanged(event: any) {
    this.state.set(event);
  }

  commandSelected(formPayment: { id: number, name: string }) {
    this.state.set('closed');
    if (this.currentFormPaymont()?.id === formPayment.id) {
      this.currentFormPaymont.set(undefined);
    } else {
      this.currentFormPaymont.set(formPayment);
    }
  }

  loadPurchase() {
    this.activatedRoute.queryParams.subscribe((param: any) => {
      this.purchaseService.find(param.id).then(({ data: purchase }) => {
        this.purchase = purchase[0];
      })
    })
  }

  getAddress() {
    if (this.delivery.cep.length === 8) {
      this.cepService.getCepData(this.delivery.cep).subscribe((address) => {
        this.delivery = {
          ...this.delivery,
          neighbourhood: address.bairro,
          street: address.logradouro
        }
      })
    }
  }

  canFoward(): boolean {
    return this.delivery.neighbourhood && this.delivery.neighbourhood && this.delivery.numberHouse ? true : false
  }

  valueOfInstallment(): string {
    if (this.purchase) {
      const valueTotalOfPurchase = this.purchase.products.reduce((total, product) => total + product.price, 0)
      return (valueTotalOfPurchase / this.formOfPaymentSelected.installments.installmentNumber).toFixed(2)
    } else {
      return ''
    }
  }

  onSubmit() {
    const payload: PurchaseModel = {
      ...this.purchase,
      payment_type: this.currentFormPaymont().name,
      installments_value: Number(this.valueOfInstallment()),
      installments_quantity: this.formOfPaymentSelected.installments.installmentNumber,
      cep: this.delivery.cep,
      street: this.delivery.street,
      neighbourhood: this.delivery.neighbourhood,
      number_house: this.delivery.numberHouse
    }
    this.purchaseService.update(payload).then(() => {
      this.toastService.show('Compra realizada com sucesso!');
      this.router.navigate(['/user'])
    })
  }
}
