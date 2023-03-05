import { LightningElement, wire,api,track } from 'lwc';
import getBoats from '@salesforce/apex/BoatDataService.getBoats' ; 
// wire to get boat info
export default class BoatTile extends LightningElement {
    // stores all info related to the boat even the image 
    // @wire(getBoats,{boatTypeId:'$selectedBoatId'})
    // track is for making the variable private but reactive 
    // 
    @api boat;
    @api selectedBoatId  ;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() { 
        // from the baot
        // pass it to a string 
        // make a call to the boat via the Id..?
        // add background-image:url() to it 
        url = 'background-image:url('+this.boat.Picture__c+')' ; 
        return  url ; 
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        const TILE_WRAPPER_SELECTED_CLASS  = 'tile-wrapper selected' ; 
        const TILE_WRAPPER_UNSELECTED_CLASS   = 'tile-wrapper' ; 
        if(this.selectedBoatId==this.boat.Id){
            return TILE_WRAPPER_SELECTED_CLASS ; 
        }
        else  {
            return TILE_WRAPPER_UNSELECTED_CLASS ; 
        }
     }
    // Fires event with the Id of the boat that has been selected.
    selectBoat() {
        // make an event that sends the current state and then dispatch it ..?
        // add them to the message context
        if(this.selectedBoatId==this.boat.Id){
            const boatId = this.boat.Id ; 
            const newEv = new CustomEvent('boatselect',{
              detail: boatId 
            })
            this.dispatchEvent(newEv) ; 
        }
     }
  }
  