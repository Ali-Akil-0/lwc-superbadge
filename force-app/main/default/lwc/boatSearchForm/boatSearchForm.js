// imports
// import getBoatTypes from the BoatDataService => getBoatTypes method';
import { LightningElement, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes' ; 
export default class BoatSearchForm extends LightningElement {
    selectedBoatTypeId = '';
    
    // Private
    error = undefined;
    
    searchOptions;
    
    @wire(getBoatTypes)
      boatTypes({ error, data }) {
      if (data) {
        this.searchOptions = data.map(type => {
            // still some logic
        });
        this.searchOptions.unshift(
            { label: 'All Types', value: '' },
            { label:type.Name, value: type.Id },
        );
      } else if (error) {
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    
    // Fires event that the search option has changed.
    // passes boatTypeId (value of this.selectedBoatTypeId) in the detail
    handleSearchOptionChange(event) {
      // Create the const searchEvent
      this.selectedBoatTypeId  = event.detail.value ; 
       const searchEvent = new CustomEvent('search',{
        detail: {boatTypeId : this.selectedBoatTypeId}  
       }) 
      this.dispatchEvent(searchEvent);
    }
  }
  