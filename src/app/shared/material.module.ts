import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule
} from '@angular/material';
import { AutosizeModule } from 'ngx-autosize';
import {
    PerfectScrollbarModule, PerfectScrollbarConfigInterface,
    PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
    useBothWheelAxes: false,
    suppressScrollX: true
};

const exportedMatModule = [
    MatBottomSheetModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    PerfectScrollbarModule,
    AutosizeModule
];

@NgModule({
    declarations: [],
    exports: [...exportedMatModule],
    imports: [CommonModule, ...exportedMatModule],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        }
    ],
})
export class MaterialModule { }
