import { Component } from '@angular/core';

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

    constructor(public sellingsProvider: Sellings) {}

    ionViewWillEnter() {
        this.sellingsProvider.get()
        .subscribe(sellingsObject => {
            this.sellings = sellingsObject.items

            this.groupedSellings = _.each(this.sellings, selling => selling.time = moment(selling.createdAt).format('h:mm a'));
            this.groupedSellings = _.groupBy(this.groupedSellings, selling => moment(selling.createdAt).format('dddd, Do MMMM YYYY'))
            this.groupedSellings = _.map(this.groupedSellings, function(sellings, day) { return { day: day, sellings: _.orderBy(sellings, ['createdAt'], ['desc']) }; });
        });
    }
}
