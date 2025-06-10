import { Component } from '@angular/core';
import { PreSellerService } from '../service/pre-seller.service';
import { CommonModule, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PreSeller, PreSellerDto } from '../models/pre-seller.model';
import { Observable } from 'rxjs';
import { Purchase, PurchasedProduct, PurchasedProductDto, PurchaseDto } from '../models/purchase.model';
@Component({
  selector: 'app-pre-seller',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgFor],
  templateUrl: './pre-seller.component.html',
  styleUrl: './pre-seller.component.scss'
})

export class PreSellerComponent {

  preSeller: PreSeller = {} as PreSeller;
  preSellerDto: PreSellerDto = {} as PreSellerDto;
  preSellers: PreSeller[] = [];
  createdPreSeller: PreSeller | null = null;

  purchaseDto: PurchaseDto = {
    purchaseDate: '',
    preSellerName: '',
    purProdDtoList: []
  };

  purchase: Purchase = {} as Purchase;
  purchasedProductDto: PurchasedProductDto = {} as PurchasedProductDto;
  purchasedProduct: PurchasedProduct = {} as PurchasedProduct;

  purchaseDtoList: PurchaseDto[] = [];
  purchasedProductDtoList: PurchasedProductDto[] = [];
  purchaseList: Purchase[] = [];
  purchasedProductsList: PurchasedProduct[] = [];

  createdPurchase: Purchase | null = null;
  preSellerName: string = '';

  showModal: boolean = false;
  selectedPreSellerName: string = '';

  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  totalPages = 0;


  constructor(private service: PreSellerService) { }

  ngOnInit() {
    this.loadPreSellers();
  }

  loadPreSellers(page: number = 0) {
    this.service.getAllPreSellers(page, this.pageSize).subscribe(data => {
      console.log('RESPUESTA DEL SERVICIO', data);
      this.preSellers = data.content;
      this.totalItems = data.totalElements;
      this.pageSize = data.size;
      this.currentPage = data.number;
      this.totalPages = data.totalPages;
    });
  }

  //Page changer
  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.loadPreSellers(newPage);
    }
  }
  /*
    loadPreSellers() {
      this.service.getAllPresellers().subscribe((data) => {
        this.preSellers = data;
      })
    }
  */

  openPurchaseModal(preSellerName: string): void {
    if (!this.isPreSellerNameValid(preSellerName)) {
      alert('Debe ingresar el nombre del Proveedor.')
      return;
    }
    this.service.getPreSellerByName(preSellerName).subscribe({
      next: (foundPreSeller) => {
        this.selectedPreSellerName = preSellerName;
        this.service.getPurchaseListbyPreSellerName(preSellerName).subscribe({
          next: (data) => {
            if (data.length === 0) {
              alert('No se encontraron compras para este proveedor.');
              return;
            }
            this.purchaseList = data;
            this.showModal = true;
            this.clearPreSellerName();
          },
          error: (err) => {
            console.error('Error al obtener compras:', err);
          }
        });
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Proveedor no encontrado con ese nombre.');
        } else {
          console.error('Error al verificar el proveedor: ', err);
          alert('Ocurrio un error al verificar el proveedor.');
        }
      }
    });
    /*
    this.selectedPreSellerName = preSellerName;
    this.service.getPurchaseListbyPreSellerName(preSellerName).subscribe({
      next: (data) => {
        if (data.length === 0) {
          alert("No se encontraron compras para este proveedor.");
          return;
        }
        this.purchaseList = data;
        this.showModal = true;
        this.clearPreSellerName();
      },
      error: (err) => {
        console.error('Error al obtener compras del proveedor:', err);
      }
    });
    */
  }

  closeModal() {
    this.showModal = false;
    this.purchaseList = [];
  }

  createPreSeller(): void {
    const preSellerDto = this.preSellerDto;
    if (!preSellerDto.preSellerName || !preSellerDto.preSellerBrand || !preSellerDto.preSellerPhone || !preSellerDto.address || !preSellerDto.email
    ) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
    //this.service.createPreSeller(this.preSellerDto).subscribe((creatededPreSeller) => {
    //this.preSellers.push(creatededPreSeller);
    //this.clearFormPreSeller();
    //this.loadPreSellers();
    //})
    this.service.createPreSeller(this.preSellerDto).subscribe({
      next: (createdPreSeller) => {
        this.createdPreSeller = createdPreSeller;
        this.clearFormPreSeller();
        this.preSellers.push(this.preSeller);
        this.loadPreSellers();
        alert('Proveedor creado correctamente')
      },
      error: (err) => {
        console.error(err);
        alert('Proveedor ya existente con ese nombre');
      }
    })

  }

  clearFormPreSeller() {
    this.preSellerDto = {
      preSellerName: '',
      preSellerBrand: '',
      preSellerPhone: '',
      address: '',
      email: ''
    }
  }

  createPurchase(): void {
    if (!this.isPurchaseDtoValid(this.purchaseDto)) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    this.service.createPurhase(this.purchaseDto).subscribe({
      next: (createdPurchase) => {
        this.createdPurchase = createdPurchase;
        this.clearFormPurchase();
        alert('Compra creada exitosamente');
      },
      error: (err) => {
        console.error(err);
        if (err.status === 404 && err.error.includes("PreSeller")) {
          alert("Proveedor no encontrado con ese nombre.")
        } else {
          alert("Ocurrio un error al crear la compra.")
        }
      }
    });
  }

  isPurchaseDtoValid(dto: PurchaseDto): boolean {
    const { purchaseDate, preSellerName, purProdDtoList } = dto;
    if (!purchaseDate || !preSellerName || !purProdDtoList?.length) {
      return false;
    }
    for (let prod of purProdDtoList) {
      if (!prod.name || !prod.brand || prod.unitCost <= 0 || prod.qty <= 0) {
        return false;
      }
    }
    return true;
  }

  //Eliminate the product in position i from list
  removeProduct(i: number) {
    this.purchaseDto.purProdDtoList.splice(i, 1);
  }

  //Open form to add a product to the Purchased Products List 
  addProduct() {
    const newProduct: PurchasedProductDto = {
      name: '',
      brand: '',
      unitCost: 0,
      qty: 0
    };
    this.purchaseDto.purProdDtoList.push(newProduct);
  }

  //Clean Purchase form
  clearFormPurchase() {
    this.purchaseDto = {
      purchaseDate: '',
      preSellerName: '',
      purProdDtoList: []
    }
  }

  //Validate preSellerName fiel
  isPreSellerNameValid(preSellerName: string): boolean {
    if (!preSellerName) {
      return false;
    }
    return true;
  }

  //Clear form
  clearPreSellerName() {
    this.preSellerName = '';
  }


}
