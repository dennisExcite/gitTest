import $ from 'jquery';
import ko from 'knockout';
import _ from 'lodash';
import config from 'config';
import i18n from 'i18n';
import moment from 'moment';
import { activityStore, destinationStore, searchStore, userStore } from 'stores';
import 'bootstrap-carousel';
import 'bootstrap-transition';
import 'components/ei-select';
import 'components/ei-button';
import 'components/ei-activity-item-data';
import 'components/ei-room-result-list';
import 'components/ei-datepicker';
import 'components/ei-loading-message';
import 'components/ei-summary-footer';

/**
 * Class representing an activity view.
 */
export class ActivityView {
    activity = ko.observable(null);
    activityItem = null;
    calendarOptions = {
        singleDatePicker: true,
        alwaysShowCalendars: true,
        autoUpdateInput: false,
        autoApply: true,
        format: 'DD/MM/YYYY',
        minDate: moment(),
        maxDate: moment().add(18, 'months'),
        startDate: '30/06/2017'
    };
    travellers = {
        // adults: ko.observable(0);
        // children: ko.observable(0);
        // adults: ko.observable(0);
        // adults: ko.observable(0);
    };
    /**
     * Create an activity view.
     * @constructor
     * @param {object} params - parameters passed to the component.
     */
    constructor(params) {
        //set stores
        this.userStore = userStore;
        this.searchStore = searchStore;
        this.destinationStore = destinationStore;
        this.activityStore = activityStore;
        //set search params
        this.search = {
            idClient: this.userStore.idClient(),
            agencyUser: this.userStore.agencyUser(),
            destination: this.destinationStore.destination(),
            destinationId: this.destinationStore.destinationId(),
            destinationName: this.destinationStore.destinationName(),
            destinationType: this.destinationStore.destinationType()
        };

        this.numberOfGuest = [0, 1, 2, 3, 5, 6, 7, 8, 9];

        this.date = this.activityStore.date;
        this.isProcessingSearch = this.searchStore.isProcessingSearch;

        //set activity change
        this.activityChange = ko.computed(() => {
            if (this.isProcessingSearch() === false && this.activity()) {
                let activityItem = this.activity();
                //convert to object
                activityItem.additionalInformation = {};
                activityItem.additionalDescriptions.forEach((obj) => {
                    activityItem.additionalInformation[obj.name] = obj.description;
                });
                this.activityItem = activityItem;
                //sort images
                this.sortImages();
            }
        });
    }
    /**
     * Generate activity carousel.
     * @generateCarousel
     * @param {string} element - container.
     */
    afterRender(element) {
        const $carousel = $(element);
        $carousel.carousel({
            interval: false
        });
    }
    /**
     * sort images
     */
    sortImages() {
        let imageLen = this.activityItem.images.length;
        if (imageLen > 0 && imageLen < 3) {
            //show first image
            this.activityItem.images.slice(0, 1);
        } else if (imageLen >= 2 && imageLen < 4) {
            //show two thumbnails
            this.activityItem.images = this.activityItem.images.slice(0, 2);
        } else if (imageLen >= 4) {
            //show four thumbnails
            this.activityItem.images.slice(0, 4);
        } else if (imageLen === 0) {
            let defaultImage = config['static_url'] + '/images/shared/card-no-photo.png';
            this.activityItem.images.push({ 'urlFull': defaultImage });
        }
    }
    checkAvailability() {
        /*  */
    }
}
