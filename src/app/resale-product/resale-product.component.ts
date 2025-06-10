import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ResaleProductService } from '../service/resale-product.service';
import { ExpirationDto, ResaleProdDto, ResaleProduct, ResaleProductWithNearestExpiration } from '../models/resale-product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resale-product',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf], /* Importo lo necesario para poder realizar navegaciones routerlink desde este componente, y ademas FormsModule para poder usar ngModel en el component.html*/
  templateUrl: './resale-product.component.html',
  styleUrls: ['./resale-product.component.scss'] /*Chage styleUrl a styleUrls */
})
export class ResaleProductComponent implements OnInit {

  showModal: boolean = false;
  resaleProducts: ResaleProduct[] = [];
  createdProduct: ResaleProduct | null = null;  //New created resaleProduct  = {} as ResaleProduct 
  selectedProduct: Partial<ResaleProduct> = {}; //Partial to not require all fields.

  resProsNearDatesList: ResaleProductWithNearestExpiration[] = [];
  resProdWithNearExp: ResaleProductWithNearestExpiration | null = null;

  resaleProdDto: ResaleProdDto = {
    productCode: null,
    productName: '',
    unitType: '',
    stock: null,
    costPrice: null,
    packagingPrice: null,
    deliveryPrice: null,
    markingMargin: null,
    commission: null,
    expDto: {
      productCode: null,
      qty: null,
      buyDate: '',
      expireDate: ''
    }
  };

  constructor(private service: ResaleProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  //Open modal and show created product
  //openModal(product: ResaleProduct) {
  openModal(product: ResaleProductWithNearestExpiration) {
    //this.createdProduct = product;
    this.resProdWithNearExp = product;
    this.showModal = true;
  }

  //Close modal
  closeModal() {
    this.showModal = false;
    this.resProdWithNearExp = null;
    //this.createdProduct = null;
  }

  /*
  loadResaleProductsWithNearestExpireDate() {
    this.service.getAllResaleProducts().subscribe(products => {
      this.resaleProducts = products;

      this.service.getProductsWithNearestExpiration().subscribe(expData => {
        this.expirations = expData;

        // Vinculamos la fecha de expiración más próxima a cada producto
        this.resaleProducts.forEach(prod => {
          const exp = this.expirations.find(e => e.productCode === prod.productCode);
          (prod as any).nearestExpirationDate = exp?.nearestExpirationDate ?? null;
        });
      });
    });
  }*/

  //Charge all resale products when charge componente resale-product
  loadProducts(): void {
    this.service.getProductsWithNearestExpiration().subscribe((data) => {
      this.resProsNearDatesList = data;
      //this.service.getAllResaleProducts().subscribe((data) => {
      //this.resaleProducts = data;
    });
  }

  //Create a Resale Product and open modal with the response of backend
  createResaleProduct(): void {
    if (!this.isDtoValid(this.resaleProdDto)) {
      alert('Por favor completá todos los campos antes de crear el producto.');
      return;
    }
    this.service.createResaleProduct(this.resaleProdDto).subscribe({
      //next: (createdProduct) => {      
      //this.resaleProducts.push(createdProduct);
      next: (resProdWithNearExp) => {
        console.log("ResaleProduct creado correctamente, ahora me trae el resProdWithNearestExp:", resProdWithNearExp);
        this.resProsNearDatesList.push(resProdWithNearExp);
        this.clearForm();
        this.resProdWithNearExp = resProdWithNearExp;
        this.openModal(resProdWithNearExp);
      },
      error: (err) => {
        console.error(err);
        const message = err.error || 'Ocurrio un error al crear el Product.';
        alert(message);
      }
    });
  }

  searchProduct(): void {
    const { productCode, productName } = this.selectedProduct;
    const identifier = productCode || productName?.trim();
    if (!identifier) {
      alert('Debes ingresar el código o nombre del producto.');
      return;
    }
    this.getResaleProduct(identifier);
  }

  private getResaleProduct(identifier: number | string): void {
    const observable = typeof identifier === 'number'
      ? this.service.getResaleProductByCode(identifier)
      : this.service.getResaleProductByProductName(identifier);

    observable.subscribe({
      next: (resProdWithNearExp) => {
        console.log("Resale traido del back:", resProdWithNearExp);
        this.selectedProduct = {};
        this.openModal(resProdWithNearExp);
      },
      error: (err) => {
        console.error('Error al buscar producto:', err);
        alert(err.status === 404 ? 'Producto no encontrado.' : 'Error al buscar producto.');
      }
    });
  }

  //Delete Resale Product
  deleteProduct(productCode: number): void {
    this.service.deleteResaleProduct(productCode).subscribe(() => {
      this.loadProducts();
    });
  }

  clearForm() {
    this.resaleProdDto = {
      productCode: null,
      productName: '',
      unitType: '',
      stock: null,
      costPrice: null,
      packagingPrice: null,
      deliveryPrice: null,
      markingMargin: null,
      commission: null,
      expDto: {
        productCode: null,
        qty: null,
        buyDate: '',
        expireDate: ''
      }
    };
  }

  isDtoValid(dto: ResaleProdDto): boolean {
    return dto.productCode != null &&
      dto.productName?.trim() !== '' &&
      dto.unitType?.trim() !== '' &&
      dto.stock != null &&
      dto.costPrice != null &&
      dto.packagingPrice != null &&
      dto.deliveryPrice != null &&
      dto.markingMargin != null &&
      dto.commission != null &&
      dto.expDto.buyDate?.trim() !== '' &&
      dto.expDto.expireDate?.trim() !== '';
  }

  // Method to turn into Red or Orange the expireDate depending its period
  getExpireDateClass(nearestExpireDate: string | null): string {
    if (!nearestExpireDate) {
      return '';
    }

    // Convertir de "dd-MM-yyyy" a "yyyy-MM-dd"
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


}
