import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeCost, RecipeDto } from '../models/recipe.model';
import { Observable } from 'rxjs';
import { FinancialAnalysis, FinancialAnalysisDto } from '../models/financialAnalysis.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = 'http://localhost:8080/recipeCost';

  private http = inject(HttpClient);

  //Method to create Recipe
  createRecipeCost(recipeDto: RecipeDto): Observable<RecipeCost> {
    return this.http.post<RecipeCost>(`http://localhost:8080/recipeCost/create`, recipeDto);
  }

  //Method to get all Recipes
  getAllRecipeCosts(): Observable<RecipeCost[]> {
    return this.http.get<RecipeCost[]>(`${this.apiUrl}/getAll`);
  }

  //Method to delete RecipeCost
  deleteRecipeCost(recipeName: string): Observable<any> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${recipeName}`);
  }

  //Method to find a Recipe through its name
  getRecipeByName(recipeName: string): Observable<RecipeCost | null> {
    return this.http.get<RecipeCost>(`${this.apiUrl}/get/${recipeName}`);
  }

  //--------------------------FinancialAnalysis----------------------------------

  //Method to create Financial Analysis and to get ConstIncidence
  createFinancialAnalysis(financialAnalysisDto: FinancialAnalysisDto): Observable<FinancialAnalysis> {
    return this.http.post<FinancialAnalysis>('http://localhost:8080/financialAnalysis/create', financialAnalysisDto);
  }

  getLastFinancialAnalysis(): Observable<FinancialAnalysis> {
    return this.http.get<FinancialAnalysis>('http://localhost:8080/financialAnalysis/getLast');
  }


}
