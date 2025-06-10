



export interface ResaleProduct extends ResaleProdDto {
    id: number;
    totalCost: number | null;
    salePrice: number | null;
    marginalContribution: number | null;
    contributionMargin: number | null;
    salePriceWithCommission: number | null;
    marginalContribWithCommission: number | null;
    contribMarginWithCommission: number | null;
    expirations: Expiration[];
}

export interface ResaleProdDto {
    productCode: number | null;
    productName: string;
    unitType: string;
    stock: number | null;
    costPrice: number | null;
    packagingPrice: number | null;
    deliveryPrice: number | null;
    markingMargin: number | null;
    commission: number | null;
    expDto: ExpirationDto;
}

export interface ExpirationDto {
    productCode: number | null;
    qty: number | null;
    buyDate: string;
    expireDate: string;
}

export interface Expiration {
    id: number;
    qty: number;
    buyDate: string;     // en formato ISO, ej: "2025-05-28"
    expireDate: string;  // en formato ISO también
}

export interface ResaleProductWithNearestExpiration {
    productCode: number;
    productName: string;
    unitType: string;

    stock: number;

    costPrice: number | null;
    packagingPrice: number | null;
    deliveryPrice: number | null;
    markingMargin: number | null;
    commission: number | null;
    totalCost: number | null;
    salePrice: number | null;
    marginalContribution: number | null;
    contributionMargin: number | null;
    salePriceWithCommission: number | null;
    marginalContribWithCommission: number | null;
    contribMarginWithCommission: number | null;

    nearestExpireDate: string | null;
    qty: number | null;

}

export interface ExpirationRecived {
    id: number;
    qty: number;
    buyDate: string;
    expireDate: string;
    resaleProduct: ResaleProduct;
}