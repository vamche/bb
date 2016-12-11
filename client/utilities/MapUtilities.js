import Graphic from 'esri/Graphic';
import Point from 'esri/geometry/Point';
import Locator from 'esri/tasks/Locator';
import PopupTemplate from 'esri/PopupTemplate';
import SimpleMarkerSymbol from  'esri/symbols/SimpleMarkerSymbol';
import PictureMarkerSymbol from 'esri/symbols/PictureMarkerSymbol';
import store from 'app/store'
import { setInitialView, setInitialGraphicsLayer } from 'app/actions/donorActions'
import { getDonors, addDonor, deleteDonor, updateDonor } from 'app/api/donorsAPI'

import Map from "esri/Map"
import MapView from "esri/views/MapView"
import Zoom from 'esri/widgets/Zoom'
import Locate from 'esri/widgets/Locate'
import Search from 'esri/widgets/Search'
import watchUtils from 'esri/core/watchUtils'
import GraphicsLayer from 'esri/layers/GraphicsLayer'
import webMercatorUtils from 'esri/geometry/support/webMercatorUtils'
import * as appConstants from 'app/utilities/constants'
import * as stringConstants from 'app/utilities/stringConstants'
import * as popupActions from 'app/utilities/popupActions'

import ReactDOM from 'react-dom'


// Creates Grpahic(icon) for Donor
export function createGraphicForDonor (donor){
    let graphic = new Graphic();
    let symbolImageSource;
    const showContactInfo = {
      // This text is displayed as a tooltip
      title: "Show Contact Details",
      // The ID by which to reference the action in the event handler
      id: "showContactInfo",
      // Sets the icon font used to style the action button
      className: "esri-icon-zoom-out-magnifying-glass"
    };
    graphic.attributes = { "donorId" : donor.id,
                           "name" : donor.firstName + ' ' + donor.lastName,
                           "bloodGroup" : donor.bloodGroup,
                           "address" : donor.address,
                           "emailAddress" : donor.emailAddress,
                           "mobileNumber" : donor.mobileNumber
                            };
    graphic.geometry = new Point({
                          longitude: donor.longitude,
                          latitude: donor.latitude
                        });
    symbolImageSource = getBloodGroupIcon(donor);
    graphic.symbol = new PictureMarkerSymbol({
                          url: symbolImageSource,
                          width: "28px",
                          height: "33px"
                        });
    graphic.popupTemplate  = new PopupTemplate({
                                  "title" : "Blood Donor Details",
                                  "content" : getPopupTemplateForDonorInformation(donor),
                                 });
    return graphic;
}

