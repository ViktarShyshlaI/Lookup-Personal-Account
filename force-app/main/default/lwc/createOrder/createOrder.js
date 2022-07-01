import { LightningElement, wire, track, api } from 'lwc';
import paymentType from '@salesforce/apex/OrderController.getPaymentTypeValues';
import paymentPeriod from '@salesforce/apex/OrderController.getPaymentPeriodValues';
import insertNewOrder from "@salesforce/apex/OrderController.insertNewOrder";

export default class CreateOrder extends LightningElement {
    
    paymentTypes = [];
    paymentPeriods = [];
    
    name;
    totalPrice;
    currentPaymentType;
    currentPaymentPeriod;
    foundAccountId;

    disablePicklist = true;

    get handleDisablePicklist() {
        return this.disablePicklist;
    }

    get typeOptions() {
        return this.paymentTypes;
    }

    @wire (paymentType)  
    wiredPaymentTypes ({ error, data }) {
        if (data) {
            let options = [];
            for (let i = 0; i < data.length; i++ ) {
                options.push({ label: data[i], value: data[i]  });
            }
            this.paymentTypes = options;
        }
        else {
            console.log(error);
        }
    }
    
    @wire (paymentPeriod)
    wiredPaymentPeriods ({error, data}) {
        if (data) {
            let options = [];
            for (let i = 0; i < data.length; i++ ) {
                options.push({ label: data[i], value: data[i]  });
            }
            this.paymentPeriods = options;
        }
        else {
            console.log(error);
        }
    }  

    validateFields() {
        let isValid = true;
        this.template.querySelectorAll('lightning-input').forEach(element => {
            if (!element.checkValidity()) {
                element.reportValidity();
                isValid = false;
            }
        });

        this.template.querySelector('c-lookup-account').checkIsValid();
        
        return isValid;
    }

    async handleSave() {
        if (!this.validateFields()) {
            return;
        }

        const newOrder = {
            name : this.name,
            totalPrice : Number(this.totalPrice),
            accountId  : this.foundAccountId,
            currentPaymentType : this.currentPaymentType,
            currentPaymentPeriod : this.currentPaymentPeriod
        }

        insertNewOrder({newOrder : newOrder})
        .then(result => {
            this.clearForm();
            this.template.querySelector('c-lookup-account').handleRemovePill();
        })
        .catch(error => {
            alert("Record wasn' created... ", error );
            console.error("error calling apex controller:",error);
        });
    }
    
    clearForm() {
        this.name = '';
        this.totalPrice = '';
        this.currentPaymentType = '';
        this.currentPaymentPeriod = '';
        this.foundAccountId = '';
    }

    handleSetNameChange(event) {
        this.name = event.detail.value;
    }
    
    handleSetTotalPriceChange(event) {
        this.totalPrice = event.detail.value;
    }

    handleSetPaymentType(event) {
        this.currentPaymentType = event.detail.value;
        if (this.currentPaymentType == 'Instalment') {
            this.disablePicklist = false;
        }
        else if (this.currentPaymentType == 'Cash') {
            this.disablePicklist = true;
            this.currentPaymentPeriod = '';
        }
    }

    handleSetPaymentPeriod(event) {
        this.currentPaymentPeriod = event.detail.value;
    }

    handleSetAccountField(event) {
        this.foundAccountId = event.detail;
    }  
}