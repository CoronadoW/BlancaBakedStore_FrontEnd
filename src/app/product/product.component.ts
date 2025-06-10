import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ResaleProductService } from '../service/resale-product.service';
import { ExpirationDto, ExpirationRecived, ResaleProduct, ResaleProductWithNearestExpiration } from '../models/resale-product.model';
import { AuthService } from '../service/auth.service';
import { CashBalanceService } from '../service/cash-balance.service';
import { CashBalance, CashBalanceDto } from '../models/cash-balance.model';
import { AuthIntentService } from '../service/auth-intent.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})

export class ProductComponent implements OnInit {

  role: string = '';

  resaleProducts: ResaleProduct[] = [];
  partialProduct: Partial<ResaleProduct> = {}; //Partial to not require all fields.
  //createdProduct: ResaleProduct | null = null;  //New created resaleProduct
  showProductModal: boolean = false;
  forUpdateProduct: Partial<ResaleProduct> = {};
  resProdNearExp: Partial<ResaleProductWithNearestExpiration> = {};
  resProdNearExpList: ResaleProductWithNearestExpiration[] = [];

  expDto: ExpirationDto = {
    productCode: null,
    qty: null,
    buyDate: '',
    expireDate: ''
  };
  expDto1: ExpirationDto = {
    productCode: null,
    qty: null,
    buyDate: '',
    expireDate: ''
  };

  expRecived: ExpirationRecived | null = null;


  showBalance: boolean = false;
  cashBalanceDto: CashBalanceDto = {} as CashBalanceDto;
  createdCashBalance: CashBalance | null = null;
  balance = {
    date: '',
    shift: '',
    employeeName: '',
    openingCashBalance: 0,
    openingCashOnHand: 0,
    cashSales: 0,
    cardSales: 0,
    transferSales: 0,
    qrSales: 0,
    totalSales: 0,
    systemTotalSales: 0,
    control: 0,
    cashPayments: 0,
    otherPayments: 0,
    totalPayments: 0,
    observations: '',
    endingCashBalance: 0
  };

  alertMessage: string | null = null;

  constructor(private route: ActivatedRoute) { }
  private resaleProdService = inject(ResaleProductService);
  private authService = inject(AuthService); //Inject service here
  private router = inject(Router);
  private cashBalanceService = inject(CashBalanceService);
  //private authIntentService = inject(AuthIntentService)

  ngOnInit(): void {
    this.loadProductsNearestDate();
    this.role = this.authService.getUserRole();
  }

  //---------------------Product logic---------------------


  //Charge ResaleProduct[] with its nearest expiration date
  loadProductsNearestDate() {
    this.resaleProdService.getProductsWithNearestExpiration().subscribe((data) => {
      this.resProdNearExpList = data;
    })
  }

  searchProduct(): void {
    const { productCode, productName } = this.resProdNearExp;
    const productIdentifier = productCode ?? productName;

    if (!productIdentifier) {
      alert('Debe ingresar el codigo o nombre del producto');
      return;
    }

    const observable = typeof productIdentifier === 'number'
      ? this.resaleProdService.getResaleProductByCode(productIdentifier)
      : this.resaleProdService.getResaleProductByProductName(productIdentifier);

    observable.subscribe(
      (resProdNearExp) => this.openProductModal(resProdNearExp),

      (error) => {
        console.error('Producto no encontrado', error);
        alert(`Producto no encontrado con ese ${typeof productIdentifier === 'number' ? 'código' : 'nombre'}`);
      }
    );
  }

  //Shows product by click it on table, but products(ResaleProductWithNearestExpiration) with its nearest expiration date, not its expirations list.
  openProductModal(product: ResaleProductWithNearestExpiration): void {
    this.resProdNearExp = product;
    this.showProductModal = true;
  }

  //Close modal wich show got product
  closeProductModal(): void {
    this.showProductModal = false;
    this.resProdNearExp = {};
  }


  //quedaria realizar el update de stock con productstock y expiredate usando un expdto

  //Finalmente ver de resetear el usuario al cerrar la aplicacion y

  //Cargar el usuario al formulario para cerrar caja


  //Consump stock of product stock
  updateStock() {
    if (!this.expDto1.productCode || !this.expDto1.qty)
      return;
    this.resaleProdService.updateStockProduct(this.expDto1).subscribe({
      next: () => {
        this.loadProductsNearestDate();
        this.expDto1.productCode = null;
        this.expDto1.qty = null;
        alert('Se consumió correctamente el stock.');
        console.log("Total stock updated succesfully")
      },
      error: (error) => {
        console.error("Error al consumir stock.", error);
        alert('Error al consumir stock.')
      }
    });
  }

  //Create new Expiration, for enter new stock with its new expire date
  updateProduct(): void {
    if (!this.isExpDtoValid)
      return;
    this.resaleProdService.createNewExpiration(this.expDto).subscribe({
      next: (expiration) => {
        console.log(expiration);
        this.loadProductsNearestDate();
        this.expDto = {
          productCode: null,
          qty: null,
          buyDate: '',
          expireDate: ''
        }
        alert('Se realizó correctamente el ingreso de nuevo stock.');
        console.log("New expiration created succesfully.");
      },
      error: (error) => {
        console.error("Error al cargar productos", error);
        alert('Product no encontrado con ese codigo');
      }
    });
  }

