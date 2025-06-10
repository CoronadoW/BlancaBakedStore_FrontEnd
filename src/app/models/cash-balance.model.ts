export interface CashBalanceDto {
    date: string;
    shift: string; //For shift of employees
    employeeName: string;
    openingCashBalance: number;
    openingCashOnHand: number;
    cashSales: number;
    cardSales: number;
    transferSales: number;
    qrSales: number;
    systemTotalSales: number;
    cashPayments: number;
    otherPayments: number;
    observations: string;
}

export interface CashBalance extends CashBalanceDto {
    id: number;
    totalSales: number;
    control: number;
    totalPayments: number;
    endingCashBalance: number;
}