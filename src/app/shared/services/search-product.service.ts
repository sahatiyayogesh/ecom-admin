import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SearchProductService {

	private searchText = new Subject<any>();

	setSearchText(data: any) {
		this.searchText.next(data);
	}

	getSearchText(): Observable<any> {
		return this.searchText.asObservable();
	}

}