  isExpDtoValid(productCode: unknown, stock: unknown, buyDate: unknown, expireDate: unknown): boolean {
    if (typeof productCode !== 'number' || typeof stock !== 'number' || typeof buyDate !== 'string' || typeof expireDate !== 'string') {
      alert('Debe completar correctamente todos los campos.')
      return false;
    }
    return true;
  }

  // Method to turn into Red or Orange the expireDate depending its period
  getExpireDateClass(nearestExpireDate: string | null | undefined, stock: number | null | undefined): string {
    if (!nearestExpireDate || stock === 0) {
      return 'text-muted'; //grey if there isn't stock.
    }

    // Convert from "dd-MM-yyyy" to "yyyy-MM-dd"
    const parts = nearestExpireDate.split('-');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    const expireDate = new Date(formattedDate);


    const today = new Date();
    const diffTime = expireDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));


    console.log(`Fecha original: ${nearestExpireDate}, parseada: ${formattedDate}, días restantes: ${diffDays}`);

    if (diffDays <= 7) {
      return 'text-danger';
    } else if (diffDays <= 14) {
      return 'text-warning';
    } else {
      return '';
    }
  }



  //-----------Balance logic--------------------------------------
  /*
  onCerrarCaja() {
    if (!this.authService.isAuthenticated()) {
      // Guardar la intención de cerrar caja y redirigir al login
      this.authIntentService.setBalanceIntent(this.cashBalanceDto, () => {
        this.createCashBalanceAndShowResult();
      });
      this.router.navigate(['/login']);
      return;
    }
    // Si ya está autenticado
    this.createCashBalanceAndShowResult();
  }*/

  //Method to filter if user is authenticated before create a balance
  verifyUserThenCreateBalance() {
    if (!this.authService.isAuthenticated()) {
      console.warn('Usuario no autenticado. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }
    // Verify if there is a Role authorized, NO GUESS role.
    const userRole = this.authService.getUserRole();
    if (userRole === 'USUARIO' || userRole === 'ADMIN') {
      this.createCashBalanceAndShowResult();
    } else {
      console.warn('Acceso denegado: No tienes permisos para crear el balance');
    }
  }

  // Method to create CashBalance and show Modal with created CashBalance in it.
  private createCashBalanceAndShowResult(): void {
    if (!this.isCashBalanceDtoValid(this.cashBalanceDto)) {
      alert("Debe completar todos los campos, a excepcion de las Observaciones, el campo Observaciones es opcional.");
      return;
    }
    this.cashBalanceService.createCashBalance(this.cashBalanceDto).subscribe({
      next: (createdCashBalance) => {
        console.log('Cierre de caja creado:', createdCashBalance);
        this.createdCashBalance = createdCashBalance;

        this.balance = {
          date: createdCashBalance.date,
          shift: createdCashBalance.shift,
          employeeName: createdCashBalance.employeeName,
          openingCashBalance: createdCashBalance.openingCashBalance,
          openingCashOnHand: createdCashBalance.openingCashOnHand,
          cashSales: createdCashBalance.cashSales,
          cardSales: createdCashBalance.cardSales,
          transferSales: createdCashBalance.transferSales,
          qrSales: createdCashBalance.qrSales,
          totalSales: createdCashBalance.totalSales,
          systemTotalSales: createdCashBalance.systemTotalSales,
          control: createdCashBalance.control,
          cashPayments: createdCashBalance.cashPayments,
          otherPayments: createdCashBalance.otherPayments,
          totalPayments: createdCashBalance.totalPayments,
          observations: createdCashBalance.observations,
          endingCashBalance: createdCashBalance.endingCashBalance
        };

        this.cashBalanceDto = {} as CashBalanceDto; // Clean form
        this.showBalance = true; // Show modal with balance

      },
      error: (err) => {
        console.error('Error al crear cierre de caja:', err);
        alert('Error al crear Cierre de Caja.')
      }
    });
  }

  isCashBalanceDtoValid(dto: CashBalanceDto): boolean {
    const {
      date,
      shift,
      employeeName,
      openingCashBalance,
      openingCashOnHand,
      cashSales,
      cardSales,
      transferSales,
      qrSales,
      systemTotalSales,
      cashPayments,
      otherPayments
    } = dto;

    return (
      !!date &&
      !!shift &&
      !!employeeName &&
      openingCashBalance !== null && openingCashBalance !== undefined &&
      openingCashOnHand !== null && openingCashOnHand !== undefined &&
      cashSales !== null && cashSales !== undefined &&
      cardSales !== null && cardSales !== undefined &&
      transferSales !== null && transferSales !== undefined &&
      qrSales !== null && qrSales !== undefined &&
      systemTotalSales !== null && systemTotalSales !== undefined &&
      cashPayments !== null && cashPayments !== undefined &&
      otherPayments !== null && otherPayments !== undefined
    );
  }

  closeBalanceModal() {
    this.showBalance = false;
  }

}
