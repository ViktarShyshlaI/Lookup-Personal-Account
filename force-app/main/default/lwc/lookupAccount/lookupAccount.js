import { api, LightningElement, track, wire } from 'lwc';
import lookUp from '@salesforce/apex/LookupAccount.search';

export default class LookupAccount extends LightningElement {

    @api objName;
    @api iconName;
    @api searchPlaceholder='Search';
    @track selectedName;
    @track records;
    @track isValueSelected;
    @track blurTimeout;
    searchTerm;
    //css
    @track boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    @track inputClass = '';

    @wire(lookUp, {searchTerm : '$searchTerm', myObject : '$objName'})
    wiredRecords({ error, data }) {
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            this.error = error;
            this.records = undefined;
        }
    }
    handleClick() {
        this.inputClass = 'slds-has-focus';
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open';
    }

    onBlur() {
        this.blurTimeout = setTimeout(() =>  {this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus'}, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;
        const valueSelectedEvent = new CustomEvent('lookupselected', {detail:  selectedId });
        this.dispatchEvent(valueSelectedEvent);
        this.isValueSelected = true;
        this.selectedName = selectedName;
        if(this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus';
    }

    @api handleRemovePill() {
        this.isValueSelected = false;
        this.searchTerm = '';
    }
    
    onChange(event) {
        this.searchTerm = event.target.value;
    }

    @api checkIsValid() {
        let isValid = true;
        this.template.querySelectorAll('lightning-input').forEach(element => {
            if (!element.checkValidity()) {
                element.reportValidity();
                isValid = false;
                console.log('checkIsValid method');
            }
        });
    }

}