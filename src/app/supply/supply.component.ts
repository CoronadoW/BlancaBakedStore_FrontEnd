import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Supply } from '../models/supply.model';
import { SupplyService } from '../service/supply.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supply',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './supply.component.html',
  styleUrl: './supply.component.scss'
})
export class SupplyComponent implements OnInit {

  supplies: Supply[] = [];

  newSupply: Supply = {
    supplyCode: null,
    supplyName: '',
    qtyPerUnit: null,
    expireDate: '',
    unit: '',
    cost: null,
    buyDate: '',
    supplyType: ''
  };

  createdSupply: Supply | null = null;
  searchSupplyName: string = '';
  showModal = false;

  constructor(private service: SupplyService) { }

  ngOnInit(): void {
    this.loadSupplies();
  }

  showSupplyDetail(supply: Supply): void {
    this.createdSupply = supply;
    this.showModal = true;
  }

  loadSupplies(): void {
    this.service.getAllSupplies().subscribe((data) => {
      this.supplies = data;
    });
  }

  createSupply(): void {
    if (!this.isNewSupplyValid(this.newSupply)) {
      return;
    }
    this.service.createSupply(this.newSupply).subscribe({
      next: (created) => {
        this.createdSupply = created;
        this.showModal = true;
        this.loadSupplies(); // actualiza la tabla
        this.newSupply = { // limpia el formulario
          supplyCode: null,
          supplyName: '',
          qtyPerUnit: null,
          expireDate: '',
          unit: '',
          cost: null,
          buyDate: '',
          supplyType: ''
        };
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Insumo ya existente con ese codigo o nombre.');
        } else {
          console.error('Error al crear insumo:', err);
        }
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.createdSupply = null;
  }

  getSupplyByName(): void {
    if (!this.isSupplyNameValid(this.searchSupplyName)) {
      return;
    }
    this.service.getSupplyByName(this.searchSupplyName).subscribe({
      next: (createdSupply) => {
        console.log('Supply obtained succesfully: ', createdSupply);
        this.createdSupply = createdSupply;
        this.showModal = true;
        this.searchSupplyName = '';
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Insumo no encontrado con ese nombre.');
        }
      }
    });
  }

  isSupplyNameValid(searchSupplyName: string): boolean {
    if (!searchSupplyName) {
      alert('Debe completar el campo Insumo');
      return false;
    }
    return true;
  }

  isNewSupplyValid(newSupply: Supply): boolean {
    const { supplyCode,
      supplyName,
      qtyPerUnit,
      expireDate,
      unit,
      cost,
      buyDate,
      supplyType } = this.newSupply;
    if (!supplyCode
      || !supplyName
      || !qtyPerUnit
      || !expireDate
      || !unit
      || !cost
      || !buyDate
      || !supplyType) {
      alert('Debe completar todos los campos.')
      return false;
    }
    return true;
  }
}
