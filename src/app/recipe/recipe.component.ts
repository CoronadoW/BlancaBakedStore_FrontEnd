import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RecipeCost, RecipeDto } from '../models/recipe.model';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../service/recipe.service';
import { FinancialAnalysis, FinancialAnalysisDto } from '../models/financialAnalysis.model';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgFor],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})

export class RecipeComponent {

  showModal: boolean = false;
  recipe: RecipeCost = {} as RecipeCost;
  recipes: RecipeCost[] = [];
  createdRecipe: RecipeCost | null = null;
  selectedRecipe: Partial<RecipeCost> = {};
  createdFinAn: FinancialAnalysis | null = null;

  recipeDto: RecipeDto = {
    recipeName: '',
    markingMarginDto: null,
    unitsPerRecipeDto: null,
    suppPerRecipeDtoList: []
  };

  constructor(private service: RecipeService) { }

  ngOnInit(): void {
    this.loadRecipes();
    this.getLastFinAn();
  }

  loadRecipes() {
    this.service.getAllRecipeCosts().subscribe((data) => {
      this.recipes = data;
    })
  }

  openModal(recipe: RecipeCost) {
    this.createdRecipe = recipe;
    console.log('Recipe detail list:', recipe.recipeDetailList);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.createdRecipe = null;
  }

  deleteRecipe(recipe: RecipeCost) {
    if (recipe.recipeName) {
      this.service.deleteRecipeCost(recipe.recipeName).subscribe(() => {
        this.loadRecipes();
      })
    }
  }

  createRecipe(): void {
    const { recipeName, markingMarginDto, unitsPerRecipeDto, suppPerRecipeDtoList } = this.recipeDto;
    if (!recipeName ||
      markingMarginDto === null || markingMarginDto <= 0 ||
      unitsPerRecipeDto === null || unitsPerRecipeDto <= 0 || suppPerRecipeDtoList.length === 0
    ) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }
    this.service.createRecipeCost(this.recipeDto).subscribe({
      next: (createdRecipe) => {
        this.recipes.push(createdRecipe);
        this.recipeDto = {} as RecipeDto;
        this.loadRecipes();
        this.openModal(createdRecipe);
      },
      error: (err) => {
        if (err.status === 409) {
          alert('Receta ya existe con ese nombre');
          //Better Way to show message from EntityNotFoundException
        } else if (err.status === 404 && typeof err.error === 'string') {
          alert('Error: ' + err.error);
        } else {
          alert('Error al crear receta');
        }
      }
    });
  }

  clearForm() {
    this.recipeDto = {
      recipeName: '',
      markingMarginDto: null,
      unitsPerRecipeDto: null,
      suppPerRecipeDtoList: []
    };
  }

  clearRecipeName() {
    this.recipe.recipeName = '';
  }

  searchRecipeByName(recipeName: string) {
    const name = recipeName;
    if (!name) {
      alert('Por favor ingresa un nombre de receta.');
      return;
    }
    this.service.getRecipeByName(name).subscribe({
      next: (createdRecipe) => {
        this.createdRecipe = createdRecipe;
        this.showModal = true;
        this.clearRecipeName();
        console.log('Recipe encontrada: ', this.recipe);
      },
      error: (err) => {
        console.log(err);
        alert('Receta no encontrada con ese nombre');
      }
    })
    //this.service.getRecipeByName(name).subscribe((recipe) => {
    //if (recipe) {
    //this.createdRecipe = recipe;
    //this.showModal = true;
    //console.log('Recipe encontrada:', recipe);
    //} else {
    //alert('Receta no encontrada.');
    //}
    //});
  }

  addSupply(): void {
    this.recipeDto.suppPerRecipeDtoList.push({
      suppNameDto: '',
      utilizedDto: null,
      wasteDto: null
    });
  }

  removeSupply(index: number): void {
    this.recipeDto.suppPerRecipeDtoList.splice(index, 1);
  }

  //-------------------------financialAnalysis----------------

  finAnDto: FinancialAnalysisDto = {
    normalFixCostDto: null,
    normalSaleAverageDto: null
  }

  createFinancialAnalysis() {
    const { normalFixCostDto, normalSaleAverageDto } = this.finAnDto;
    if (normalFixCostDto === null || normalFixCostDto <= 0 || normalSaleAverageDto === null || normalSaleAverageDto <= 0) {
      alert('Por favor, debe completar los campos correctamente');
      return;
    }
    this.service.createFinancialAnalysis(this.finAnDto).subscribe((response) => {
      this.createdFinAn = response;
      this.clearFinAnForm();
      console.log('Incidencia de costos fijos creado: ', this.createdFinAn);
      alert('Incidencia de costos fijos actualizado.')
    });
  }

  getLastFinAn() {
    this.service.getLastFinancialAnalysis().subscribe({
      next: (createdFinAn) => {
        this.createdFinAn = createdFinAn;
        console.log('Ultimo financialAnalysis recibido: ', createdFinAn);
      },
      error: (err) => {
        console.error(err);
        alert('No se encontro Indice de incidencia de costos.');
      }
    });
  }

  clearFinAnForm() {
    this.finAnDto = {
      normalFixCostDto: null,
      normalSaleAverageDto: null
    };
  }


}
