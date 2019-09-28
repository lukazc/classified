﻿import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridComponent } from './grid.component';
import { GridRoutingModule } from './grid-routing.module';
import { GridBoxComponent } from './grid-box/grid-box.component';
import { WarningMessageModule } from '../../shared/warning-message/warning-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GridComponent,
    GridBoxComponent
  ],
  imports: [
    CommonModule,
    WarningMessageModule,
    GridRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GridModule { }
