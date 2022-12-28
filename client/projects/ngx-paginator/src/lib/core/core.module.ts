import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from "@angular/core";
import { PaginatorComponent } from "./components";

@NgModule({
    declarations: [
        PaginatorComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        PaginatorComponent
    ]
})
export class CoreModule {
    static forRoot(): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: []
        }
    }
}