// Sets the initial MapView. Attaches the events to watch. Sets the UI widgets to be displayed on Map.
export function setInitialMapView(mapRef, donorEditable){

  let lat = 0;
  let lon = 0;
  let address = '';
  let mapViewAndGraphicsLayer = {};

  const becomeDonorAction = popupActions.becomeDonorAction;
  const validateAndSubmitDonorAction = popupActions.validateAndSubmitDonorAction;
  const resetDonorAction = popupActions.resetDonorAction;

  const map2D = new Map({
      basemap: "streets"
  });
  const view = new MapView({
      container: ReactDOM.findDOMNode(mapRef),
      map: map2D,
      center: appConstants.DEFAULT_LOCATION,
      zoom: appConstants.DEFAULT_ZOOM_LEVEL,
      padding: {
        left: 120 // Same value as the #sidebar width in CSS
      },
      ui: {
            components: [] // for custom UI, empty the default UI components
          }
  });
  // UI components
  const searchWidget = new Search({
    view: view
  });
  const zoomWidget = new Zoom({
    view: view
  });
  const locateWidget = new Locate({
    view: view
  });
  //Graphics Layer
  const graphicsLayer = new GraphicsLayer({id : 'bloodDonorsLayer'});

  view.then(function() {
      navigateToCurrentLocation(view)
      map2D.add(graphicsLayer);
      let geographicExtent = webMercatorUtils.webMercatorToGeographic(view.extent);
      if(geographicExtent.xmin && geographicExtent.xmax && geographicExtent.ymax && geographicExtent.ymin){
        getDonors(geographicExtent);
      }
  });

  view.watch('extent', function(){
      let geographicExtent = webMercatorUtils.webMercatorToGeographic(view.extent);
      if(geographicExtent.xmin && geographicExtent.xmax && geographicExtent.ymax && geographicExtent.ymin){
        getDonors(geographicExtent);
      }
  })

  view.on('click', (evt) => {
    view.popup.actions = [];
    view.hitTest(evt.screenPoint).then(function(response){
      if(response && response.results[0] && response.results[0].graphic){
        return;
      }else{
        lat = evt.mapPoint.latitude;
        lon = evt.mapPoint.longitude;

        view.popup.location = evt.mapPoint;
        view.popup.title = "Location details!";
        view.popup.content = "...";
        view.popup.actions = [];
        view.popup.actions.push(becomeDonorAction);
        view.popup.visible = true;
        view.popup.dockEnabled = false;

        const locatorTask = new Locator({
           url: appConstants.LOCATOR_URL
        });

        locatorTask.locationToAddress(evt.mapPoint).then(function(response) {
            // If an address is successfully found, print it to the popup's content
            address = response.address.Match_addr;
            view.popup.content = address;
            address = address;
          }).otherwise(function(err) {
            // If the promise fails and no result is found, print a generic message
            // to the popup's content
            address = stringConstants.NO_ADDRESS_FOUND;
            view.popup.content = stringConstants.NO_ADDRESS_FOUND;
          });
      }
    });
  });

  searchWidget.on("select-result", function(evt){
    view.popup.actions = [];
    view.popup.actions.push(becomeDonorAction);
    address = evt.result.name;
    lat = evt.result.feature.geometry.latitude;
    lon = evt.result.feature.geometry.longitude;

  });

  locateWidget.on("locate", function(evt){
    view.popup.title = "Your current location";
    view.popup.content = "";
    view.popup.location = view.center;
    view.popup.actions = [];
    view.popup.actions.push(becomeDonorAction);
    view.popup.visible = true;
    view.popup.dockEnabled = false;

    lat = evt.position.coords.latitude;
    lon = evt.position.coords.longitude;
    address = stringConstants.NO_ADDRESS_FOUND;

  });

  view.popup.on("trigger-action", function(evt){
    // If the zoom-out action is clicked, fire the zoomOut() function
    if(evt.action.id === "becomeDonor"){
      const addDonorForm = getPopupTemplateForAddDonor();
      view.popup.title = stringConstants.DOCK_POPUP;
      view.popup.content = addDonorForm;
      view.popup.dockEnabled = true;
      view.popup.actions = [];
      view.popup.actions.push(resetDonorAction);
      view.popup.actions.push(validateAndSubmitDonorAction);
    }else if(evt.action.id === "addDonor"){
        addDonorAction(lat, lon, address, view);
    }else if(evt.action.id === "resetDonor"){
        resetDonor();
    }
  });

  view.watch("widthBreakpoint", function(newVal){
    if (newVal === "xsmall" || newVal === "small"){
      // clear the view's default UI components if
      // app is used on a mobile device
      view.ui.empty("bottom-left");
      view.ui.add(searchWidget, "bottom-right");
      view.padding = {
          left: 0 // Same value as the #sidebar width in CSS
      };
    }else{
      view.padding = {
          left: 120 // Same value as the #sidebar width in CSS
      };
      view.ui.empty("bottom-left");
      view.ui.add(zoomWidget, "bottom-left");
      view.ui.add(locateWidget, "bottom-left");
      view.ui.add(searchWidget, "bottom-left");
    }
  });

  view.ui.add(zoomWidget, "bottom-left");
  view.ui.add(locateWidget, "bottom-left");
  view.ui.add(searchWidget, "bottom-left");


  mapViewAndGraphicsLayer = { view : view,
                              graphicsLayer : graphicsLayer
                            };

  return mapViewAndGraphicsLayer;
}


// Navigates to the currentLocation
export function navigateToCurrentLocation(view){
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
                    // Success callback
                    function(position) {
                        let latitude = position.coords.latitude;
                        let longitude = position.coords.longitude;
                        let currentLocation = new Point({
                                               longitude: longitude,
                                               latitude: latitude
                                              });
                        view.goTo(currentLocation, appConstants.DEFAULT_ZOOM_LEVEL);
                    },
                    // Optional error callback
                    function(error){
                        alert(error.message);
                    }
                  );
				} else {
					alert(stringConstants.GEO_LOCATION_NOT_SUPPORTED);
				}
}


