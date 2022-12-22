import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IRecipe } from "src/app/shared/interfaces";

import { environment } from "src/environments/environment";

export interface IRecipesQueryResponse {
    recipes: IRecipe[] | [];
    message: string;
    total: number;
}

@Injectable()
export class RecipesService {

    constructor(
        private readonly http: HttpClient
    ) { }

    getAll(page: number, size: number, filterOptions: { [key: string]: string } = {}): Observable<IRecipesQueryResponse> {
        return this.http.get<IRecipesQueryResponse>(`${environment.apiUrl}/recipes`, { params: { page, size, ...filterOptions }});
    }

}