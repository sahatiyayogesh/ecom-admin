import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../shared/models/product';

@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

	public selectedProduct: IProduct;
	constructor(public activatedRoute: ActivatedRoute) { }

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			const productId = parseInt(params.id);
			const products = JSON.parse(localStorage.getItem('products'));
			const index = products.findIndex(p => p.product_id === productId);
			if (index > -1) {
				this.selectedProduct = products[index];
			}
		});
	}

}