export function getPopupTemplateForDonorInformation(donor){
  return `<div>
            <ul id= "donorInformation" class="list-group">
              <li id="donorName" class="list-group-item donor-info">Name : <b><i>${donor.firstName} ${donor.lastName}</i></b></li>
              <li id="donorBloodGroup" class="list-group-item donor-info">Blood group : <b><i>${donor.bloodGroup}</i></b></li>
            </ul>
            <input type="button" id="ShowInfo" name="ShowInfo" onClick="document.getElementById('donorContactInformation').style.display='block';
              document.getElementById('ShowInfo').style.display='none'" class="btn btn-info" value="Show Contact Info"/>
            <ul id="donorContactInformation" style="display:none" >
              <b>Contact Information</b>
              <li id="donorEmail" class="list-group-item donor-info">Email : <b><i>${donor.emailAddress}</i></b></li>
              <li id="donorPhoneNumber" class="list-group-item donor-info">Contact Number : <b><i> ${donor.mobileNumber}</i></b></li>
            </ul>
        </div>`;
}

export function getPopupTemplateForAddDonor(donor){

  let firstName = donor && donor.firstName || '';
  let lastName = donor && donor.lastName || '';
  let bloodGroup = donor && donor.bloodGroup || 'A+';
  let mobileNumber = donor && donor.mobileNumber || '';
  let emailAddress = donor && donor.emailAddress || '';

  return `<form name = "formDonor" class="form-horizontal" onSubmit="ValidateAndSubmit()">
          	<fieldset>
          	<!-- Text input-->
          	<div class="form-group">
          	  <label class="col-md-4 control-label" for="firstName">First Name</label>
          	  <div class="col-md-4">
          	  <input id="firstName" name="firstName" type="text" placeholder="First Name" class="form-control input-md" value=${firstName} >
          	  <span id="wrongfname" class="error alert-danger"></span>
          	  </div>
          	</div>

          	<!-- Text input-->
          	<div class="form-group">
          	  <label class="col-md-4 control-label" for="lastName">Last Name</label>
          	  <div class="col-md-4">
          	  <input id="lastName" name="lastName" type="text" placeholder="Last Name" class="form-control input-md" value=${lastName} >
          	  <span id="wronglname" class="error alert-danger"></span>
          	  </div>
          	</div>

          	<!-- Select Blood Group -->

          	<div class="form-group">
          	  <label class="col-md-4 control-label" for="bloodGroup">Blood Group</label>
          	  <div class="col-md-4">
          		<select id="bloodGroup" name="bloodGroup" class="form-control">
                <option value="A+">A+</option>
          		  <option value="A-">A-</option>
          		  <option value="B+">B+</option>
          		  <option value="B-">B-</option>
          		  <option value="AB+">AB+</option>
          		  <option value="AB-">AB-</option>
          		  <option value="O+">O+</option>
          		  <option value="O-">O-</option>
          		</select>
          	  </div>
          	</div>
          	<!-- Text input-->
          	<div class="form-group">
          	  <label class="col-md-4 control-label" for="email">Email</label>
          	  <div class="col-md-5">
          	  <input id="email" name="email" type="text" placeholder="Email" class="form-control input-md" value=${emailAddress}>
          	  <span id="wrongemail" class="error alert-danger"></span>
          	  <span class="help-block">eg: abc@mail.com</span>
          	  </div>
          	</div>

          	<!-- Search input-->
          	<div class="form-group">
          	  <label class="col-md-4 control-label" for="mobileNumber">Mobile</label>
          	  <div class="col-md-5">
          		<input id="mobileNumber" name="mobileNumber" type="search" placeholder="Mobile Number" class="form-control input-md" value=${mobileNumber}>
          		<span id="wrongmobile" class="error alert-danger"></span>
          		<p class="help-block">for ex: 00XX XXX XXXX XXX or +XX XXX XXXX XXX </p>
          	  </div>
          	</div>


          	</fieldset>
          </form>`;

}


