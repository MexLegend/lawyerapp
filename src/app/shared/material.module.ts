import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule
} from '@angular/material';

const exportedMatModule = [
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSnackBarModule
];

@NgModule({
    declarations: [],
    exports: [...exportedMatModule],
    imports: [CommonModule, ...exportedMatModule]
})
export class MaterialModule { }
