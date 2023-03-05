import { LightningElement,wire,api,track } from 'lwc';
import { publish,subscribe,MessageContext } from 'lightning/messageService';
import getBoats from '@salesforce/apex/BoatDataService.getBoats' ; 
import {ShowToastEvent} from 'lightning/platformShowToastEvent' ; 
import {refreshApex} from '@salesforce/apex' ; 
import BoatMC from '@salesforce/messageChannel/BoatMessageChannel__c' ; 
import updateBoatList from '@salesforce/apex/BoatDataService.updateBoatList' ; 
const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT     = 'Ship it!';
const SUCCESS_VARIANT     = 'success';
const ERROR_TITLE   = 'Error';
const ERROR_VARIANT = 'error';
export default class BoatSearchResults extends LightningElement {
  selectedBoatId;
  columns = [
    {
        label: 'Name',
        fieldName: 'Name',
        editable: true
    },
    {
        label: 'Length',
        fieldName: 'Length__c',
        type: 'number',
        editable: true
    },
    {
        label: 'Price',
        fieldName: 'Price__c',
        type: 'currency',
        typeAttributes: { currencyCode: { fieldName: 'CurrencyIsoCode' }, currencyDisplayAs: "code" },
        editable: true
    },
    {
        label: 'Description',
        fieldName: 'Description__c',
        editable: true
    }
  ];
  boatTypeId = '';
  boats;
  isLoading = false;
  
  @wire(MessageContext)
  messageContext;

  // wired getBoats method 
  @wire(getBoats,{boatTypeId:'$boatTypeId'})
  wiredBoats(result) { 
    if(result.data){
        this.boats =  result ; 
    }
    if(result.error){
        this.dispatchEvent(new ShowToastEvent({
            title: ERROR_TITLE,
            message: result.error,
            variant: ERROR_VARIANT
        }));
    }
  }
  
  // public function that updates the existing boatTypeId property
  // uses notifyLoading
  @api searchBoats(boatTypeId) { 
        this.boatTypeId = boatTypeId ; 
        this.notifyLoading(this.isLoading) ;   
  }
  
  // this public function must refresh the boats asynchronously
  // uses notifyLoading
  @api async refresh() {
    // add async notation 
        refreshApex(this.boats) ; 
        this.notifyLoading(this.isLoading) ; 
   }
  
  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) { 
    // correct event 
    // const info = event.detail ; 
    this.selectedBoatId = event.detail.boatId ; 
    // call sendMessageService
    this.sendMessageService(event.detail.boatId) ; 
    
  }
  
  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) { 
    // explicitly pass boatId to the parameter recordId
    // publish
    this.dispatchEvent( new publish(this.messageContext,BoatMC,{
        recordId:boatId
    }))
  }
  
  // The handleSave method must save the changes in the Boat Editor
  // passing the updated fields from draftValues to the 
  // Apex method updateBoatList(Object data).
  // Show a toast message with the title
  // clear lightning-datatable draft values
  handleSave(event) {
    // notify loading
    const updatedFields = event.detail.draftValues;
    // Update the records via Apex
    updateBoatList({data: updatedFields})
    .then((res) => {
        this.dispatchEvent(new ShowToastEvent({
            title : SUCCESS_TITLE,
            message : MESSAGE_SHIP_IT,
            variant : SUCCESS_VARIANT,
         } ))
         this.refreshApex(this.wiredBoats) ; 
    })
    .catch(error => {
        this.dispatchEvent(new ShowToastEvent({
            title: ERROR_TITLE,
            message: error,
            variant: ERROR_VARIANT
        }));
    })
    .finally(() => {
        // clearing it 
        this.template.querySelector('.lightning-datatable').draftValues = [] ; 
    });
  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    if(isLoading==true){
        this.dispatchEvent(new CustomEvent('loading')) ; 
    }
    else {
        this.dispatchEvent(new CustomEvent('doneloading')) ; 
    }
   }
}
