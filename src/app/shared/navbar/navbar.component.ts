import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchProductService } from '../services/search-product.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {

	public iconOnlyToggled = false;
	public sidebarToggled = false;
	public debouncer: Subject<string> = new Subject<string>();
	public searchText: string;
	public showSearch: boolean = true;

	constructor(config: NgbDropdownConfig, public searchService: SearchProductService, public router: Router) {
		config.placement = 'bottom-right';
	}

	ngOnInit() {
		this.debouncer.pipe(debounceTime(500))
			.subscribe((value) => {
				this.searchService.setSearchText(value);
			});
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				if (event.url === '/dashboard' || event.url === '/trash') {
					this.showSearch = true;
				} else {
					this.showSearch = false;
				}
				this.searchService.setSearchText('');
				this.searchText = '';
			}
		});
	}

	// toggle sidebar in small devices
	toggleOffcanvas() {
		document.querySelector('.sidebar-offcanvas').classList.toggle('active');
	}

	// toggle sidebar
	toggleSidebar() {
		let body = document.querySelector('body');
		if ((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
			this.iconOnlyToggled = !this.iconOnlyToggled;
			if (this.iconOnlyToggled) {
				body.classList.add('sidebar-icon-only');
			} else {
				body.classList.remove('sidebar-icon-only');
			}
		} else {
			this.sidebarToggled = !this.sidebarToggled;
			if (this.sidebarToggled) {
				body.classList.add('sidebar-hidden');
			} else {
				body.classList.remove('sidebar-hidden');
			}
		}
	}

}

