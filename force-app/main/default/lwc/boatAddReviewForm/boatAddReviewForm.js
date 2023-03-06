import { LightningElement,api } from 'lwc';
import  {ShowToastEvent} from 'lightning/platformShowToastEvent' ; 
const SUCCESS_TITLE  = 'Review Created!' ;
const SUCCESS_VARIANT = 'success' ;

import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c'  ; 
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name'  ; 
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c'  ; 
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c'  ; 
import BOATFIELD from '@salesforce/schema/BoatReview__c.Boat__c'  ; 


export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField  = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    ratingfield = RATING_FIELD ;
    boatfield = BOATFIELD ; 
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    successTitle = SUCCESS_TITLE ; 
    successVariant = SUCCESS_VARIANT  ;
    
    // Public Getter and Setter to allow for logic to run on recordId change
     @api get recordId() { 
        return this.boatId ; 
     }
    set recordId(value) {
      //sets boatId attribute
      //sets boatId assignment
      this.boatId = value ; 
    }
    
    // Gets user rating input from stars component
    handleRatingChanged(event) {
        // handle event 
        this.rating  = event.detail.rating ; 
     }
    
    // Custom submission handler to properly set Rating
    // This function must prevent the anchor element from navigating to a URL.
    // form to be submitted: lightning-record-edit-form
    handleSubmit(event) {
        // submi
        event.preventDefault()  ; 
        // nothing individual ; 
        // select each individual field to be submitted 
        // const name = event.detail.fields.nameField ; 
        // const comment = event.detail.fields.commentField ; 
        // adding other fields ... 
        let fields = event.detail.fields ;
        const ratingfield  =this.ratingfield ; 
        const boatfield  =this.boatfield ; 
        fields.Rating__c  = this.rating ; 
        fields.Boat__c =  this.boatId ; 
        this.template.querySelector('.lightning-record-edit-form').submit(fields) ; 
        // let accountRecords  = {} ; 
        // accountRecords ['Name'] = name ; 
        // accountRecords ['Comment__c'] = comment ; 
        // accountRecords ['Rating__c'] = this.rating ; 
        // accountRecords ['Boat__c'] = this.boatId ; 
        // const fields =  accountRecords  ; 
        // const recordInput = {apiName:boatReviewObject.objectApiName,fields} 
    //     createRecord(recordInput)
    //     .then(()=>{
    //         this.dispatchEvent(new ShowToastEvent({
    //             title:'submitted',
    //             message:'submitted successfully',
    //             variant : 'success'
    //         }))
    //     })
    //     .catch((error)=>{
    //         this.dispatchEvent(new ShowToastEvent({
    //             title:'error',
    //             message: error.body.message,
    //             variant : 'error'
    //         }))
    //     })
    //     // this.template.querySelector('.lightning-record-edit-form').submit(fields)  ; 
    //  }
    }
    
    // Shows a toast message once form is submitted successfully
    // Dispatches event when a review is created
    handleSuccess() {
    const customevent = new CustomEvent("createreview") ; 
    const toast =  new ShowToastEvent({
        title:SUCCESS_TITLE,
        variant: SUCCESS_VARIANT 
    })   ; 
    this.dispatchEvent(toast) ; 
    this.dispatchEvent(customevent) ; 
    this.handleReset() ; 
    }
    
    handleReset() {
        const fieldsActions = this.template.querySelector('.lightning-input-field');
        if(fieldsActions){
            fieldsActions.foreach((field)=>{
                field.reset() ; 
            })

        }
     }
  }
  