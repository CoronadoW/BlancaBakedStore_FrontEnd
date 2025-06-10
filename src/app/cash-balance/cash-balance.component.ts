import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CashBalance, CashBalanceDto } from '../models/cash-balance.model';
import { CashBalanceService } from '../service/cash-balance.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cash-balance',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './cash-balance.component.html',
  styleUrl: './cash-balance.component.scss'
})
export class CashBalanceComponent implements OnInit {

  shift: string = '';
  date: string = '';
  searchDate: string = '';
  searchShift: string = '';
  showBalance: boolean = false;
  cashBalance: CashBalance[] = [];
  cashBalanceDto: CashBalanceDto = {} as CashBalanceDto;
  createdCashBalance: CashBalance | null = null;


  constructor(private service: CashBalanceService) { }

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

  ngOnInit(): void {
    this.loadCashBalances();
  }

  //Method to show balance on modal when click on table
  openBalanceDetail(cashbalance: CashBalance): void {
    this.balance = cashbalance;
    this.showBalance = true;
  }

  //Method to show all cashBalances when init component
  loadCashBalances(): void {
    this.service.getAllCashBalance().subscribe((data) => {
      console.log('Respuesta desde backend:', data);
      this.cashBalance = data;
    });
  }

  //Method to create a CashBalance and open modal with the response of backend
  createCashBalance(): void {
    this.service.createCashBalance(this.cashBalanceDto).subscribe({
      next: (createdCashBalance) => {
        this.cashBalance.push(createdCashBalance);
        this.cashBalanceDto = {} as CashBalanceDto;
        this.createdCashBalance = createdCashBalance;
      },
      error: (err) => {
        console.error('Error al crear el cierre de caja', err);
        alert("Error al crear el cierre de caja.");
      }
    });
  }

  //Method to delete CashBalnce by its id
  deleteCashBalance(id: number): void {
    if (confirm('¿Estás seguro de que deseas borrar este cierre de caja?')) {
      this.service.deleteCashBalance(id).subscribe({
        next: (response) => {
          console.log(response); // Mensaje del backend
          this.cashBalance = this.cashBalance.filter(balance => balance.id !== id);
        },
        error: (err) => {
          console.error('Error al borrar el arqueo de caja', err);
        }
      });
    }
  }

  //Method to get CashBalance by its date and shift
  searchByDateAndShift(): void {
    if (!this.isDateAndShiftValid(this.searchDate, this.searchShift)) {
      return;
    }
    this.service.getByDateAndShift(this.searchDate, this.searchShift).subscribe({
      next: (createdCashBalance) => {
        console.log('Cierre de caja obtenido: ', createdCashBalance);
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
        this.searchDate = '';
        this.searchShift = '';
        this.showBalance = true;
      },

      error: (err) => {
        console.error('Error al obtener balance: ', err);
        alert('Cierre de caja no encontrado con esa fecha y turno');
      }

    });
  }

  //Method to get all CashBalance in a date
  searchBalancesByDate(): void {
    if (!this.isDateValid(this.date)) {
      return;
    }
    this.service.getByDate(this.date).subscribe({
      next: (cashBalance) => {
        this.cashBalance = cashBalance;
        this.date = '';
        console.log('Cash balances obtained succesfully: ', cashBalance);
      },
      error: (err) => {
        console.log('Error to obtain cash balances', err);
        alert(err.error?.message || 'Debe seleccionar una fecha.');
        //this.cashBalance = []; // Clean list to avoid error in ngfor
      }

    });
  }

  //Method to get all CashBalance in the same shift
  searchBalanceByShift(): void {
    if (!this.isShiftValid(this.shift)) {
      return;
    }
    this.service.getByShift(this.shift).subscribe({
      next: (cashBalance) => {
        console.log('Cash Balances obtained succesfully: ', cashBalance);
        this.cashBalance = cashBalance;
        this.shift = '';
      },
      error: (err) => {
        console.log('Error to obtain Cash Balances', err);
        alert(err.error?.message || 'Debe seleccionar un turno.');
        //this.cashBalance = [];
      }

    });
  }

  //Methos to close Modal that shows CashBalance
  closebalanceModal() {
    this.createdCashBalance = null;
    this.showBalance = false;
  }

  isDateAndShiftValid(searchDate: string, searchShift: string): boolean {
    if (!searchDate || !searchShift) {
      alert('Debe completar los campos Fecha y Turno.')
      return false;
    }
    return true;
  }

  isDateValid(searchDate: string): boolean {
    if (!searchDate) {
      alert('Debe ingresar una fecha.')
      return false;
    }
    return true;
  }

  isShiftValid(searchShift: string): boolean {
    if (!searchShift) {
      alert('Debe ingresar un turno.');
      return false;
    }
    return true;
  }


}