export function ValidateAndSubmitDonor(){
  //e.preventDefault();
  var firstName = document.formDonor.firstName.value;
  var lastName = document.formDonor.lastName.value;
  var email = document.formDonor.email.value;
  var mobileNumber = document.formDonor.mobileNumber.value;
  var bloodGroup = document.formDonor.bloodGroup.value;
  var hasError = false;
  if (firstName.trim()=="")
  {
    document.getElementById('wrongfname').style.display = "inline";
    document.getElementById('wrongfname').innerHTML = stringConstants.FIRST_NAME_EMPTY;
    hasError = true;
  }
  else if (firstName.length > appConstants.FIRST_NAME_MAX_LENGTH)
  {
    document.getElementById('wrongfname').style.display = "inline";
    document.getElementById('wrongfname').innerHTML = stringConstants.FIRST_NAME_MAX_LENGTH;
    hasError = true;
  }
  else if (/[^a-zA-Z0-9\-]/.test( firstName ))
  {
    document.getElementById('email').style.display = "inline";
    document.getElementById('wrongfname').innerHTML = stringConstants.FIRST_NAME_ALPHA_NUMERIC;
    hasError = true;
  }else{
     document.getElementById('wrongfname').style.display = "none";
  }

  if (lastName.trim()=="")
  {
    document.getElementById('wronglname').style.display = "inline";
    document.getElementById('wronglname').innerHTML = stringConstants.LAST_NAME_EMPTY;
    hasError = true;
  }else if (lastName.length > appConstants.LAST_NAME_MAX_LENGTH)
  {
    document.getElementById('wronglname').style.display = "inline";
    document.getElementById('wronglname').innerHTML = stringConstants.LAST_NAME_MAX_LENGTH;
    hasError = true;
  }else if (/[^a-zA-Z0-9\-]/.test( lastName ))
  {
    document.getElementById('wronglname').style.display = "inline";
    document.getElementById('wronglname').innerHTML = stringConstants.LAST_NAME_ALPHA_NUMERIC;
    hasError = true;
  }else{
     document.getElementById('wronglname').style.display = "none";
  }

  if (email.trim()=="")
  {
    document.getElementById('wrongemail').style.display = "inline";
    document.getElementById('wrongemail').innerHTML = stringConstants.EMAIL_ADDRESS_EMPTY;
    hasError = true;
  }else if (email.search(/^[a-zA-Z]+([_\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4})+$/) == -1) {
    document.getElementById('wrongemail').style.display = "inline";
    document.getElementById('wrongemail').innerHTML = stringConstants.EMAIL_ADDRESS_INVALID;
    hasError = true;
  }else{
     document.getElementById('wrongemail').style.display = "none";
  }

  if (mobileNumber.trim()=="")
  {
    document.getElementById('wrongmobile').style.display = "inline";
    document.getElementById('wrongmobile').innerHTML = stringConstants.CONTACT_NUMBER_EMPTY;
    hasError = true;

  }else if (mobileNumber.search(/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/) == -1) {
    document.getElementById('wrongmobile').style.display = "inline";
    document.getElementById('wrongmobile').innerHTML = stringConstants.CONTACT_NUMBER_INVALID;
    hasError = true;
  }else{
     document.getElementById('wrongmobile').style.display = "none";
  }
  return !hasError;
}

export function resetDonor(){
  document.formDonor.firstName.value = "";
  document.formDonor.lastName.value= "";
  document.formDonor.email.value = "";
  document.formDonor.mobileNumber.value= "";
  document.formDonor.bloodGroup.value= "A+";
  document.getElementById('wrongfname').style.display = "none";
  document.getElementById('wronglname').style.display = "none";
  document.getElementById('wrongemail').style.display = "none";
  document.getElementById('wrongmobile').style.display = "none";
}

