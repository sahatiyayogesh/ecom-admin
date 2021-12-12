import { Component, OnInit } from '@angular/core';
import { Options, LabelType, ChangeContext } from '@angular-slider/ngx-slider';
import * as productData from '../../assets/json-data/product.json';
import { IFilterParams, IProduct } from '../shared/models/product';
import Swal from 'sweetalert2';
import { SearchProductService } from '../shared/services/search-product.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

	public productStaticData: IProduct[] = (productData as any).default;
	public productList: IProduct[] = [];
	public minValue: number = 1000;
	public maxValue: number = 4000;
	public options: Options = {
		floor: 0,
		ceil: 5000,
		draggableRange: true,
		hidePointerLabels: true,
		translate: (value: number, label: LabelType): string => {
			switch (label) {
				case LabelType.Low:
					return '';
				case LabelType.High:
					return '';
				default:
					return 'Rs ' + value;
			}
		}
	};
	public searchSubscription: Subscription;
	public searchFilter: IFilterParams = { key: 'product_name', value: '' };
	public categoryFilter: IFilterParams = { key: 'product_category', value: '', exactMatch: true, multiple: [] };
	public genderFilter: IFilterParams = { key: 'product_gender', value: '', exactMatch: true, multiple: [] };
	public softDeleteFilter: IFilterParams = { key: 'product_soft_deleted', value: 'false' };
	public hardDeleteFilter: IFilterParams = { key: 'product_hard_deleted', value: 'false' };
	public priceFilter: IFilterParams = {
		key: 'product_price', value: {
			highValue: this.maxValue,
			value: this.minValue
		}
	};
	public categoryList = [
		{
			title: 'Gender',
			types: [
				{
					id: 'men',
					label: 'Men',
					isChecked: false
				},
				{
					id: 'women',
					label: 'Women',
					isChecked: false
				}
			]
		},
		{
			title: 'Clothing',
			types: [
				{
					id: 'jeans',
					label: 'Jeans',
					isChecked: false
				},
				{
					id: 't-shirt',
					label: 'T-Shirt',
					isChecked: false
				},
				{
					id: 'shoes',
					label: 'shoes',
					isChecked: false
				}
			]
		},
		{
			title: 'Accessories',
			types: [
				{
					id: 'belt',
					label: 'Belt',
					isChecked: false
				},
				{
					id: 'wallet',
					label: 'Wallet',
					isChecked: false
				}
			]
		}
	]

	constructor(public searchService: SearchProductService) { }

	ngOnInit() {
		this.searchSubscription = this.searchService.getSearchText().subscribe((searchText: string) => {
			this.searchFilter.value = searchText;
		});

		this.priceFilter.value = {
			highValue: this.maxValue,
			value: this.minValue
		}
		if (localStorage.getItem('products')) {
			this.productList = JSON.parse(localStorage.getItem('products'));
			this.options.ceil = Math.max.apply(Math, this.productList.map((p) => p.product_price));
		} else {
			localStorage.setItem('products', JSON.stringify(this.productStaticData));
			this.productList = this.productStaticData;
			this.options.ceil = Math.max.apply(Math, this.productStaticData.map((p) => p.product_price));
		}
	}

	onUserChangeEnd(changeContext: ChangeContext): void {
		this.priceFilter.value = {
			highValue: changeContext.highValue,
			value: changeContext.value
		}
	}

	onCategoryChange(event: any): void {
		const value = event.target.value;
		const isChecked = event.target.checked;
		if (value === 'men' || value === 'women') {
			if (isChecked) {
				this.genderFilter.multiple.push(value);
			} else {
				const index = this.genderFilter.multiple.findIndex((i) => i === value);
				if (index > -1) {
					this.genderFilter.multiple.splice(index, 1);
				}
			}
		} else {
			if (isChecked) {
				this.categoryFilter.multiple.push(value);
			} else {
				const index = this.categoryFilter.multiple.findIndex((i) => i === value);
				if (index > -1) {
					this.categoryFilter.multiple.splice(index, 1);
				}
			}
		}
	}

	softDeleteItem(item: IProduct): void {
		Swal.fire({
			title: 'Are you sure?',
			text: "You want to delete this item!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				item.product_soft_deleted = 'true';
				localStorage.setItem('products', JSON.stringify(this.productList));
				Swal.fire(
					'Deleted!',
					'Your item has been deleted.',
					'success'
				)
			}
		})
	}

	ngOnDestroy(): void {
		this.searchSubscription.unsubscribe();
	}

}
