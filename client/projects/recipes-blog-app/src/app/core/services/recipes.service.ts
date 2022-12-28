import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IRecipe } from "projects/recipes-blog-app/src/app/shared/interfaces";

import { environment } from "projects/recipes-blog-app/src/environments/environment";

export interface IRecipesQueryResponse {
    recipes: IRecipe[] | [];
    message: string;
    total: number;
}

export interface IRecipeCreateResponse {
    recipe?: IRecipe;
    message: string;
}

@Injectable()
export class RecipesService {

    constructor(
        private readonly http: HttpClient
    ) { }

    getAll(page: number, size: number, filterOptions: { [key: string]: string } = {}): Observable<IRecipesQueryResponse> {
        return this.http.get<IRecipesQueryResponse>(`${environment.apiUrl}/recipes`, { params: { page, size, ...filterOptions }});
    }

    create(payload: Pick<IRecipe, 'title' | 'content'>): Observable<IRecipeCreateResponse> {
        return this.http.post<IRecipeCreateResponse>(`${environment.apiUrl}/recipes`, payload);
    }

}