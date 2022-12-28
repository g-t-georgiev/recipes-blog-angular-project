import { IBase } from "./base.interface";

export interface IRecipe extends IBase {
    title: string;
    content: string;
    authorId: string;
}