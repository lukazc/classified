import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule, NgbTabsetModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { GridComponent } from './grid.component';
import { GridRoutingModule } from './grid-routing.module';
import { GridBoxComponent } from './grid-box/grid-box.component';
import { WarningMessageModule } from '../../shared/warning-message/warning-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
;
import { TypeaheadSearchboxComponent } from './typeahead-searchbox/typeahead-searchbox.component'

@NgModule({
  declarations: [
    GridComponent,
    GridBoxComponent,
    TypeaheadSearchboxComponent
  ],
  imports: [
    CommonModule,
    WarningMessageModule,
    GridRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAlertModule,
    NgbTabsetModule,
    NgbTypeaheadModule,
    FontAwesomeModule
  ]
})
export class GridModule { }
