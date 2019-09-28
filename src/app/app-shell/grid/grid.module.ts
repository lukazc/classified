import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbAlertModule, NgbTabsetModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { GridComponent } from './grid.component';
import { GridRoutingModule } from './grid-routing.module';
import { GridBoxComponent } from './grid-box/grid-box.component';
import { WarningMessageModule } from '../../shared/warning-message/warning-message.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TypeaheadSearchboxComponent } from './typeahead-searchbox/typeahead-searchbox.component'
import { AnnotationsFilterPipe } from './../../shared/annotations-filter/annotations-filter.pipe';

@NgModule({
  declarations: [
    GridComponent,
    GridBoxComponent,
    TypeaheadSearchboxComponent,
    AnnotationsFilterPipe
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
