import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
	selector: 'app-typeahead-searchbox',
	templateUrl: './typeahead-searchbox.component.html',
	styleUrls: ['./typeahead-searchbox.component.css']
})
export class TypeaheadSearchboxComponent implements OnInit {

	@Input() labels: string[] = [];
	@Output() query = new EventEmitter<string>();

	public searchInput: string;

	constructor() { }
	
	ngOnInit() {
	}

	emitQuery() {
		this.query.emit(this.searchInput);
	}
	
	// must be a fat-arrow function because of scoping problems
	searchTypeahead = (text$: Observable<string>) => {
		return text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			// switchMap(),
			map(term => term.length < 1 ? []
				: this.labels.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
		)
	}
			
}