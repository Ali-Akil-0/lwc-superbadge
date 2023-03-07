import { LightningElement,api,wire } from 'lwc';
import getAllReviews  from '@salesforce/apex/BoatDataService.getAllReviews' ; 
// import {ShowToastEvent} from 'lightning/platformShowToastEvent' ; 
import {refreshApex} from '@salesforce/apex' ; 
import {NavigationMixin} from 'lightning/navigation' ; 
export default class BoatReviews extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    // @wire(getAllReviews,{boatId:'$boatId'})
    boatReviews;
    isLoading;
    readOnly = true ; 
    
    // Getter and Setter to allow for logic to run on recordId change
    @api get recordId() { 
        return this.boatId  ; 
    }
    set recordId(value) {
      //sets boatId attribute
      //sets boatId assignment
      //get reviews associated with boatId
      this.boatId  = value ; 
        this.getReviews() ;
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() {
            if(this.boatReviews!=null && this.boatReviews!=undefined && this.boatReviews.length>=1){
                    return true ; 
            }
            else {
                return false  ; 
            }
     }
    
    // Public method to force a refresh of the reviews invoking getReviews
   @api refresh() { 
    // apex 
    this.refreshApex(this.getReviews);
   }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
     getReviews() {
        // the correct record Id ..?? 
        if(this.boatId==null || this.boatId=='') {return ; }
             this.isLoading = true  ; 
             getAllReviews({boatId: this.boatId}).then((results)=>{
                this.boatReviews = results  ; 
                this.isLoading = false ;  
                this.error = undefined ; 
              })
              .catch((error)=>{
                this.error = error ;  
                this.boatReviews = undefined ; 
                this.isLoading = false ; 
              })
              .finally(()=>{
                this.isLoading = false ;  
              });
    }
    
    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {  
      event.preventDefault() ; 
        const val = this.template.querySelector("a").getAttribute('data-record-id') ; 
        // const val2= event.target.dataset.recordId ; 
        this[NavigationMixin.navigate]({
            type:'standard__recordPage',
            attributes:{
                objectApiName:'User',
                recordId:event.target.dataset.recordId,
                actionName:'view'
            },   
        }) ; 
    }
  }
  