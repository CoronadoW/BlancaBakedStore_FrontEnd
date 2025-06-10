export interface FinancialAnalysisDto {
    normalFixCostDto: number | null;
    normalSaleAverageDto: number | null;
}

export interface FinancialAnalysis extends FinancialAnalysisDto {
    normalFixCost: number | null;
    normalSaleAverage: number | null;
    fixCostIncidence: number | null;
}