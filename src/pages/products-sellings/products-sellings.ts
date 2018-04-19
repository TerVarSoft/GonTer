import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductSellingUpdatePage } from './product-selling-update/product-selling-update';

import * as _ from "lodash";
import * as moment from 'moment';

import { Sellings } from '../../providers/sellings';

import { Selling } from '../../models/selling';

@Component({
    selector: 'products-sellings',
    templateUrl: 'products-sellings.html'
})
export class ProductsSellingsPage {
    private sellings: Selling[];

    private groupedSellings = [];

    filterDate: Date;

    constructor(public sellingsProvider: Sellings,
        public navCtrl: NavController) { }

    ionViewWillEnter() {
        this.sellingsProvider.get()
            .subscribe(sellingsObject => {
                this.formatSellings(sellingsObject);
            });
    }

    editSelling(selling: Selling) {
        this.navCtrl.push(ProductSellingUpdatePage, {
            selling: selling
        });
    }

    filterByDate() {
        if (this.filterDate) {
            this.sellingsProvider.getByDate(this.filterDate)
                .subscribe(sellingsObject => {
                    this.formatSellings(sellingsObject);
                });
        } else {
            this.sellingsProvider.get()
                .subscribe(sellingsObject => {
                    this.formatSellings(sellingsObject);
                });
        }

    }

    private formatSellings(sellingsObject) {
        this.sellings = _.orderBy(sellingsObject.items, ['createdAt'], ['desc']);

        this.groupedSellings = _.each(this.sellings, selling => selling.time = moment(selling.createdAt).format('h:mm a'));
        this.groupedSellings = _.groupBy(this.groupedSellings, selling => moment(selling.createdAt).format('dddd, Do MMMM YYYY'))
        this.groupedSellings = _.map(this.groupedSellings, function (sellings, day) { return { day: day, sellings: sellings }; });
    }

    clearFilterDate() {
        this.filterDate = null;
    }
}
