import { Pipe, PipeTransform } from '@angular/core';
interface IFilterParams {
    key: string;
    value: string | any;
    exactMatch?: boolean;
    additionalKeys?: string[];
    multiple?: Array<string>;
}

@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    static filter(items: Array<{ [key: string]: any }>, term: IFilterParams): Array<{ [key: string]: any }> {
        const toCompare = term.value ? term.value.toString().toLowerCase() : '';
        if (items && items.length) {
            return items.filter(function (item: any) {
                if (term.exactMatch) {
                    // For multiple select filters.
                    if (term.multiple && term.multiple.length) {
                        let matched = 0;
                        term.multiple.forEach((value: string) => {
                            if (value.toLowerCase() === item[term.key].toString().toLowerCase()) {
                                matched++;
                            }
                        });
                        return matched ? true : false;
                    }

                    // For single select filters.
                    if (!term.value || toCompare === item[term.key].toString().toLowerCase()) {
                        return true;
                    }
                } else {
                    if (item[term.key]) {
                        if (item[term.key].toString().toLowerCase().includes(toCompare)) {
                            return true;
                        }
                    } else {
                        return items;
                    }
                    if (term.additionalKeys && term.additionalKeys.length) {
                        let isMatched = 0;
                        term.additionalKeys.forEach((addKey: string) => {
                            if (item[addKey]) {
                                if (item[addKey].toString().toLowerCase().includes(toCompare)) {
                                    isMatched++;
                                }
                            }
                        });
                        return isMatched > 0;
                    }
                }
            });
        } else {
            return [];
        }
    }

    transform(items: Array<any>, term: IFilterParams): any {
        if (!term) { return items; }
        return FilterPipe.filter(items, term);
    }
}

@Pipe({
    name: 'rangeFilter',
    pure: false
})
export class RangeFilterPipe implements PipeTransform {
    static filter(items: Array<{ [key: string]: any }>, term: IFilterParams): Array<{ [key: string]: any }> {
        const toCompare: any = term.value ? term.value : '';
        if (items && items.length) {
            return items.filter(function (item: any) {
                if (item[term.key]) {
                    const value = item[term.key] - (item[term.key] *
                        item.product_discount_percentage / 100);
                    if (value >= toCompare.value && value <= toCompare.highValue) {
                        return true;
                    }
                } else {
                    return items;
                }
            });
        } else {
            return [];
        }
    }

    transform(items: Array<any>, term: IFilterParams): any {
        if (!term) { return items; }
        return RangeFilterPipe.filter(items, term);
    }
}
