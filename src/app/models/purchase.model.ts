export interface PurchaseDto {
    purchaseDate: string;
    preSellerName: string;
    purProdDtoList: PurchasedProductDto[];
}

export interface PurchasedProductDto {
    name: string;
    brand: string;
    unitCost: number;
    qty: number;
}


export interface Purchase {
    totalPurchaseCost: number;
    purchaseDate: string;
    purProdList: PurchasedProduct[];
}

export interface PurchasedProduct {
    purProdName: string;
    purProdBrand: string;
    purProdUnitCost: number;
    purProdQty: number;
    totalCost: number;
}