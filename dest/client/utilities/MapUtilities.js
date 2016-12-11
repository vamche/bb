define(['exports', 'esri/Graphic', 'esri/geometry/Point', 'esri/tasks/Locator', 'esri/PopupTemplate', 'esri/symbols/SimpleMarkerSymbol', 'esri/symbols/PictureMarkerSymbol', 'app/store', 'app/actions/donorActions', 'app/api/donorsAPI', 'esri/Map', 'esri/views/MapView', 'esri/widgets/Zoom', 'esri/widgets/Locate', 'esri/widgets/Search', 'esri/core/watchUtils', 'esri/layers/GraphicsLayer', 'esri/geometry/support/webMercatorUtils', 'app/utilities/constants', 'app/utilities/stringConstants', 'app/utilities/popupActions', 'react-dom'], function (exports, _Graphic, _Point, _Locator, _PopupTemplate, _SimpleMarkerSymbol, _PictureMarkerSymbol, _store, _donorActions, _donorsAPI, _Map, _MapView, _Zoom, _Locate, _Search, _watchUtils, _GraphicsLayer, _webMercatorUtils, _constants, _stringConstants, _popupActions, _reactDom) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.createGraphicForDonor = createGraphicForDonor;
  exports.setInitialMapView = setInitialMapView;
  exports.navigateToCurrentLocation = navigateToCurrentLocation;
  exports.getPopupTemplateForDonorInformation = getPopupTemplateForDonorInformation;
  exports.getPopupTemplateForAddDonor = getPopupTemplateForAddDonor;
  exports.ValidateAndSubmitDonor = ValidateAndSubmitDonor;
  exports.resetDonor = resetDonor;
  exports.addDonorAction = addDonorAction;
  exports.editDonorAction = editDonorAction;
  exports.deleteDonorAction = deleteDonorAction;

  var _Graphic2 = _interopRequireDefault(_Graphic);

  var _Point2 = _interopRequireDefault(_Point);

  var _Locator2 = _interopRequireDefault(_Locator);

  var _PopupTemplate2 = _interopRequireDefault(_PopupTemplate);

  var _SimpleMarkerSymbol2 = _interopRequireDefault(_SimpleMarkerSymbol);

  var _PictureMarkerSymbol2 = _interopRequireDefault(_PictureMarkerSymbol);

  var _store2 = _interopRequireDefault(_store);

  var _Map2 = _interopRequireDefault(_Map);

  var _MapView2 = _interopRequireDefault(_MapView);

  var _Zoom2 = _interopRequireDefault(_Zoom);

  var _Locate2 = _interopRequireDefault(_Locate);

  var _Search2 = _interopRequireDefault(_Search);

  var _watchUtils2 = _interopRequireDefault(_watchUtils);

  var _GraphicsLayer2 = _interopRequireDefault(_GraphicsLayer);

  var _webMercatorUtils2 = _interopRequireDefault(_webMercatorUtils);

  var appConstants = _interopRequireWildcard(_constants);

  var stringConstants = _interopRequireWildcard(_stringConstants);

  var popupActions = _interopRequireWildcard(_popupActions);

  var _reactDom2 = _interopRequireDefault(_reactDom);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  // Creates Grpahic(icon) for Donor
  function createGraphicForDonor(donor) {
    var graphic = new _Graphic2.default();
    var symbolImageSource = void 0;
    var showContactInfo = {
      // This text is displayed as a tooltip
      title: "Show Contact Details",
      // The ID by which to reference the action in the event handler
      id: "showContactInfo",
      // Sets the icon font used to style the action button
      className: "esri-icon-zoom-out-magnifying-glass"
    };
    graphic.attributes = { "donorId": donor.id,
      "name": donor.firstName + ' ' + donor.lastName,
      "bloodGroup": donor.bloodGroup,
      "address": donor.address,
      "emailAddress": donor.emailAddress,
      "mobileNumber": donor.mobileNumber
    };
    graphic.geometry = new _Point2.default({
      longitude: donor.longitude,
      latitude: donor.latitude
    });
    symbolImageSource = getBloodGroupIcon(donor);
    graphic.symbol = new _PictureMarkerSymbol2.default({
      url: symbolImageSource,
      width: "28px",
      height: "33px"
    });
    graphic.popupTemplate = new _PopupTemplate2.default({
      "title": "Blood Donor Details",
      "content": getPopupTemplateForDonorInformation(donor)
    });
    return graphic;
  }

  // Sets the initial MapView. Attaches the events to watch. Sets the UI widgets to be displayed on Map.
  function setInitialMapView(mapRef, donorEditable) {

    var lat = 0;
    var lon = 0;
    var address = '';
    var mapViewAndGraphicsLayer = {};

    var becomeDonorAction = popupActions.becomeDonorAction;
    var validateAndSubmitDonorAction = popupActions.validateAndSubmitDonorAction;
    var resetDonorAction = popupActions.resetDonorAction;

    var map2D = new _Map2.default({
      basemap: "streets"
    });
    var view = new _MapView2.default({
      container: _reactDom2.default.findDOMNode(mapRef),
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
    var searchWidget = new _Search2.default({
      view: view
    });
    var zoomWidget = new _Zoom2.default({
      view: view
    });
    var locateWidget = new _Locate2.default({
      view: view
    });
    //Graphics Layer
    var graphicsLayer = new _GraphicsLayer2.default({ id: 'bloodDonorsLayer' });

    view.then(function () {
      navigateToCurrentLocation(view);
      map2D.add(graphicsLayer);
      var geographicExtent = _webMercatorUtils2.default.webMercatorToGeographic(view.extent);
      if (geographicExtent.xmin && geographicExtent.xmax && geographicExtent.ymax && geographicExtent.ymin) {
        (0, _donorsAPI.getDonors)(geographicExtent);
      }
    });

    view.watch('extent', function () {
      var geographicExtent = _webMercatorUtils2.default.webMercatorToGeographic(view.extent);
      if (geographicExtent.xmin && geographicExtent.xmax && geographicExtent.ymax && geographicExtent.ymin) {
        (0, _donorsAPI.getDonors)(geographicExtent);
      }
    });

    view.on('click', function (evt) {
      view.popup.actions = [];
      view.hitTest(evt.screenPoint).then(function (response) {
        if (response && response.results[0] && response.results[0].graphic) {
          return;
        } else {
          console.log("No graphic found! Show Popup!");
          lat = evt.mapPoint.latitude;
          lon = evt.mapPoint.longitude;

          view.popup.location = evt.mapPoint;
          view.popup.title = "Location details!";
          view.popup.content = "...";
          view.popup.actions = [];
          view.popup.actions.push(becomeDonorAction);
          view.popup.visible = true;
          view.popup.dockEnabled = false;

          var locatorTask = new _Locator2.default({
            url: appConstants.LOCATOR_URL
          });

          locatorTask.locationToAddress(evt.mapPoint).then(function (response) {
            // If an address is successfully found, print it to the popup's content
            address = response.address.Match_addr;
            console.log(address);
            view.popup.content = address;
            address = address;
          }).otherwise(function (err) {
            // If the promise fails and no result is found, print a generic message
            // to the popup's content
            address = stringConstants.NO_ADDRESS_FOUND;
            view.popup.content = stringConstants.NO_ADDRESS_FOUND;
          });
        }
      });
    });

    searchWidget.on("select-result", function (evt) {
      view.popup.actions = [];
      view.popup.actions.push(becomeDonorAction);
      address = evt.result.name;
      lat = evt.result.feature.geometry.latitude;
      lon = evt.result.feature.geometry.longitude;
    });

    locateWidget.on("locate", function (evt) {
      console.log(evt);
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

    view.popup.on("trigger-action", function (evt) {
      // If the zoom-out action is clicked, fire the zoomOut() function
      if (evt.action.id === "becomeDonor") {
        var addDonorForm = getPopupTemplateForAddDonor();
        view.popup.title = stringConstants.DOCK_POPUP;
        view.popup.content = addDonorForm;
        view.popup.dockEnabled = true;
        view.popup.actions = [];
        view.popup.actions.push(resetDonorAction);
        view.popup.actions.push(validateAndSubmitDonorAction);
      } else if (evt.action.id === "addDonor") {
        addDonorAction(lat, lon, address, view);
      } else if (evt.action.id === "resetDonor") {
        resetDonor();
      }
    });

    view.watch("widthBreakpoint", function (newVal) {
      if (newVal === "xsmall" || newVal === "small") {
        // clear the view's default UI components if
        // app is used on a mobile device
        view.ui.empty("bottom-left");
        view.ui.add(searchWidget, "bottom-right");
        view.padding = {
          left: 0 // Same value as the #sidebar width in CSS
        };
      } else {
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

    mapViewAndGraphicsLayer = { view: view,
      graphicsLayer: graphicsLayer
    };

    return mapViewAndGraphicsLayer;
  }

  // Navigates to the currentLocation
  function navigateToCurrentLocation(view) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
      // Success callback
      function (position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var currentLocation = new _Point2.default({
          longitude: longitude,
          latitude: latitude
        });
        view.goTo(currentLocation, appConstants.DEFAULT_ZOOM_LEVEL);
      },
      // Optional error callback
      function (error) {
        alert(error.message);
      });
    } else {
      alert(stringConstants.GEO_LOCATION_NOT_SUPPORTED);
    }
  }

  function getPopupTemplateForDonorInformation(donor) {
    return '<div>\n            <ul id= "donorInformation" class="list-group">\n              <li id="donorName" class="list-group-item donor-info">Name : <b><i>' + donor.firstName + ' ' + donor.lastName + '</i></b></li>\n              <li id="donorBloodGroup" class="list-group-item donor-info">Blood group : <b><i>' + donor.bloodGroup + '</i></b></li>\n            </ul>\n            <input type="button" id="ShowInfo" name="ShowInfo" onClick="document.getElementById(\'donorContactInformation\').style.display=\'block\';\n              document.getElementById(\'ShowInfo\').style.display=\'none\'" class="btn btn-info" value="Show Contact Info"/>\n            <ul id="donorContactInformation" style="display:none" >\n              <b>Contact Information</b>\n              <li id="donorEmail" class="list-group-item donor-info">Email : <b><i>' + donor.emailAddress + '</i></b></li>\n              <li id="donorPhoneNumber" class="list-group-item donor-info">Contact Number : <b><i> ' + donor.mobileNumber + '</i></b></li>\n            </ul>\n        </div>';
  }

  function getPopupTemplateForAddDonor(donor) {

    var firstName = donor && donor.firstName || '';
    var lastName = donor && donor.lastName || '';
    var bloodGroup = donor && donor.bloodGroup || 'A+';
    var mobileNumber = donor && donor.mobileNumber || '';
    var emailAddress = donor && donor.emailAddress || '';

    return '<form name = "formDonor" class="form-horizontal" onSubmit="ValidateAndSubmit()">\n          \t<fieldset>\n          \t<!-- Text input-->\n          \t<div class="form-group">\n          \t  <label class="col-md-4 control-label" for="firstName">First Name</label>\n          \t  <div class="col-md-4">\n          \t  <input id="firstName" name="firstName" type="text" placeholder="First Name" class="form-control input-md" value=' + firstName + ' >\n          \t  <span id="wrongfname" class="error alert-danger"></span>\n          \t  </div>\n          \t</div>\n\n          \t<!-- Text input-->\n          \t<div class="form-group">\n          \t  <label class="col-md-4 control-label" for="lastName">Last Name</label>\n          \t  <div class="col-md-4">\n          \t  <input id="lastName" name="lastName" type="text" placeholder="Last Name" class="form-control input-md" value=' + lastName + ' >\n          \t  <span id="wronglname" class="error alert-danger"></span>\n          \t  </div>\n          \t</div>\n\n          \t<!-- Select Blood Group -->\n\n          \t<div class="form-group">\n          \t  <label class="col-md-4 control-label" for="bloodGroup">Blood Group</label>\n          \t  <div class="col-md-4">\n          \t\t<select id="bloodGroup" name="bloodGroup" class="form-control">\n                <option value="A+">A+</option>\n          \t\t  <option value="A-">A-</option>\n          \t\t  <option value="B+">B+</option>\n          \t\t  <option value="B-">B-</option>\n          \t\t  <option value="AB+">AB+</option>\n          \t\t  <option value="AB-">AB-</option>\n          \t\t  <option value="O+">O+</option>\n          \t\t  <option value="O-">O-</option>\n          \t\t</select>\n          \t  </div>\n          \t</div>\n          \t<!-- Text input-->\n          \t<div class="form-group">\n          \t  <label class="col-md-4 control-label" for="email">Email</label>\n          \t  <div class="col-md-5">\n          \t  <input id="email" name="email" type="text" placeholder="Email" class="form-control input-md" value=' + emailAddress + '>\n          \t  <span id="wrongemail" class="error alert-danger"></span>\n          \t  <span class="help-block">eg: abc@mail.com</span>\n          \t  </div>\n          \t</div>\n\n          \t<!-- Search input-->\n          \t<div class="form-group">\n          \t  <label class="col-md-4 control-label" for="mobileNumber">Mobile</label>\n          \t  <div class="col-md-5">\n          \t\t<input id="mobileNumber" name="mobileNumber" type="search" placeholder="Mobile Number" class="form-control input-md" value=' + mobileNumber + '>\n          \t\t<span id="wrongmobile" class="error alert-danger"></span>\n          \t\t<p class="help-block">for ex: 00XX XXX XXXX XXX or +XX XXX XXXX XXX </p>\n          \t  </div>\n          \t</div>\n\n\n          \t</fieldset>\n          </form>';
  }

  function ValidateAndSubmitDonor() {
    //e.preventDefault();
    var firstName = document.formDonor.firstName.value;
    var lastName = document.formDonor.lastName.value;
    var email = document.formDonor.email.value;
    var mobileNumber = document.formDonor.mobileNumber.value;
    var bloodGroup = document.formDonor.bloodGroup.value;
    var hasError = false;
    if (firstName.trim() == "") {
      document.getElementById('wrongfname').style.display = "inline";
      document.getElementById('wrongfname').innerHTML = stringConstants.FIRST_NAME_EMPTY;
      hasError = true;
    } else if (firstName.length > appConstants.FIRST_NAME_MAX_LENGTH) {
      document.getElementById('wrongfname').style.display = "inline";
      document.getElementById('wrongfname').innerHTML = stringConstants.FIRST_NAME_MAX_LENGTH;
      hasError = true;
    } else if (/[^a-zA-Z0-9\-]/.test(firstName)) {
      document.getElementById('email').style.display = "inline";
      document.getElementById('wrongfname').innerHTML = stringConstants.FIRST_NAME_ALPHA_NUMERIC;
      hasError = true;
    } else {
      document.getElementById('wrongfname').style.display = "none";
    }

    if (lastName.trim() == "") {
      document.getElementById('wronglname').style.display = "inline";
      document.getElementById('wronglname').innerHTML = stringConstants.LAST_NAME_EMPTY;
      hasError = true;
    } else if (lastName.length > appConstants.LAST_NAME_MAX_LENGTH) {
      document.getElementById('wronglname').style.display = "inline";
      document.getElementById('wronglname').innerHTML = stringConstants.LAST_NAME_MAX_LENGTH;
      hasError = true;
    } else if (/[^a-zA-Z0-9\-]/.test(lastName)) {
      document.getElementById('wronglname').style.display = "inline";
      document.getElementById('wronglname').innerHTML = stringConstants.LAST_NAME_ALPHA_NUMERIC;
      hasError = true;
    } else {
      document.getElementById('wronglname').style.display = "none";
    }

    if (email.trim() == "") {
      document.getElementById('wrongemail').style.display = "inline";
      document.getElementById('wrongemail').innerHTML = stringConstants.EMAIL_ADDRESS_EMPTY;
      hasError = true;
    } else if (email.search(/^[a-zA-Z]+([_\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([\.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4})+$/) == -1) {
      document.getElementById('wrongemail').style.display = "inline";
      document.getElementById('wrongemail').innerHTML = stringConstants.EMAIL_ADDRESS_INVALID;
      hasError = true;
    } else {
      document.getElementById('wrongemail').style.display = "none";
    }

    if (mobileNumber.trim() == "") {
      document.getElementById('wrongmobile').style.display = "inline";
      document.getElementById('wrongmobile').innerHTML = stringConstants.CONTACT_NUMBER_EMPTY;
      hasError = true;
    } else if (mobileNumber.search(/^(00|\+)([0-9]{2})[ ]?([0-9]{3})[ ]?([0-9]{4})[ ]?([0-9]{3})$/) == -1) {
      document.getElementById('wrongmobile').style.display = "inline";
      document.getElementById('wrongmobile').innerHTML = stringConstants.CONTACT_NUMBER_INVALID;
      hasError = true;
    } else {
      document.getElementById('wrongmobile').style.display = "none";
    }
    return !hasError;
  }

  function resetDonor() {
    document.formDonor.firstName.value = "";
    document.formDonor.lastName.value = "";
    document.formDonor.email.value = "";
    document.formDonor.mobileNumber.value = "";
    document.formDonor.bloodGroup.value = "A+";
    document.getElementById('wrongfname').style.display = "none";
    document.getElementById('wronglname').style.display = "none";
    document.getElementById('wrongemail').style.display = "none";
    document.getElementById('wrongmobile').style.display = "none";
  }

  function addDonorAction(lat, lon, address, view) {

    if (ValidateAndSubmitDonor()) {
      var successCallBack = function successCallBack(responseDonor) {
        view.popup.title = stringConstants.ADD_DONOR_SUCCESS;
        view.popup.content = '\n                              <ul id= "donorInformation" class="list-group">\n                                <li class="list-group-item donor-info">Name : <b><i>' + responseDonor.firstName + ' ' + responseDonor.lastName + '</i></b></li>\n                                <li class="list-group-item donor-info">Blood group : <b><i>' + responseDonor.bloodGroup + '</i></b></li>\n                                <li class="list-group-item donor-info">Email : <b><i>' + responseDonor.emailAddress + '</i></b></li>\n                                <li class="list-group-item donor-info">Contact Number : <b><i> ' + responseDonor.mobileNumber + '</i></b></li>\n                                <li class="list-group-item donor-info">Address : <b><i> ' + responseDonor.address + '</i></b></li>\n                              </ul>\n                              ' + stringConstants.EDIT_DONOR_URL + '\n                              <a href=' + window.location.protocol + '//' + window.location.host + '/' + responseDonor._id + '>\n                                ' + window.location.protocol + '//' + window.location.host + '/' + responseDonor._id + ' </a>';
        view.popup.actions = [];
      };

      var firstName = document.formDonor.firstName.value;
      var lastName = document.formDonor.lastName.value;
      var email = document.formDonor.email.value;
      var mobileNumber = document.formDonor.mobileNumber.value;
      var bloodGroup = document.formDonor.bloodGroup.value;
      var donor = {
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
      (0, _donorsAPI.addDonor)(donor, successCallBack);
    }
  }

  function editDonorAction(donorEditable, view) {
    if (ValidateAndSubmitDonor()) {
      var successCallBack = function successCallBack(responseDonor) {
        view.popup.title = stringConstants.EDIT_DONOR_SUCCESS;
        view.popup.content = '<ul id= "donorInformation" class="list-group">\n                                  <li class="list-group-item donor-info">Name : <b><i>' + responseDonor.firstName + ' ' + responseDonor.lastName + '</i></b></li>\n                                  <li class="list-group-item donor-info">Blood group : <b><i>' + responseDonor.bloodGroup + '</i></b></li>\n                                  <li class="list-group-item donor-info">Email : <b><i>' + responseDonor.emailAddress + '</i></b></li>\n                                  <li class="list-group-item donor-info">Contact Number : <b><i> ' + responseDonor.mobileNumber + '</i></b></li>\n                                  <li class="list-group-item donor-info">Address : <b><i> ' + responseDonor.address + '</i></b></li>\n                                </ul>\n                                ' + stringConstants.EDIT_DONOR_URL + '\n                                <a href=' + window.location.protocol + '//' + window.location.host + '/' + responseDonor._id + '>\n                                  ' + window.location.protocol + '//' + window.location.host + '/' + responseDonor._id + ' </a>';
        view.popup.actions = [];
      };

      var donor = donorEditable;
      donor.firstName = document.formDonor.firstName.value;
      donor.lastName = document.formDonor.lastName.value;
      donor.emailAddress = document.formDonor.email.value;
      donor.mobileNumber = document.formDonor.mobileNumber.value;
      donor.bloodGroup = document.formDonor.bloodGroup.value;
      (0, _donorsAPI.updateDonor)(donor, successCallBack);
    }
  }

  function deleteDonorAction(donorId, view) {
    (0, _donorsAPI.deleteDonor)(donorId, successCallBack);
    function successCallBack(responseDonor) {
      view.popup.title = stringConstants.DELETE_DONOR_SUCCESS;
      view.popup.content = "";
      view.popup.actions = [];
    }
  }

  function getBloodGroupIcon(donor) {
    var symbolImageSource = "";
    switch (donor.bloodGroup) {
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllc1xcTWFwVXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUdyYXBoaWNGb3JEb25vciIsInNldEluaXRpYWxNYXBWaWV3IiwibmF2aWdhdGVUb0N1cnJlbnRMb2NhdGlvbiIsImdldFBvcHVwVGVtcGxhdGVGb3JEb25vckluZm9ybWF0aW9uIiwiZ2V0UG9wdXBUZW1wbGF0ZUZvckFkZERvbm9yIiwiVmFsaWRhdGVBbmRTdWJtaXREb25vciIsInJlc2V0RG9ub3IiLCJhZGREb25vckFjdGlvbiIsImVkaXREb25vckFjdGlvbiIsImRlbGV0ZURvbm9yQWN0aW9uIiwiYXBwQ29uc3RhbnRzIiwic3RyaW5nQ29uc3RhbnRzIiwicG9wdXBBY3Rpb25zIiwiZG9ub3IiLCJncmFwaGljIiwic3ltYm9sSW1hZ2VTb3VyY2UiLCJzaG93Q29udGFjdEluZm8iLCJ0aXRsZSIsImlkIiwiY2xhc3NOYW1lIiwiYXR0cmlidXRlcyIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiYmxvb2RHcm91cCIsImFkZHJlc3MiLCJlbWFpbEFkZHJlc3MiLCJtb2JpbGVOdW1iZXIiLCJnZW9tZXRyeSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiZ2V0Qmxvb2RHcm91cEljb24iLCJzeW1ib2wiLCJ1cmwiLCJ3aWR0aCIsImhlaWdodCIsInBvcHVwVGVtcGxhdGUiLCJtYXBSZWYiLCJkb25vckVkaXRhYmxlIiwibGF0IiwibG9uIiwibWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIiLCJiZWNvbWVEb25vckFjdGlvbiIsInZhbGlkYXRlQW5kU3VibWl0RG9ub3JBY3Rpb24iLCJyZXNldERvbm9yQWN0aW9uIiwibWFwMkQiLCJiYXNlbWFwIiwidmlldyIsImNvbnRhaW5lciIsImZpbmRET01Ob2RlIiwibWFwIiwiY2VudGVyIiwiREVGQVVMVF9MT0NBVElPTiIsInpvb20iLCJERUZBVUxUX1pPT01fTEVWRUwiLCJwYWRkaW5nIiwibGVmdCIsInVpIiwiY29tcG9uZW50cyIsInNlYXJjaFdpZGdldCIsInpvb21XaWRnZXQiLCJsb2NhdGVXaWRnZXQiLCJncmFwaGljc0xheWVyIiwidGhlbiIsImFkZCIsImdlb2dyYXBoaWNFeHRlbnQiLCJ3ZWJNZXJjYXRvclRvR2VvZ3JhcGhpYyIsImV4dGVudCIsInhtaW4iLCJ4bWF4IiwieW1heCIsInltaW4iLCJ3YXRjaCIsIm9uIiwiZXZ0IiwicG9wdXAiLCJhY3Rpb25zIiwiaGl0VGVzdCIsInNjcmVlblBvaW50IiwicmVzcG9uc2UiLCJyZXN1bHRzIiwiY29uc29sZSIsImxvZyIsIm1hcFBvaW50IiwibG9jYXRpb24iLCJjb250ZW50IiwicHVzaCIsInZpc2libGUiLCJkb2NrRW5hYmxlZCIsImxvY2F0b3JUYXNrIiwiTE9DQVRPUl9VUkwiLCJsb2NhdGlvblRvQWRkcmVzcyIsIk1hdGNoX2FkZHIiLCJvdGhlcndpc2UiLCJlcnIiLCJOT19BRERSRVNTX0ZPVU5EIiwicmVzdWx0IiwibmFtZSIsImZlYXR1cmUiLCJwb3NpdGlvbiIsImNvb3JkcyIsImFjdGlvbiIsImFkZERvbm9yRm9ybSIsIkRPQ0tfUE9QVVAiLCJuZXdWYWwiLCJlbXB0eSIsIm5hdmlnYXRvciIsImdlb2xvY2F0aW9uIiwiZ2V0Q3VycmVudFBvc2l0aW9uIiwiY3VycmVudExvY2F0aW9uIiwiZ29UbyIsImVycm9yIiwiYWxlcnQiLCJtZXNzYWdlIiwiR0VPX0xPQ0FUSU9OX05PVF9TVVBQT1JURUQiLCJkb2N1bWVudCIsImZvcm1Eb25vciIsInZhbHVlIiwiZW1haWwiLCJoYXNFcnJvciIsInRyaW0iLCJnZXRFbGVtZW50QnlJZCIsInN0eWxlIiwiZGlzcGxheSIsImlubmVySFRNTCIsIkZJUlNUX05BTUVfRU1QVFkiLCJsZW5ndGgiLCJGSVJTVF9OQU1FX01BWF9MRU5HVEgiLCJ0ZXN0IiwiRklSU1RfTkFNRV9BTFBIQV9OVU1FUklDIiwiTEFTVF9OQU1FX0VNUFRZIiwiTEFTVF9OQU1FX01BWF9MRU5HVEgiLCJMQVNUX05BTUVfQUxQSEFfTlVNRVJJQyIsIkVNQUlMX0FERFJFU1NfRU1QVFkiLCJzZWFyY2giLCJFTUFJTF9BRERSRVNTX0lOVkFMSUQiLCJDT05UQUNUX05VTUJFUl9FTVBUWSIsIkNPTlRBQ1RfTlVNQkVSX0lOVkFMSUQiLCJzdWNjZXNzQ2FsbEJhY2siLCJyZXNwb25zZURvbm9yIiwiQUREX0RPTk9SX1NVQ0NFU1MiLCJFRElUX0RPTk9SX1VSTCIsIndpbmRvdyIsInByb3RvY29sIiwiaG9zdCIsIl9pZCIsImlwQWRkcmVzcyIsIkVESVRfRE9OT1JfU1VDQ0VTUyIsImRvbm9ySWQiLCJERUxFVEVfRE9OT1JfU1VDQ0VTUyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1VBMEJnQkEscUIsR0FBQUEscUI7VUFvQ0FDLGlCLEdBQUFBLGlCO1VBeUtBQyx5QixHQUFBQSx5QjtVQXVCQUMsbUMsR0FBQUEsbUM7VUFnQkFDLDJCLEdBQUFBLDJCO1VBd0VBQyxzQixHQUFBQSxzQjtVQTZFQUMsVSxHQUFBQSxVO1VBWUFDLGMsR0FBQUEsYztVQXVDQUMsZSxHQUFBQSxlO1VBMEJBQyxpQixHQUFBQSxpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUE5ZEpDLFk7O01BQ0FDLGU7O01BQ0FDLFk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtaO0FBQ08sV0FBU1oscUJBQVQsQ0FBZ0NhLEtBQWhDLEVBQXNDO0FBQ3pDLFFBQUlDLFVBQVUsdUJBQWQ7QUFDQSxRQUFJQywwQkFBSjtBQUNBLFFBQU1DLGtCQUFrQjtBQUN0QjtBQUNBQyxhQUFPLHNCQUZlO0FBR3RCO0FBQ0FDLFVBQUksaUJBSmtCO0FBS3RCO0FBQ0FDLGlCQUFXO0FBTlcsS0FBeEI7QUFRQUwsWUFBUU0sVUFBUixHQUFxQixFQUFFLFdBQVlQLE1BQU1LLEVBQXBCO0FBQ0UsY0FBU0wsTUFBTVEsU0FBTixHQUFrQixHQUFsQixHQUF3QlIsTUFBTVMsUUFEekM7QUFFRSxvQkFBZVQsTUFBTVUsVUFGdkI7QUFHRSxpQkFBWVYsTUFBTVcsT0FIcEI7QUFJRSxzQkFBaUJYLE1BQU1ZLFlBSnpC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bUJOLGdCQUFnQnlJLG9CQUFuQztBQUNBdEcsV0FBSzRCLEtBQUwsQ0FBV1UsT0FBWCxHQUFxQixFQUFyQjtBQUNBdEMsV0FBSzRCLEtBQUwsQ0FBV0MsT0FBWCxHQUFxQixFQUFyQjtBQUNIO0FBQ047O0FBRUQsV0FBUzdDLGlCQUFULENBQTJCakIsS0FBM0IsRUFBaUM7QUFDL0IsUUFBSUUsb0JBQW9CLEVBQXhCO0FBQ0EsWUFBT0YsTUFBTVUsVUFBYjtBQUNFLFdBQUssSUFBTDtBQUNFUiw0QkFBb0IseUJBQXBCO0FBQ0E7QUFDRixXQUFLLElBQUw7QUFDRUEsNEJBQW9CLHlCQUFwQjtBQUNBO0FBQ0YsV0FBSyxLQUFMO0FBQ0VBLDRCQUFvQiwwQkFBcEI7QUFDQTtBQUNGLFdBQUssSUFBTDtBQUNFQSw0QkFBb0IseUJBQXBCO0FBQ0E7QUFDRixXQUFLLElBQUw7QUFDRUEsNEJBQW9CLDBCQUFwQjtBQUNBO0FBQ0YsV0FBSyxJQUFMO0FBQ0VBLDRCQUFvQiwwQkFBcEI7QUFDQTtBQUNGLFdBQUssS0FBTDtBQUNFQSw0QkFBb0IsMkJBQXBCO0FBQ0E7QUFDRixXQUFLLElBQUw7QUFDRUEsNEJBQW9CLDBCQUFwQjtBQUNBO0FBeEJKO0FBMEJBLFdBQU9BLGlCQUFQO0FBQ0QiLCJmaWxlIjoidXRpbGl0aWVzXFxNYXBVdGlsaXRpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgR3JhcGhpYyBmcm9tICdlc3JpL0dyYXBoaWMnO1xyXG5pbXBvcnQgUG9pbnQgZnJvbSAnZXNyaS9nZW9tZXRyeS9Qb2ludCc7XHJcbmltcG9ydCBMb2NhdG9yIGZyb20gJ2VzcmkvdGFza3MvTG9jYXRvcic7XHJcbmltcG9ydCBQb3B1cFRlbXBsYXRlIGZyb20gJ2VzcmkvUG9wdXBUZW1wbGF0ZSc7XHJcbmltcG9ydCBTaW1wbGVNYXJrZXJTeW1ib2wgZnJvbSAgJ2Vzcmkvc3ltYm9scy9TaW1wbGVNYXJrZXJTeW1ib2wnO1xyXG5pbXBvcnQgUGljdHVyZU1hcmtlclN5bWJvbCBmcm9tICdlc3JpL3N5bWJvbHMvUGljdHVyZU1hcmtlclN5bWJvbCc7XHJcbmltcG9ydCBzdG9yZSBmcm9tICdhcHAvc3RvcmUnXHJcbmltcG9ydCB7IHNldEluaXRpYWxWaWV3LCBzZXRJbml0aWFsR3JhcGhpY3NMYXllciB9IGZyb20gJ2FwcC9hY3Rpb25zL2Rvbm9yQWN0aW9ucydcclxuaW1wb3J0IHsgZ2V0RG9ub3JzLCBhZGREb25vciwgZGVsZXRlRG9ub3IsIHVwZGF0ZURvbm9yIH0gZnJvbSAnYXBwL2FwaS9kb25vcnNBUEknXHJcblxyXG5pbXBvcnQgTWFwIGZyb20gXCJlc3JpL01hcFwiXHJcbmltcG9ydCBNYXBWaWV3IGZyb20gXCJlc3JpL3ZpZXdzL01hcFZpZXdcIlxyXG5pbXBvcnQgWm9vbSBmcm9tICdlc3JpL3dpZGdldHMvWm9vbSdcclxuaW1wb3J0IExvY2F0ZSBmcm9tICdlc3JpL3dpZGdldHMvTG9jYXRlJ1xyXG5pbXBvcnQgU2VhcmNoIGZyb20gJ2Vzcmkvd2lkZ2V0cy9TZWFyY2gnXHJcbmltcG9ydCB3YXRjaFV0aWxzIGZyb20gJ2VzcmkvY29yZS93YXRjaFV0aWxzJ1xyXG5pbXBvcnQgR3JhcGhpY3NMYXllciBmcm9tICdlc3JpL2xheWVycy9HcmFwaGljc0xheWVyJ1xyXG5pbXBvcnQgd2ViTWVyY2F0b3JVdGlscyBmcm9tICdlc3JpL2dlb21ldHJ5L3N1cHBvcnQvd2ViTWVyY2F0b3JVdGlscydcclxuaW1wb3J0ICogYXMgYXBwQ29uc3RhbnRzIGZyb20gJ2FwcC91dGlsaXRpZXMvY29uc3RhbnRzJ1xyXG5pbXBvcnQgKiBhcyBzdHJpbmdDb25zdGFudHMgZnJvbSAnYXBwL3V0aWxpdGllcy9zdHJpbmdDb25zdGFudHMnXHJcbmltcG9ydCAqIGFzIHBvcHVwQWN0aW9ucyBmcm9tICdhcHAvdXRpbGl0aWVzL3BvcHVwQWN0aW9ucydcclxuXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcblxyXG5cclxuLy8gQ3JlYXRlcyBHcnBhaGljKGljb24pIGZvciBEb25vclxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlR3JhcGhpY0ZvckRvbm9yIChkb25vcil7XHJcbiAgICBsZXQgZ3JhcGhpYyA9IG5ldyBHcmFwaGljKCk7XHJcbiAgICBsZXQgc3ltYm9sSW1hZ2VTb3VyY2U7XHJcbiAgICBjb25zdCBzaG93Q29udGFjdEluZm8gPSB7XHJcbiAgICAgIC8vIFRoaXMgdGV4dCBpcyBkaXNwbGF5ZWQgYXMgYSB0b29sdGlwXHJcbiAgICAgIHRpdGxlOiBcIlNob3cgQ29udGFjdCBEZXRhaWxzXCIsXHJcbiAgICAgIC8vIFRoZSBJRCBieSB3aGljaCB0byByZWZlcmVuY2UgdGhlIGFjdGlvbiBpbiB0aGUgZXZlbnQgaGFuZGxlclxyXG4gICAgICBpZDogXCJzaG93Q29udGFjdEluZm9cIixcclxuICAgICAgLy8gU2V0cyB0aGUgaWNvbiBmb250IHVzZWQgdG8gc3R5bGUgdGhlIGFjdGlvbiBidXR0b25cclxuICAgICAgY2xhc3NOYW1lOiBcImVzcmktaWNvbi16b29tLW91dC1tYWduaWZ5aW5nLWdsYXNzXCJcclxuICAgIH07XHJcbiAgICBncmFwaGljLmF0dHJpYnV0ZXMgPSB7IFwiZG9ub3JJZFwiIDogZG9ub3IuaWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiIDogZG9ub3IuZmlyc3ROYW1lICsgJyAnICsgZG9ub3IubGFzdE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYmxvb2RHcm91cFwiIDogZG9ub3IuYmxvb2RHcm91cCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhZGRyZXNzXCIgOiBkb25vci5hZGRyZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcImVtYWlsQWRkcmVzc1wiIDogZG9ub3IuZW1haWxBZGRyZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1vYmlsZU51bWJlclwiIDogZG9ub3IubW9iaWxlTnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgZ3JhcGhpYy5nZW9tZXRyeSA9IG5ldyBQb2ludCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBkb25vci5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGRvbm9yLmxhdGl0dWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBnZXRCbG9vZEdyb3VwSWNvbihkb25vcik7XHJcbiAgICBncmFwaGljLnN5bWJvbCA9IG5ldyBQaWN0dXJlTWFya2VyU3ltYm9sKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHN5bWJvbEltYWdlU291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjI4cHhcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMzNweFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgZ3JhcGhpYy5wb3B1cFRlbXBsYXRlICA9IG5ldyBQb3B1cFRlbXBsYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGl0bGVcIiA6IFwiQmxvb2QgRG9ub3IgRGV0YWlsc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb250ZW50XCIgOiBnZXRQb3B1cFRlbXBsYXRlRm9yRG9ub3JJbmZvcm1hdGlvbihkb25vciksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgcmV0dXJuIGdyYXBoaWM7XHJcbn1cclxuXHJcbi8vIFNldHMgdGhlIGluaXRpYWwgTWFwVmlldy4gQXR0YWNoZXMgdGhlIGV2ZW50cyB0byB3YXRjaC4gU2V0cyB0aGUgVUkgd2lkZ2V0cyB0byBiZSBkaXNwbGF5ZWQgb24gTWFwLlxyXG5leHBvcnQgZnVuY3Rpb24gc2V0SW5pdGlhbE1hcFZpZXcobWFwUmVmLCBkb25vckVkaXRhYmxlKXtcclxuXHJcbiAgbGV0IGxhdCA9IDA7XHJcbiAgbGV0IGxvbiA9IDA7XHJcbiAgbGV0IGFkZHJlc3MgPSAnJztcclxuICBsZXQgbWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIgPSB7fTtcclxuXHJcbiAgY29uc3QgYmVjb21lRG9ub3JBY3Rpb24gPSBwb3B1cEFjdGlvbnMuYmVjb21lRG9ub3JBY3Rpb247XHJcbiAgY29uc3QgdmFsaWRhdGVBbmRTdWJtaXREb25vckFjdGlvbiA9IHBvcHVwQWN0aW9ucy52YWxpZGF0ZUFuZFN1Ym1pdERvbm9yQWN0aW9uO1xyXG4gIGNvbnN0IHJlc2V0RG9ub3JBY3Rpb24gPSBwb3B1cEFjdGlvbnMucmVzZXREb25vckFjdGlvbjtcclxuXHJcbiAgY29uc3QgbWFwMkQgPSBuZXcgTWFwKHtcclxuICAgICAgYmFzZW1hcDogXCJzdHJlZXRzXCJcclxuICB9KTtcclxuICBjb25zdCB2aWV3ID0gbmV3IE1hcFZpZXcoe1xyXG4gICAgICBjb250YWluZXI6IFJlYWN0RE9NLmZpbmRET01Ob2RlKG1hcFJlZiksXHJcbiAgICAgIG1hcDogbWFwMkQsXHJcbiAgICAgIGNlbnRlcjogYXBwQ29uc3RhbnRzLkRFRkFVTFRfTE9DQVRJT04sXHJcbiAgICAgIHpvb206IGFwcENvbnN0YW50cy5ERUZBVUxUX1pPT01fTEVWRUwsXHJcbiAgICAgIHBhZGRpbmc6IHtcclxuICAgICAgICBsZWZ0OiAxMjAgLy8gU2FtZSB2YWx1ZSBhcyB0aGUgI3NpZGViYXIgd2lkdGggaW4gQ1NTXHJcbiAgICAgIH0sXHJcbiAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHM6IFtdIC8vIGZvciBjdXN0b20gVUksIGVtcHR5IHRoZSBkZWZhdWx0IFVJIGNvbXBvbmVudHNcclxuICAgICAgICAgIH1cclxuICB9KTtcclxuICAvLyBVSSBjb21wb25lbnRzXHJcbiAgY29uc3Qgc2VhcmNoV2lkZ2V0ID0gbmV3IFNlYXJjaCh7XHJcbiAgICB2aWV3OiB2aWV3XHJcbiAgfSk7XHJcbiAgY29uc3Qgem9vbVdpZGdldCA9IG5ldyBab29tKHtcclxuICAgIHZpZXc6IHZpZXdcclxuICB9KTtcclxuICBjb25zdCBsb2NhdGVXaWRnZXQgPSBuZXcgTG9jYXRlKHtcclxuICAgIHZpZXc6IHZpZXdcclxuICB9KTtcclxuICAvL0dyYXBoaWNzIExheWVyXHJcbiAgY29uc3QgZ3JhcGhpY3NMYXllciA9IG5ldyBHcmFwaGljc0xheWVyKHtpZCA6ICdibG9vZERvbm9yc0xheWVyJ30pO1xyXG5cclxuICB2aWV3LnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgIG5hdmlnYXRlVG9DdXJyZW50TG9jYXRpb24odmlldylcclxuICAgICAgbWFwMkQuYWRkKGdyYXBoaWNzTGF5ZXIpO1xyXG4gICAgICBsZXQgZ2VvZ3JhcGhpY0V4dGVudCA9IHdlYk1lcmNhdG9yVXRpbHMud2ViTWVyY2F0b3JUb0dlb2dyYXBoaWModmlldy5leHRlbnQpO1xyXG4gICAgICBpZihnZW9ncmFwaGljRXh0ZW50LnhtaW4gJiYgZ2VvZ3JhcGhpY0V4dGVudC54bWF4ICYmIGdlb2dyYXBoaWNFeHRlbnQueW1heCAmJiBnZW9ncmFwaGljRXh0ZW50LnltaW4pe1xyXG4gICAgICAgIGdldERvbm9ycyhnZW9ncmFwaGljRXh0ZW50KTtcclxuICAgICAgfVxyXG4gIH0pO1xyXG5cclxuICB2aWV3LndhdGNoKCdleHRlbnQnLCBmdW5jdGlvbigpe1xyXG4gICAgICBsZXQgZ2VvZ3JhcGhpY0V4dGVudCA9IHdlYk1lcmNhdG9yVXRpbHMud2ViTWVyY2F0b3JUb0dlb2dyYXBoaWModmlldy5leHRlbnQpO1xyXG4gICAgICBpZihnZW9ncmFwaGljRXh0ZW50LnhtaW4gJiYgZ2VvZ3JhcGhpY0V4dGVudC54bWF4ICYmIGdlb2dyYXBoaWNFeHRlbnQueW1heCAmJiBnZW9ncmFwaGljRXh0ZW50LnltaW4pe1xyXG4gICAgICAgIGdldERvbm9ycyhnZW9ncmFwaGljRXh0ZW50KTtcclxuICAgICAgfVxyXG4gIH0pXHJcblxyXG4gIHZpZXcub24oJ2NsaWNrJywgKGV2dCkgPT4ge1xyXG4gICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICB2aWV3LmhpdFRlc3QoZXZ0LnNjcmVlblBvaW50KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgaWYocmVzcG9uc2UgJiYgcmVzcG9uc2UucmVzdWx0c1swXSAmJiByZXNwb25zZS5yZXN1bHRzWzBdLmdyYXBoaWMpe1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBncmFwaGljIGZvdW5kISBTaG93IFBvcHVwIVwiKTtcclxuICAgICAgICBsYXQgPSBldnQubWFwUG9pbnQubGF0aXR1ZGU7XHJcbiAgICAgICAgbG9uID0gZXZ0Lm1hcFBvaW50LmxvbmdpdHVkZTtcclxuXHJcbiAgICAgICAgdmlldy5wb3B1cC5sb2NhdGlvbiA9IGV2dC5tYXBQb2ludDtcclxuICAgICAgICB2aWV3LnBvcHVwLnRpdGxlID0gXCJMb2NhdGlvbiBkZXRhaWxzIVwiO1xyXG4gICAgICAgIHZpZXcucG9wdXAuY29udGVudCA9IFwiLi4uXCI7XHJcbiAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zLnB1c2goYmVjb21lRG9ub3JBY3Rpb24pO1xyXG4gICAgICAgIHZpZXcucG9wdXAudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdmlldy5wb3B1cC5kb2NrRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBsb2NhdG9yVGFzayA9IG5ldyBMb2NhdG9yKHtcclxuICAgICAgICAgICB1cmw6IGFwcENvbnN0YW50cy5MT0NBVE9SX1VSTFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb2NhdG9yVGFzay5sb2NhdGlvblRvQWRkcmVzcyhldnQubWFwUG9pbnQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgLy8gSWYgYW4gYWRkcmVzcyBpcyBzdWNjZXNzZnVsbHkgZm91bmQsIHByaW50IGl0IHRvIHRoZSBwb3B1cCdzIGNvbnRlbnRcclxuICAgICAgICAgICAgYWRkcmVzcyA9IHJlc3BvbnNlLmFkZHJlc3MuTWF0Y2hfYWRkcjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYWRkcmVzcyk7XHJcbiAgICAgICAgICAgIHZpZXcucG9wdXAuY29udGVudCA9IGFkZHJlc3M7XHJcbiAgICAgICAgICAgIGFkZHJlc3MgPSBhZGRyZXNzO1xyXG4gICAgICAgICAgfSkub3RoZXJ3aXNlKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgcHJvbWlzZSBmYWlscyBhbmQgbm8gcmVzdWx0IGlzIGZvdW5kLCBwcmludCBhIGdlbmVyaWMgbWVzc2FnZVxyXG4gICAgICAgICAgICAvLyB0byB0aGUgcG9wdXAncyBjb250ZW50XHJcbiAgICAgICAgICAgIGFkZHJlc3MgPSBzdHJpbmdDb25zdGFudHMuTk9fQUREUkVTU19GT1VORDtcclxuICAgICAgICAgICAgdmlldy5wb3B1cC5jb250ZW50ID0gc3RyaW5nQ29uc3RhbnRzLk5PX0FERFJFU1NfRk9VTkQ7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNlYXJjaFdpZGdldC5vbihcInNlbGVjdC1yZXN1bHRcIiwgZnVuY3Rpb24oZXZ0KXtcclxuICAgIHZpZXcucG9wdXAuYWN0aW9ucyA9IFtdO1xyXG4gICAgdmlldy5wb3B1cC5hY3Rpb25zLnB1c2goYmVjb21lRG9ub3JBY3Rpb24pO1xyXG4gICAgYWRkcmVzcyA9IGV2dC5yZXN1bHQubmFtZTtcclxuICAgIGxhdCA9IGV2dC5yZXN1bHQuZmVhdHVyZS5nZW9tZXRyeS5sYXRpdHVkZTtcclxuICAgIGxvbiA9IGV2dC5yZXN1bHQuZmVhdHVyZS5nZW9tZXRyeS5sb25naXR1ZGU7XHJcblxyXG4gIH0pO1xyXG5cclxuICBsb2NhdGVXaWRnZXQub24oXCJsb2NhdGVcIiwgZnVuY3Rpb24oZXZ0KXtcclxuICAgIGNvbnNvbGUubG9nKGV2dCk7XHJcbiAgICB2aWV3LnBvcHVwLnRpdGxlID0gXCJZb3VyIGN1cnJlbnQgbG9jYXRpb25cIjtcclxuICAgIHZpZXcucG9wdXAuY29udGVudCA9IFwiXCI7XHJcbiAgICB2aWV3LnBvcHVwLmxvY2F0aW9uID0gdmlldy5jZW50ZXI7XHJcbiAgICB2aWV3LnBvcHVwLmFjdGlvbnMgPSBbXTtcclxuICAgIHZpZXcucG9wdXAuYWN0aW9ucy5wdXNoKGJlY29tZURvbm9yQWN0aW9uKTtcclxuICAgIHZpZXcucG9wdXAudmlzaWJsZSA9IHRydWU7XHJcbiAgICB2aWV3LnBvcHVwLmRvY2tFbmFibGVkID0gZmFsc2U7XHJcblxyXG4gICAgbGF0ID0gZXZ0LnBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgIGxvbiA9IGV2dC5wb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgYWRkcmVzcyA9IHN0cmluZ0NvbnN0YW50cy5OT19BRERSRVNTX0ZPVU5EO1xyXG5cclxuICB9KTtcclxuXHJcbiAgdmlldy5wb3B1cC5vbihcInRyaWdnZXItYWN0aW9uXCIsIGZ1bmN0aW9uKGV2dCl7XHJcbiAgICAvLyBJZiB0aGUgem9vbS1vdXQgYWN0aW9uIGlzIGNsaWNrZWQsIGZpcmUgdGhlIHpvb21PdXQoKSBmdW5jdGlvblxyXG4gICAgaWYoZXZ0LmFjdGlvbi5pZCA9PT0gXCJiZWNvbWVEb25vclwiKXtcclxuICAgICAgY29uc3QgYWRkRG9ub3JGb3JtID0gZ2V0UG9wdXBUZW1wbGF0ZUZvckFkZERvbm9yKCk7XHJcbiAgICAgIHZpZXcucG9wdXAudGl0bGUgPSBzdHJpbmdDb25zdGFudHMuRE9DS19QT1BVUDtcclxuICAgICAgdmlldy5wb3B1cC5jb250ZW50ID0gYWRkRG9ub3JGb3JtO1xyXG4gICAgICB2aWV3LnBvcHVwLmRvY2tFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICAgIHZpZXcucG9wdXAuYWN0aW9ucy5wdXNoKHJlc2V0RG9ub3JBY3Rpb24pO1xyXG4gICAgICB2aWV3LnBvcHVwLmFjdGlvbnMucHVzaCh2YWxpZGF0ZUFuZFN1Ym1pdERvbm9yQWN0aW9uKTtcclxuICAgIH1lbHNlIGlmKGV2dC5hY3Rpb24uaWQgPT09IFwiYWRkRG9ub3JcIil7XHJcbiAgICAgICAgYWRkRG9ub3JBY3Rpb24obGF0LCBsb24sIGFkZHJlc3MsIHZpZXcpO1xyXG4gICAgfWVsc2UgaWYoZXZ0LmFjdGlvbi5pZCA9PT0gXCJyZXNldERvbm9yXCIpe1xyXG4gICAgICAgIHJlc2V0RG9ub3IoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmlldy53YXRjaChcIndpZHRoQnJlYWtwb2ludFwiLCBmdW5jdGlvbihuZXdWYWwpe1xyXG4gICAgaWYgKG5ld1ZhbCA9PT0gXCJ4c21hbGxcIiB8fCBuZXdWYWwgPT09IFwic21hbGxcIil7XHJcbiAgICAgIC8vIGNsZWFyIHRoZSB2aWV3J3MgZGVmYXVsdCBVSSBjb21wb25lbnRzIGlmXHJcbiAgICAgIC8vIGFwcCBpcyB1c2VkIG9uIGEgbW9iaWxlIGRldmljZVxyXG4gICAgICB2aWV3LnVpLmVtcHR5KFwiYm90dG9tLWxlZnRcIik7XHJcbiAgICAgIHZpZXcudWkuYWRkKHNlYXJjaFdpZGdldCwgXCJib3R0b20tcmlnaHRcIik7XHJcbiAgICAgIHZpZXcucGFkZGluZyA9IHtcclxuICAgICAgICAgIGxlZnQ6IDAgLy8gU2FtZSB2YWx1ZSBhcyB0aGUgI3NpZGViYXIgd2lkdGggaW4gQ1NTXHJcbiAgICAgIH07XHJcbiAgICB9ZWxzZXtcclxuICAgICAgdmlldy5wYWRkaW5nID0ge1xyXG4gICAgICAgICAgbGVmdDogMTIwIC8vIFNhbWUgdmFsdWUgYXMgdGhlICNzaWRlYmFyIHdpZHRoIGluIENTU1xyXG4gICAgICB9O1xyXG4gICAgICB2aWV3LnVpLmVtcHR5KFwiYm90dG9tLWxlZnRcIik7XHJcbiAgICAgIHZpZXcudWkuYWRkKHpvb21XaWRnZXQsIFwiYm90dG9tLWxlZnRcIik7XHJcbiAgICAgIHZpZXcudWkuYWRkKGxvY2F0ZVdpZGdldCwgXCJib3R0b20tbGVmdFwiKTtcclxuICAgICAgdmlldy51aS5hZGQoc2VhcmNoV2lkZ2V0LCBcImJvdHRvbS1sZWZ0XCIpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2aWV3LnVpLmFkZCh6b29tV2lkZ2V0LCBcImJvdHRvbS1sZWZ0XCIpO1xyXG4gIHZpZXcudWkuYWRkKGxvY2F0ZVdpZGdldCwgXCJib3R0b20tbGVmdFwiKTtcclxuICB2aWV3LnVpLmFkZChzZWFyY2hXaWRnZXQsIFwiYm90dG9tLWxlZnRcIik7XHJcblxyXG5cclxuICBtYXBWaWV3QW5kR3JhcGhpY3NMYXllciA9IHsgdmlldyA6IHZpZXcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyYXBoaWNzTGF5ZXIgOiBncmFwaGljc0xheWVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICByZXR1cm4gbWFwVmlld0FuZEdyYXBoaWNzTGF5ZXI7XHJcbn1cclxuXHJcblxyXG4vLyBOYXZpZ2F0ZXMgdG8gdGhlIGN1cnJlbnRMb2NhdGlvblxyXG5leHBvcnQgZnVuY3Rpb24gbmF2aWdhdGVUb0N1cnJlbnRMb2NhdGlvbih2aWV3KXtcclxuICAgICAgICBpZiAobmF2aWdhdG9yLmdlb2xvY2F0aW9uKSB7XHJcbiAgICAgICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFN1Y2Nlc3MgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihwb3NpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBsb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3VycmVudExvY2F0aW9uID0gbmV3IFBvaW50KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IGxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogbGF0aXR1ZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWV3LmdvVG8oY3VycmVudExvY2F0aW9uLCBhcHBDb25zdGFudHMuREVGQVVMVF9aT09NX0xFVkVMKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIE9wdGlvbmFsIGVycm9yIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGFsZXJ0KHN0cmluZ0NvbnN0YW50cy5HRU9fTE9DQVRJT05fTk9UX1NVUFBPUlRFRCk7XHJcblx0XHRcdFx0fVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9wdXBUZW1wbGF0ZUZvckRvbm9ySW5mb3JtYXRpb24oZG9ub3Ipe1xyXG4gIHJldHVybiBgPGRpdj5cclxuICAgICAgICAgICAgPHVsIGlkPSBcImRvbm9ySW5mb3JtYXRpb25cIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICA8bGkgaWQ9XCJkb25vck5hbWVcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+TmFtZSA6IDxiPjxpPiR7ZG9ub3IuZmlyc3ROYW1lfSAke2Rvbm9yLmxhc3ROYW1lfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICA8bGkgaWQ9XCJkb25vckJsb29kR3JvdXBcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+Qmxvb2QgZ3JvdXAgOiA8Yj48aT4ke2Rvbm9yLmJsb29kR3JvdXB9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGlkPVwiU2hvd0luZm9cIiBuYW1lPVwiU2hvd0luZm9cIiBvbkNsaWNrPVwiZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rvbm9yQ29udGFjdEluZm9ybWF0aW9uJykuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xyXG4gICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTaG93SW5mbycpLnN0eWxlLmRpc3BsYXk9J25vbmUnXCIgY2xhc3M9XCJidG4gYnRuLWluZm9cIiB2YWx1ZT1cIlNob3cgQ29udGFjdCBJbmZvXCIvPlxyXG4gICAgICAgICAgICA8dWwgaWQ9XCJkb25vckNvbnRhY3RJbmZvcm1hdGlvblwiIHN0eWxlPVwiZGlzcGxheTpub25lXCIgPlxyXG4gICAgICAgICAgICAgIDxiPkNvbnRhY3QgSW5mb3JtYXRpb248L2I+XHJcbiAgICAgICAgICAgICAgPGxpIGlkPVwiZG9ub3JFbWFpbFwiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5FbWFpbCA6IDxiPjxpPiR7ZG9ub3IuZW1haWxBZGRyZXNzfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICA8bGkgaWQ9XCJkb25vclBob25lTnVtYmVyXCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkNvbnRhY3QgTnVtYmVyIDogPGI+PGk+ICR7ZG9ub3IubW9iaWxlTnVtYmVyfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj5gO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UG9wdXBUZW1wbGF0ZUZvckFkZERvbm9yKGRvbm9yKXtcclxuXHJcbiAgbGV0IGZpcnN0TmFtZSA9IGRvbm9yICYmIGRvbm9yLmZpcnN0TmFtZSB8fCAnJztcclxuICBsZXQgbGFzdE5hbWUgPSBkb25vciAmJiBkb25vci5sYXN0TmFtZSB8fCAnJztcclxuICBsZXQgYmxvb2RHcm91cCA9IGRvbm9yICYmIGRvbm9yLmJsb29kR3JvdXAgfHwgJ0ErJztcclxuICBsZXQgbW9iaWxlTnVtYmVyID0gZG9ub3IgJiYgZG9ub3IubW9iaWxlTnVtYmVyIHx8ICcnO1xyXG4gIGxldCBlbWFpbEFkZHJlc3MgPSBkb25vciAmJiBkb25vci5lbWFpbEFkZHJlc3MgfHwgJyc7XHJcblxyXG4gIHJldHVybiBgPGZvcm0gbmFtZSA9IFwiZm9ybURvbm9yXCIgY2xhc3M9XCJmb3JtLWhvcml6b250YWxcIiBvblN1Ym1pdD1cIlZhbGlkYXRlQW5kU3VibWl0KClcIj5cclxuICAgICAgICAgIFx0PGZpZWxkc2V0PlxyXG4gICAgICAgICAgXHQ8IS0tIFRleHQgaW5wdXQtLT5cclxuICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgIFx0ICA8bGFiZWwgY2xhc3M9XCJjb2wtbWQtNCBjb250cm9sLWxhYmVsXCIgZm9yPVwiZmlyc3ROYW1lXCI+Rmlyc3QgTmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICBcdCAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XHJcbiAgICAgICAgICBcdCAgPGlucHV0IGlkPVwiZmlyc3ROYW1lXCIgbmFtZT1cImZpcnN0TmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJGaXJzdCBOYW1lXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtbWRcIiB2YWx1ZT0ke2ZpcnN0TmFtZX0gPlxyXG4gICAgICAgICAgXHQgIDxzcGFuIGlkPVwid3JvbmdmbmFtZVwiIGNsYXNzPVwiZXJyb3IgYWxlcnQtZGFuZ2VyXCI+PC9zcGFuPlxyXG4gICAgICAgICAgXHQgIDwvZGl2PlxyXG4gICAgICAgICAgXHQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICBcdDwhLS0gVGV4dCBpbnB1dC0tPlxyXG4gICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgXHQgIDxsYWJlbCBjbGFzcz1cImNvbC1tZC00IGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJsYXN0TmFtZVwiPkxhc3QgTmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICBcdCAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XHJcbiAgICAgICAgICBcdCAgPGlucHV0IGlkPVwibGFzdE5hbWVcIiBuYW1lPVwibGFzdE5hbWVcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiTGFzdCBOYW1lXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtbWRcIiB2YWx1ZT0ke2xhc3ROYW1lfSA+XHJcbiAgICAgICAgICBcdCAgPHNwYW4gaWQ9XCJ3cm9uZ2xuYW1lXCIgY2xhc3M9XCJlcnJvciBhbGVydC1kYW5nZXJcIj48L3NwYW4+XHJcbiAgICAgICAgICBcdCAgPC9kaXY+XHJcbiAgICAgICAgICBcdDwvZGl2PlxyXG5cclxuICAgICAgICAgIFx0PCEtLSBTZWxlY3QgQmxvb2QgR3JvdXAgLS0+XHJcblxyXG4gICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgXHQgIDxsYWJlbCBjbGFzcz1cImNvbC1tZC00IGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJibG9vZEdyb3VwXCI+Qmxvb2QgR3JvdXA8L2xhYmVsPlxyXG4gICAgICAgICAgXHQgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNFwiPlxyXG4gICAgICAgICAgXHRcdDxzZWxlY3QgaWQ9XCJibG9vZEdyb3VwXCIgbmFtZT1cImJsb29kR3JvdXBcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIkErXCI+QSs8L29wdGlvbj5cclxuICAgICAgICAgIFx0XHQgIDxvcHRpb24gdmFsdWU9XCJBLVwiPkEtPC9vcHRpb24+XHJcbiAgICAgICAgICBcdFx0ICA8b3B0aW9uIHZhbHVlPVwiQitcIj5CKzwvb3B0aW9uPlxyXG4gICAgICAgICAgXHRcdCAgPG9wdGlvbiB2YWx1ZT1cIkItXCI+Qi08L29wdGlvbj5cclxuICAgICAgICAgIFx0XHQgIDxvcHRpb24gdmFsdWU9XCJBQitcIj5BQis8L29wdGlvbj5cclxuICAgICAgICAgIFx0XHQgIDxvcHRpb24gdmFsdWU9XCJBQi1cIj5BQi08L29wdGlvbj5cclxuICAgICAgICAgIFx0XHQgIDxvcHRpb24gdmFsdWU9XCJPK1wiPk8rPC9vcHRpb24+XHJcbiAgICAgICAgICBcdFx0ICA8b3B0aW9uIHZhbHVlPVwiTy1cIj5PLTwvb3B0aW9uPlxyXG4gICAgICAgICAgXHRcdDwvc2VsZWN0PlxyXG4gICAgICAgICAgXHQgIDwvZGl2PlxyXG4gICAgICAgICAgXHQ8L2Rpdj5cclxuICAgICAgICAgIFx0PCEtLSBUZXh0IGlucHV0LS0+XHJcbiAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICBcdCAgPGxhYmVsIGNsYXNzPVwiY29sLW1kLTQgY29udHJvbC1sYWJlbFwiIGZvcj1cImVtYWlsXCI+RW1haWw8L2xhYmVsPlxyXG4gICAgICAgICAgXHQgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNVwiPlxyXG4gICAgICAgICAgXHQgIDxpbnB1dCBpZD1cImVtYWlsXCIgbmFtZT1cImVtYWlsXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtbWRcIiB2YWx1ZT0ke2VtYWlsQWRkcmVzc30+XHJcbiAgICAgICAgICBcdCAgPHNwYW4gaWQ9XCJ3cm9uZ2VtYWlsXCIgY2xhc3M9XCJlcnJvciBhbGVydC1kYW5nZXJcIj48L3NwYW4+XHJcbiAgICAgICAgICBcdCAgPHNwYW4gY2xhc3M9XCJoZWxwLWJsb2NrXCI+ZWc6IGFiY0BtYWlsLmNvbTwvc3Bhbj5cclxuICAgICAgICAgIFx0ICA8L2Rpdj5cclxuICAgICAgICAgIFx0PC9kaXY+XHJcblxyXG4gICAgICAgICAgXHQ8IS0tIFNlYXJjaCBpbnB1dC0tPlxyXG4gICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgXHQgIDxsYWJlbCBjbGFzcz1cImNvbC1tZC00IGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJtb2JpbGVOdW1iZXJcIj5Nb2JpbGU8L2xhYmVsPlxyXG4gICAgICAgICAgXHQgIDxkaXYgY2xhc3M9XCJjb2wtbWQtNVwiPlxyXG4gICAgICAgICAgXHRcdDxpbnB1dCBpZD1cIm1vYmlsZU51bWJlclwiIG5hbWU9XCJtb2JpbGVOdW1iZXJcIiB0eXBlPVwic2VhcmNoXCIgcGxhY2Vob2xkZXI9XCJNb2JpbGUgTnVtYmVyXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgaW5wdXQtbWRcIiB2YWx1ZT0ke21vYmlsZU51bWJlcn0+XHJcbiAgICAgICAgICBcdFx0PHNwYW4gaWQ9XCJ3cm9uZ21vYmlsZVwiIGNsYXNzPVwiZXJyb3IgYWxlcnQtZGFuZ2VyXCI+PC9zcGFuPlxyXG4gICAgICAgICAgXHRcdDxwIGNsYXNzPVwiaGVscC1ibG9ja1wiPmZvciBleDogMDBYWCBYWFggWFhYWCBYWFggb3IgK1hYIFhYWCBYWFhYIFhYWCA8L3A+XHJcbiAgICAgICAgICBcdCAgPC9kaXY+XHJcbiAgICAgICAgICBcdDwvZGl2PlxyXG5cclxuXHJcbiAgICAgICAgICBcdDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICA8L2Zvcm0+YDtcclxuXHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVmFsaWRhdGVBbmRTdWJtaXREb25vcigpe1xyXG4gIC8vZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIHZhciBmaXJzdE5hbWUgPSBkb2N1bWVudC5mb3JtRG9ub3IuZmlyc3ROYW1lLnZhbHVlO1xyXG4gIHZhciBsYXN0TmFtZSA9IGRvY3VtZW50LmZvcm1Eb25vci5sYXN0TmFtZS52YWx1ZTtcclxuICB2YXIgZW1haWwgPSBkb2N1bWVudC5mb3JtRG9ub3IuZW1haWwudmFsdWU7XHJcbiAgdmFyIG1vYmlsZU51bWJlciA9IGRvY3VtZW50LmZvcm1Eb25vci5tb2JpbGVOdW1iZXIudmFsdWU7XHJcbiAgdmFyIGJsb29kR3JvdXAgPSBkb2N1bWVudC5mb3JtRG9ub3IuYmxvb2RHcm91cC52YWx1ZTtcclxuICB2YXIgaGFzRXJyb3IgPSBmYWxzZTtcclxuICBpZiAoZmlyc3ROYW1lLnRyaW0oKT09XCJcIilcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdmbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZm5hbWUnKS5pbm5lckhUTUwgPSBzdHJpbmdDb25zdGFudHMuRklSU1RfTkFNRV9FTVBUWTtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9XHJcbiAgZWxzZSBpZiAoZmlyc3ROYW1lLmxlbmd0aCA+IGFwcENvbnN0YW50cy5GSVJTVF9OQU1FX01BWF9MRU5HVEgpXHJcbiAge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZm5hbWUnKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2ZuYW1lJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkZJUlNUX05BTUVfTUFYX0xFTkdUSDtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9XHJcbiAgZWxzZSBpZiAoL1teYS16QS1aMC05XFwtXS8udGVzdCggZmlyc3ROYW1lICkpXHJcbiAge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2VtYWlsJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdmbmFtZScpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5GSVJTVF9OQU1FX0FMUEhBX05VTUVSSUM7XHJcbiAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgfWVsc2V7XHJcbiAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZm5hbWUnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG5cclxuICBpZiAobGFzdE5hbWUudHJpbSgpPT1cIlwiKVxyXG4gIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2xuYW1lJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdsbmFtZScpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5MQVNUX05BTUVfRU1QVFk7XHJcbiAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgfWVsc2UgaWYgKGxhc3ROYW1lLmxlbmd0aCA+IGFwcENvbnN0YW50cy5MQVNUX05BTUVfTUFYX0xFTkdUSClcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdsbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbG5hbWUnKS5pbm5lckhUTUwgPSBzdHJpbmdDb25zdGFudHMuTEFTVF9OQU1FX01BWF9MRU5HVEg7XHJcbiAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgfWVsc2UgaWYgKC9bXmEtekEtWjAtOVxcLV0vLnRlc3QoIGxhc3ROYW1lICkpXHJcbiAge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbG5hbWUnKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2xuYW1lJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkxBU1RfTkFNRV9BTFBIQV9OVU1FUklDO1xyXG4gICAgaGFzRXJyb3IgPSB0cnVlO1xyXG4gIH1lbHNle1xyXG4gICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2xuYW1lJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIH1cclxuXHJcbiAgaWYgKGVtYWlsLnRyaW0oKT09XCJcIilcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdlbWFpbCcpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZW1haWwnKS5pbm5lckhUTUwgPSBzdHJpbmdDb25zdGFudHMuRU1BSUxfQUREUkVTU19FTVBUWTtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9ZWxzZSBpZiAoZW1haWwuc2VhcmNoKC9eW2EtekEtWl0rKFtfXFwuLV0/W2EtekEtWjAtOV0rKSpAW2EtekEtWjAtOV0rKFtcXC4tXT9bYS16QS1aMC05XSspKihcXC5bYS16QS1aXXsyLDR9KSskLykgPT0gLTEpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2VtYWlsJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdlbWFpbCcpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5FTUFJTF9BRERSRVNTX0lOVkFMSUQ7XHJcbiAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgfWVsc2V7XHJcbiAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZW1haWwnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG5cclxuICBpZiAobW9iaWxlTnVtYmVyLnRyaW0oKT09XCJcIilcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3Jvbmdtb2JpbGUnKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ21vYmlsZScpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5DT05UQUNUX05VTUJFUl9FTVBUWTtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuXHJcbiAgfWVsc2UgaWYgKG1vYmlsZU51bWJlci5zZWFyY2goL14oMDB8XFwrKShbMC05XXsyfSlbIF0/KFswLTldezN9KVsgXT8oWzAtOV17NH0pWyBdPyhbMC05XXszfSkkLykgPT0gLTEpIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ21vYmlsZScpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbW9iaWxlJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkNPTlRBQ1RfTlVNQkVSX0lOVkFMSUQ7XHJcbiAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgfWVsc2V7XHJcbiAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbW9iaWxlJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIH1cclxuICByZXR1cm4gIWhhc0Vycm9yO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVzZXREb25vcigpe1xyXG4gIGRvY3VtZW50LmZvcm1Eb25vci5maXJzdE5hbWUudmFsdWUgPSBcIlwiO1xyXG4gIGRvY3VtZW50LmZvcm1Eb25vci5sYXN0TmFtZS52YWx1ZT0gXCJcIjtcclxuICBkb2N1bWVudC5mb3JtRG9ub3IuZW1haWwudmFsdWUgPSBcIlwiO1xyXG4gIGRvY3VtZW50LmZvcm1Eb25vci5tb2JpbGVOdW1iZXIudmFsdWU9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZm9ybURvbm9yLmJsb29kR3JvdXAudmFsdWU9IFwiQStcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdmbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdsbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdlbWFpbCcpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3Jvbmdtb2JpbGUnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGREb25vckFjdGlvbihsYXQsbG9uLGFkZHJlc3Msdmlldyl7XHJcblxyXG4gIGlmKFZhbGlkYXRlQW5kU3VibWl0RG9ub3IoKSl7XHJcbiAgICB2YXIgZmlyc3ROYW1lID0gZG9jdW1lbnQuZm9ybURvbm9yLmZpcnN0TmFtZS52YWx1ZTtcclxuICAgIHZhciBsYXN0TmFtZSA9IGRvY3VtZW50LmZvcm1Eb25vci5sYXN0TmFtZS52YWx1ZTtcclxuICAgIHZhciBlbWFpbCA9IGRvY3VtZW50LmZvcm1Eb25vci5lbWFpbC52YWx1ZTtcclxuICAgIHZhciBtb2JpbGVOdW1iZXIgPSBkb2N1bWVudC5mb3JtRG9ub3IubW9iaWxlTnVtYmVyLnZhbHVlO1xyXG4gICAgdmFyIGJsb29kR3JvdXAgPSBkb2N1bWVudC5mb3JtRG9ub3IuYmxvb2RHcm91cC52YWx1ZTtcclxuICAgIGxldCBkb25vciA9IHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdE5hbWU6IGZpcnN0TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0TmFtZTogbGFzdE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWxBZGRyZXNzOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICBtb2JpbGVOdW1iZXI6IG1vYmlsZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogbGF0LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogbG9uLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGRlZmF1bHQvZHVtbXkgaXAgYWRkcmVzcyBpcyBzZW50LCBjbGllbnQncyBpcCBpcyByZWNvcmRlZCBvbiBzZXJ2ZXIgc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgIGlwQWRkcmVzczogJzE5Mi4xNjguMS4xJyxcclxuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBhZGRyZXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIGJsb29kR3JvdXA6IGJsb29kR3JvdXBcclxuICAgICAgICAgICAgICAgICAgfTtcclxuICAgIGFkZERvbm9yKGRvbm9yLHN1Y2Nlc3NDYWxsQmFjayk7XHJcbiAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbEJhY2socmVzcG9uc2VEb25vcil7XHJcbiAgICAgICAgdmlldy5wb3B1cC50aXRsZSA9IHN0cmluZ0NvbnN0YW50cy5BRERfRE9OT1JfU1VDQ0VTU1xyXG4gICAgICAgIHZpZXcucG9wdXAuY29udGVudCA9IGBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGlkPSBcImRvbm9ySW5mb3JtYXRpb25cIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPk5hbWUgOiA8Yj48aT4ke3Jlc3BvbnNlRG9ub3IuZmlyc3ROYW1lfSAke3Jlc3BvbnNlRG9ub3IubGFzdE5hbWV9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+Qmxvb2QgZ3JvdXAgOiA8Yj48aT4ke3Jlc3BvbnNlRG9ub3IuYmxvb2RHcm91cH08L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5FbWFpbCA6IDxiPjxpPiR7cmVzcG9uc2VEb25vci5lbWFpbEFkZHJlc3N9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+Q29udGFjdCBOdW1iZXIgOiA8Yj48aT4gJHtyZXNwb25zZURvbm9yLm1vYmlsZU51bWJlcn08L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5BZGRyZXNzIDogPGI+PGk+ICR7cmVzcG9uc2VEb25vci5hZGRyZXNzfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHtzdHJpbmdDb25zdGFudHMuRURJVF9ET05PUl9VUkx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9JHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0fS8ke3Jlc3BvbnNlRG9ub3IuX2lkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9LyR7cmVzcG9uc2VEb25vci5faWR9IDwvYT5gO1xyXG4gICAgICAgIHZpZXcucG9wdXAuYWN0aW9ucyA9IFtdO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGVkaXREb25vckFjdGlvbihkb25vckVkaXRhYmxlLHZpZXcpe1xyXG4gIGlmKFZhbGlkYXRlQW5kU3VibWl0RG9ub3IoKSl7XHJcbiAgICAgIGxldCBkb25vciA9IGRvbm9yRWRpdGFibGU7XHJcbiAgICAgIGRvbm9yLmZpcnN0TmFtZSA9IGRvY3VtZW50LmZvcm1Eb25vci5maXJzdE5hbWUudmFsdWU7XHJcbiAgICAgIGRvbm9yLmxhc3ROYW1lID0gZG9jdW1lbnQuZm9ybURvbm9yLmxhc3ROYW1lLnZhbHVlO1xyXG4gICAgICBkb25vci5lbWFpbEFkZHJlc3MgPSBkb2N1bWVudC5mb3JtRG9ub3IuZW1haWwudmFsdWU7XHJcbiAgICAgIGRvbm9yLm1vYmlsZU51bWJlciA9IGRvY3VtZW50LmZvcm1Eb25vci5tb2JpbGVOdW1iZXIudmFsdWU7XHJcbiAgICAgIGRvbm9yLmJsb29kR3JvdXAgPSBkb2N1bWVudC5mb3JtRG9ub3IuYmxvb2RHcm91cC52YWx1ZTtcclxuICAgICAgdXBkYXRlRG9ub3IoZG9ub3Isc3VjY2Vzc0NhbGxCYWNrKTtcclxuICAgICAgZnVuY3Rpb24gc3VjY2Vzc0NhbGxCYWNrKHJlc3BvbnNlRG9ub3Ipe1xyXG4gICAgICAgICAgdmlldy5wb3B1cC50aXRsZSA9IHN0cmluZ0NvbnN0YW50cy5FRElUX0RPTk9SX1NVQ0NFU1M7XHJcbiAgICAgICAgICB2aWV3LnBvcHVwLmNvbnRlbnQgPSBgPHVsIGlkPSBcImRvbm9ySW5mb3JtYXRpb25cIiBjbGFzcz1cImxpc3QtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+TmFtZSA6IDxiPjxpPiR7cmVzcG9uc2VEb25vci5maXJzdE5hbWV9ICR7cmVzcG9uc2VEb25vci5sYXN0TmFtZX08L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkJsb29kIGdyb3VwIDogPGI+PGk+JHtyZXNwb25zZURvbm9yLmJsb29kR3JvdXB9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5FbWFpbCA6IDxiPjxpPiR7cmVzcG9uc2VEb25vci5lbWFpbEFkZHJlc3N9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5Db250YWN0IE51bWJlciA6IDxiPjxpPiAke3Jlc3BvbnNlRG9ub3IubW9iaWxlTnVtYmVyfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+QWRkcmVzcyA6IDxiPjxpPiAke3Jlc3BvbnNlRG9ub3IuYWRkcmVzc308L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3N0cmluZ0NvbnN0YW50cy5FRElUX0RPTk9SX1VSTH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPSR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0vJHtyZXNwb25zZURvbm9yLl9pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9LyR7cmVzcG9uc2VEb25vci5faWR9IDwvYT5gO1xyXG4gICAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVEb25vckFjdGlvbihkb25vcklkLHZpZXcpe1xyXG4gICAgICBkZWxldGVEb25vcihkb25vcklkLCBzdWNjZXNzQ2FsbEJhY2spO1xyXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbEJhY2socmVzcG9uc2VEb25vcil7XHJcbiAgICAgICAgICB2aWV3LnBvcHVwLnRpdGxlID0gc3RyaW5nQ29uc3RhbnRzLkRFTEVURV9ET05PUl9TVUNDRVNTO1xyXG4gICAgICAgICAgdmlldy5wb3B1cC5jb250ZW50ID0gXCJcIjtcclxuICAgICAgICAgIHZpZXcucG9wdXAuYWN0aW9ucyA9IFtdO1xyXG4gICAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEJsb29kR3JvdXBJY29uKGRvbm9yKXtcclxuICBsZXQgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcIlwiO1xyXG4gIHN3aXRjaChkb25vci5ibG9vZEdyb3VwKSB7XHJcbiAgICBjYXNlICdBKyc6XHJcbiAgICAgIHN5bWJvbEltYWdlU291cmNlID0gXCJwdWJsaWMvaW1hZ2VzL2FwbHVzLnBuZ1wiO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ0IrJzpcclxuICAgICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcInB1YmxpYy9pbWFnZXMvYnBsdXMucG5nXCI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnQUIrJzpcclxuICAgICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcInB1YmxpYy9pbWFnZXMvYWJwbHVzLnBuZ1wiO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ08rJzpcclxuICAgICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcInB1YmxpYy9pbWFnZXMvb3BsdXMucG5nXCI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnQS0nOlxyXG4gICAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IFwicHVibGljL2ltYWdlcy9hbWludXMucG5nXCI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnQi0nOlxyXG4gICAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IFwicHVibGljL2ltYWdlcy9ibWludXMucG5nXCI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnQUItJzpcclxuICAgICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcInB1YmxpYy9pbWFnZXMvYWJtaW51cy5wbmdcIjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdPLSc6XHJcbiAgICAgIHN5bWJvbEltYWdlU291cmNlID0gXCJwdWJsaWMvaW1hZ2VzL29taW51cy5wbmdcIjtcclxuICAgICAgYnJlYWs7XHJcbiAgfVxyXG4gIHJldHVybiBzeW1ib2xJbWFnZVNvdXJjZTtcclxufVxyXG4iXX0=