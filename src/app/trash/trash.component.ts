import { Component, OnInit } from '@angular/core';
import * as productData from '../../assets/json-data/product.json';
import { IFilterParams, IProduct } from '../shared/models/product';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { SearchProductService } from '../shared/services/search-product.service';

@Component({
	selector: 'app-trash',
	templateUrl: './trash.component.html',
	styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {

	public productList: IProduct[] = [];
	public productStaticData: IProduct[] = (productData as any).default;
	public searchSubscription: Subscription;
	public searchFilter: IFilterParams = { key: 'product_name', value: '' };
	public softDeleteFilter: IFilterParams = { key: 'product_soft_deleted', value: 'true' };
	public hardDeleteFilter: IFilterParams = { key: 'product_hard_deleted', value: 'false' };

	constructor(public searchService: SearchProductService) { }

	ngOnInit(): void {
		this.searchSubscription = this.searchService.getSearchText().subscribe((searchText: string) => {
			this.searchFilter.value = searchText;
		});

		if (localStorage.getItem('products')) {
			this.productList = JSON.parse(localStorage.getItem('products'));
		} else {
			localStorage.setItem('products', JSON.stringify(this.productStaticData));
			this.productList = this.productStaticData;
		}
	}

	restoreItem(item: IProduct): void {
		Swal.fire({
			title: 'Are you sure?',
			text: "You want to restore this item!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, restore it!'
		}).then((result) => {
			if (result.isConfirmed) {
				item.product_soft_deleted = 'false';
				localStorage.setItem('products', JSON.stringify(this.productList));
				Swal.fire(
					'Restored!',
					'Your item has been restored.',
					'success'
				)
			}
		})
	}

	hardDeleteItem(item: IProduct): void {
		Swal.fire({
			title: 'Are you sure?',
			text: "You want to delete this item forever!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				item.product_hard_deleted = 'true';
				localStorage.setItem('products', JSON.stringify(this.productList));
				Swal.fire(
					'Deleted!',
					'Your item has been deleted forever.',
					'success'
				)
			}
		})
	}

	ngOnDestroy(): void {
		this.searchSubscription.unsubscribe();
	}

}