export function addDonorAction(lat,lon,address,view){

  if(ValidateAndSubmitDonor()){
    var firstName = document.formDonor.firstName.value;
    var lastName = document.formDonor.lastName.value;
    var email = document.formDonor.email.value;
    var mobileNumber = document.formDonor.mobileNumber.value;
    var bloodGroup = document.formDonor.bloodGroup.value;
    let donor = {
                    firstName: firstName,
                    lastName: lastName,
                    emailAddress: email,
                    mobileNumber: mobileNumber,
                    latitude: lat,
                    longitude: lon,
                    // default/dummy ip address is sent, client's ip is recorded on server side
                    ipAddress: '192.168.1.1',
                    address: address,
                    bloodGroup: bloodGroup
                  };
    addDonor(donor,successCallBack);
    function successCallBack(responseDonor){
        view.popup.title = stringConstants.ADD_DONOR_SUCCESS
        view.popup.content = `
                              <ul id= "donorInformation" class="list-group">
                                <li class="list-group-item donor-info">Name : <b><i>${responseDonor.firstName} ${responseDonor.lastName}</i></b></li>
                                <li class="list-group-item donor-info">Blood group : <b><i>${responseDonor.bloodGroup}</i></b></li>
                                <li class="list-group-item donor-info">Email : <b><i>${responseDonor.emailAddress}</i></b></li>
                                <li class="list-group-item donor-info">Contact Number : <b><i> ${responseDonor.mobileNumber}</i></b></li>
                                <li class="list-group-item donor-info">Address : <b><i> ${responseDonor.address}</i></b></li>
                              </ul>
                              ${stringConstants.EDIT_DONOR_URL}
                              <a href=${window.location.protocol}//${window.location.host}/${responseDonor._id}>
                                ${window.location.protocol}//${window.location.host}/${responseDonor._id} </a>`;
        view.popup.actions = [];
    }
  }
}

export function editDonorAction(donorEditable,view){
  if(ValidateAndSubmitDonor()){
      let donor = donorEditable;
      donor.firstName = document.formDonor.firstName.value;
      donor.lastName = document.formDonor.lastName.value;
      donor.emailAddress = document.formDonor.email.value;
      donor.mobileNumber = document.formDonor.mobileNumber.value;
      donor.bloodGroup = document.formDonor.bloodGroup.value;
      updateDonor(donor,successCallBack);
      function successCallBack(responseDonor){
          view.popup.title = stringConstants.EDIT_DONOR_SUCCESS;
          view.popup.content = `<ul id= "donorInformation" class="list-group">
                                  <li class="list-group-item donor-info">Name : <b><i>${responseDonor.firstName} ${responseDonor.lastName}</i></b></li>
                                  <li class="list-group-item donor-info">Blood group : <b><i>${responseDonor.bloodGroup}</i></b></li>
                                  <li class="list-group-item donor-info">Email : <b><i>${responseDonor.emailAddress}</i></b></li>
                                  <li class="list-group-item donor-info">Contact Number : <b><i> ${responseDonor.mobileNumber}</i></b></li>
                                  <li class="list-group-item donor-info">Address : <b><i> ${responseDonor.address}</i></b></li>
                                </ul>
                                ${stringConstants.EDIT_DONOR_URL}
                                <a href=${window.location.protocol}//${window.location.host}/${responseDonor._id}>
                                  ${window.location.protocol}//${window.location.host}/${responseDonor._id} </a>`;
          view.popup.actions = [];
      }
  }
}

export function deleteDonorAction(donorId,view){
      deleteDonor(donorId, successCallBack);
      function successCallBack(responseDonor){
          view.popup.title = stringConstants.DELETE_DONOR_SUCCESS;
          view.popup.content = "";
          view.popup.actions = [];
      }
}

function getBloodGroupIcon(donor){
  let symbolImageSource = "";
  switch(donor.bloodGroup) {
    case 'A+':
      symbolImageSource = "public/images/aplus.png";
      break;
    case 'B+':
      symbolImageSource = "public/images/bplus.png";
      break;
    case 'AB+':
      symbolImageSource = "public/images/abplus.png";
      break;
    case 'O+':
      symbolImageSource = "public/images/oplus.png";
      break;
    case 'A-':
      symbolImageSource = "public/images/aminus.png";
      break;
    case 'B-':
      symbolImageSource = "public/images/bminus.png";
      break;
    case 'AB-':
      symbolImageSource = "public/images/abminus.png";
      break;
    case 'O-':
      symbolImageSource = "public/images/ominus.png";
      break;
  }
  return symbolImageSource;
}
