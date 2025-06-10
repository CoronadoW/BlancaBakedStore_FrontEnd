export interface SupplyPerRecipeDto {
    suppNameDto: string;
    utilizedDto: number | null;
    wasteDto: number | null;
}

export interface RecipeDto {
    recipeName: string;
    markingMarginDto: number | null;
    unitsPerRecipeDto: number | null;
    suppPerRecipeDtoList: SupplyPerRecipeDto[];
}

export interface RecipeDetail {
    suppName: string;
    suppType: string;
    qtyUtilized: number;
    waste: number;
    costPerRecipe: number;
    unitCostPerSupp: number;
}

export interface RecipeCost {
    id: number;
    recipeName: string;
    markingMargin: number;
    unitsPerRecipe: number;
    recipeDetailList: RecipeDetail[];
    variableCost: number;
    ingreVarCost: number;
    packVarCost: number;
    laborVarCost: number;
    effectivePrice: number;
    unitEffectivePrice: number;
    marginalContribution: number;
    fixCostDistribution: number;
    profit: number;
    unitTotalVarCost: number;
    unitIngreVarCost: number;
    unitLaborVarCost: number;
    unitPackVarCost: number;
    unitMarginalContribution: number;
    unitFixCostDistribution: number;
    unitProfit: number;
    variableCostPercent: number;
    ingrePercent: number;
    variableLaborPercent: number;
    packagingPercent: number;
    marginalContribPercent: number;
    fixCostDistribPercent: number;
    profitPercent: number;
}
