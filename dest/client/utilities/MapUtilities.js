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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxpdGllc1xcTWFwVXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUdyYXBoaWNGb3JEb25vciIsInNldEluaXRpYWxNYXBWaWV3IiwibmF2aWdhdGVUb0N1cnJlbnRMb2NhdGlvbiIsImdldFBvcHVwVGVtcGxhdGVGb3JEb25vckluZm9ybWF0aW9uIiwiZ2V0UG9wdXBUZW1wbGF0ZUZvckFkZERvbm9yIiwiVmFsaWRhdGVBbmRTdWJtaXREb25vciIsInJlc2V0RG9ub3IiLCJhZGREb25vckFjdGlvbiIsImVkaXREb25vckFjdGlvbiIsImRlbGV0ZURvbm9yQWN0aW9uIiwiYXBwQ29uc3RhbnRzIiwic3RyaW5nQ29uc3RhbnRzIiwicG9wdXBBY3Rpb25zIiwiZG9ub3IiLCJncmFwaGljIiwic3ltYm9sSW1hZ2VTb3VyY2UiLCJzaG93Q29udGFjdEluZm8iLCJ0aXRsZSIsImlkIiwiY2xhc3NOYW1lIiwiYXR0cmlidXRlcyIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiYmxvb2RHcm91cCIsImFkZHJlc3MiLCJlbWFpbEFkZHJlc3MiLCJtb2JpbGVOdW1iZXIiLCJnZW9tZXRyeSIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiZ2V0Qmxvb2RHcm91cEljb24iLCJzeW1ib2wiLCJ1cmwiLCJ3aWR0aCIsImhlaWdodCIsInBvcHVwVGVtcGxhdGUiLCJtYXBSZWYiLCJkb25vckVkaXRhYmxlIiwibGF0IiwibG9uIiwibWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIiLCJiZWNvbWVEb25vckFjdGlvbiIsInZhbGlkYXRlQW5kU3VibWl0RG9ub3JBY3Rpb24iLCJyZXNldERvbm9yQWN0aW9uIiwibWFwMkQiLCJiYXNlbWFwIiwidmlldyIsImNvbnRhaW5lciIsImZpbmRET01Ob2RlIiwibWFwIiwiY2VudGVyIiwiREVGQVVMVF9MT0NBVElPTiIsInpvb20iLCJERUZBVUxUX1pPT01fTEVWRUwiLCJwYWRkaW5nIiwibGVmdCIsInVpIiwiY29tcG9uZW50cyIsInNlYXJjaFdpZGdldCIsInpvb21XaWRnZXQiLCJsb2NhdGVXaWRnZXQiLCJncmFwaGljc0xheWVyIiwidGhlbiIsImFkZCIsImdlb2dyYXBoaWNFeHRlbnQiLCJ3ZWJNZXJjYXRvclRvR2VvZ3JhcGhpYyIsImV4dGVudCIsInhtaW4iLCJ4bWF4IiwieW1heCIsInltaW4iLCJ3YXRjaCIsIm9uIiwiZXZ0IiwicG9wdXAiLCJhY3Rpb25zIiwiaGl0VGVzdCIsInNjcmVlblBvaW50IiwicmVzcG9uc2UiLCJyZXN1bHRzIiwibWFwUG9pbnQiLCJsb2NhdGlvbiIsImNvbnRlbnQiLCJwdXNoIiwidmlzaWJsZSIsImRvY2tFbmFibGVkIiwibG9jYXRvclRhc2siLCJMT0NBVE9SX1VSTCIsImxvY2F0aW9uVG9BZGRyZXNzIiwiTWF0Y2hfYWRkciIsIm90aGVyd2lzZSIsImVyciIsIk5PX0FERFJFU1NfRk9VTkQiLCJyZXN1bHQiLCJuYW1lIiwiZmVhdHVyZSIsInBvc2l0aW9uIiwiY29vcmRzIiwiYWN0aW9uIiwiYWRkRG9ub3JGb3JtIiwiRE9DS19QT1BVUCIsIm5ld1ZhbCIsImVtcHR5IiwibmF2aWdhdG9yIiwiZ2VvbG9jYXRpb24iLCJnZXRDdXJyZW50UG9zaXRpb24iLCJjdXJyZW50TG9jYXRpb24iLCJnb1RvIiwiZXJyb3IiLCJhbGVydCIsIm1lc3NhZ2UiLCJHRU9fTE9DQVRJT05fTk9UX1NVUFBPUlRFRCIsImRvY3VtZW50IiwiZm9ybURvbm9yIiwidmFsdWUiLCJlbWFpbCIsImhhc0Vycm9yIiwidHJpbSIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJkaXNwbGF5IiwiaW5uZXJIVE1MIiwiRklSU1RfTkFNRV9FTVBUWSIsImxlbmd0aCIsIkZJUlNUX05BTUVfTUFYX0xFTkdUSCIsInRlc3QiLCJGSVJTVF9OQU1FX0FMUEhBX05VTUVSSUMiLCJMQVNUX05BTUVfRU1QVFkiLCJMQVNUX05BTUVfTUFYX0xFTkdUSCIsIkxBU1RfTkFNRV9BTFBIQV9OVU1FUklDIiwiRU1BSUxfQUREUkVTU19FTVBUWSIsInNlYXJjaCIsIkVNQUlMX0FERFJFU1NfSU5WQUxJRCIsIkNPTlRBQ1RfTlVNQkVSX0VNUFRZIiwiQ09OVEFDVF9OVU1CRVJfSU5WQUxJRCIsInN1Y2Nlc3NDYWxsQmFjayIsInJlc3BvbnNlRG9ub3IiLCJBRERfRE9OT1JfU1VDQ0VTUyIsIkVESVRfRE9OT1JfVVJMIiwid2luZG93IiwicHJvdG9jb2wiLCJob3N0IiwiX2lkIiwiaXBBZGRyZXNzIiwiRURJVF9ET05PUl9TVUNDRVNTIiwiZG9ub3JJZCIsIkRFTEVURV9ET05PUl9TVUNDRVNTIl0sIm1hcHBpbmdzIjoiOzs7Ozs7VUEwQmdCQSxxQixHQUFBQSxxQjtVQW9DQUMsaUIsR0FBQUEsaUI7VUFzS0FDLHlCLEdBQUFBLHlCO1VBd0JBQyxtQyxHQUFBQSxtQztVQWdCQUMsMkIsR0FBQUEsMkI7VUF3RUFDLHNCLEdBQUFBLHNCO1VBNkVBQyxVLEdBQUFBLFU7VUFZQUMsYyxHQUFBQSxjO1VBdUNBQyxlLEdBQUFBLGU7VUEwQkFDLGlCLEdBQUFBLGlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQTVkSkMsWTs7TUFDQUMsZTs7TUFDQUMsWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS1o7QUFDTyxXQUFTWixxQkFBVCxDQUFnQ2EsS0FBaEMsRUFBc0M7QUFDekMsUUFBSUMsVUFBVSx1QkFBZDtBQUNBLFFBQUlDLDBCQUFKO0FBQ0EsUUFBTUMsa0JBQWtCO0FBQ3RCO0FBQ0FDLGFBQU8sc0JBRmU7QUFHdEI7QUFDQUMsVUFBSSxpQkFKa0I7QUFLdEI7QUFDQUMsaUJBQVc7QUFOVyxLQUF4QjtBQVFBTCxZQUFRTSxVQUFSLEdBQXFCLEVBQUUsV0FBWVAsTUFBTUssRUFBcEI7QUFDRSxjQUFTTCxNQUFNUSxTQUFOLEdBQWtCLEdBQWxCLEdBQXdCUixNQUFNUyxRQUR6QztBQUVFLG9CQUFlVCxNQUFNVSxVQUZ2QjtBQUdFLGlCQUFZVixNQUFNVyxPQUhwQjtBQUlFLHNCQUFpQlgsTUFBTVksWUFKekI7QUFLRSxzQkFBaUJaLE1B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Q0g7QUFDTjs7QUFFRCxXQUFTN0MsaUJBQVQsQ0FBMkJqQixLQUEzQixFQUFpQztBQUMvQixRQUFJRSxvQkFBb0IsRUFBeEI7QUFDQSxZQUFPRixNQUFNVSxVQUFiO0FBQ0UsV0FBSyxJQUFMO0FBQ0VSLDRCQUFvQix5QkFBcEI7QUFDQTtBQUNGLFdBQUssSUFBTDtBQUNFQSw0QkFBb0IseUJBQXBCO0FBQ0E7QUFDRixXQUFLLEtBQUw7QUFDRUEsNEJBQW9CLDBCQUFwQjtBQUNBO0FBQ0YsV0FBSyxJQUFMO0FBQ0VBLDRCQUFvQix5QkFBcEI7QUFDQTtBQUNGLFdBQUssSUFBTDtBQUNFQSw0QkFBb0IsMEJBQXBCO0FBQ0E7QUFDRixXQUFLLElBQUw7QUFDRUEsNEJBQW9CLDBCQUFwQjtBQUNBO0FBQ0YsV0FBSyxLQUFMO0FBQ0VBLDRCQUFvQiwyQkFBcEI7QUFDQTtBQUNGLFdBQUssSUFBTDtBQUNFQSw0QkFBb0IsMEJBQXBCO0FBQ0E7QUF4Qko7QUEwQkEsV0FBT0EsaUJBQVA7QUFDRCIsImZpbGUiOiJ1dGlsaXRpZXNcXE1hcFV0aWxpdGllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBHcmFwaGljIGZyb20gJ2VzcmkvR3JhcGhpYyc7XHJcbmltcG9ydCBQb2ludCBmcm9tICdlc3JpL2dlb21ldHJ5L1BvaW50JztcclxuaW1wb3J0IExvY2F0b3IgZnJvbSAnZXNyaS90YXNrcy9Mb2NhdG9yJztcclxuaW1wb3J0IFBvcHVwVGVtcGxhdGUgZnJvbSAnZXNyaS9Qb3B1cFRlbXBsYXRlJztcclxuaW1wb3J0IFNpbXBsZU1hcmtlclN5bWJvbCBmcm9tICAnZXNyaS9zeW1ib2xzL1NpbXBsZU1hcmtlclN5bWJvbCc7XHJcbmltcG9ydCBQaWN0dXJlTWFya2VyU3ltYm9sIGZyb20gJ2Vzcmkvc3ltYm9scy9QaWN0dXJlTWFya2VyU3ltYm9sJztcclxuaW1wb3J0IHN0b3JlIGZyb20gJ2FwcC9zdG9yZSdcclxuaW1wb3J0IHsgc2V0SW5pdGlhbFZpZXcsIHNldEluaXRpYWxHcmFwaGljc0xheWVyIH0gZnJvbSAnYXBwL2FjdGlvbnMvZG9ub3JBY3Rpb25zJ1xyXG5pbXBvcnQgeyBnZXREb25vcnMsIGFkZERvbm9yLCBkZWxldGVEb25vciwgdXBkYXRlRG9ub3IgfSBmcm9tICdhcHAvYXBpL2Rvbm9yc0FQSSdcclxuXHJcbmltcG9ydCBNYXAgZnJvbSBcImVzcmkvTWFwXCJcclxuaW1wb3J0IE1hcFZpZXcgZnJvbSBcImVzcmkvdmlld3MvTWFwVmlld1wiXHJcbmltcG9ydCBab29tIGZyb20gJ2Vzcmkvd2lkZ2V0cy9ab29tJ1xyXG5pbXBvcnQgTG9jYXRlIGZyb20gJ2Vzcmkvd2lkZ2V0cy9Mb2NhdGUnXHJcbmltcG9ydCBTZWFyY2ggZnJvbSAnZXNyaS93aWRnZXRzL1NlYXJjaCdcclxuaW1wb3J0IHdhdGNoVXRpbHMgZnJvbSAnZXNyaS9jb3JlL3dhdGNoVXRpbHMnXHJcbmltcG9ydCBHcmFwaGljc0xheWVyIGZyb20gJ2VzcmkvbGF5ZXJzL0dyYXBoaWNzTGF5ZXInXHJcbmltcG9ydCB3ZWJNZXJjYXRvclV0aWxzIGZyb20gJ2VzcmkvZ2VvbWV0cnkvc3VwcG9ydC93ZWJNZXJjYXRvclV0aWxzJ1xyXG5pbXBvcnQgKiBhcyBhcHBDb25zdGFudHMgZnJvbSAnYXBwL3V0aWxpdGllcy9jb25zdGFudHMnXHJcbmltcG9ydCAqIGFzIHN0cmluZ0NvbnN0YW50cyBmcm9tICdhcHAvdXRpbGl0aWVzL3N0cmluZ0NvbnN0YW50cydcclxuaW1wb3J0ICogYXMgcG9wdXBBY3Rpb25zIGZyb20gJ2FwcC91dGlsaXRpZXMvcG9wdXBBY3Rpb25zJ1xyXG5cclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuXHJcblxyXG4vLyBDcmVhdGVzIEdycGFoaWMoaWNvbikgZm9yIERvbm9yXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVHcmFwaGljRm9yRG9ub3IgKGRvbm9yKXtcclxuICAgIGxldCBncmFwaGljID0gbmV3IEdyYXBoaWMoKTtcclxuICAgIGxldCBzeW1ib2xJbWFnZVNvdXJjZTtcclxuICAgIGNvbnN0IHNob3dDb250YWN0SW5mbyA9IHtcclxuICAgICAgLy8gVGhpcyB0ZXh0IGlzIGRpc3BsYXllZCBhcyBhIHRvb2x0aXBcclxuICAgICAgdGl0bGU6IFwiU2hvdyBDb250YWN0IERldGFpbHNcIixcclxuICAgICAgLy8gVGhlIElEIGJ5IHdoaWNoIHRvIHJlZmVyZW5jZSB0aGUgYWN0aW9uIGluIHRoZSBldmVudCBoYW5kbGVyXHJcbiAgICAgIGlkOiBcInNob3dDb250YWN0SW5mb1wiLFxyXG4gICAgICAvLyBTZXRzIHRoZSBpY29uIGZvbnQgdXNlZCB0byBzdHlsZSB0aGUgYWN0aW9uIGJ1dHRvblxyXG4gICAgICBjbGFzc05hbWU6IFwiZXNyaS1pY29uLXpvb20tb3V0LW1hZ25pZnlpbmctZ2xhc3NcIlxyXG4gICAgfTtcclxuICAgIGdyYXBoaWMuYXR0cmlidXRlcyA9IHsgXCJkb25vcklkXCIgOiBkb25vci5pZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCIgOiBkb25vci5maXJzdE5hbWUgKyAnICcgKyBkb25vci5sYXN0TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJibG9vZEdyb3VwXCIgOiBkb25vci5ibG9vZEdyb3VwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBcImFkZHJlc3NcIiA6IGRvbm9yLmFkZHJlc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW1haWxBZGRyZXNzXCIgOiBkb25vci5lbWFpbEFkZHJlc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibW9iaWxlTnVtYmVyXCIgOiBkb25vci5tb2JpbGVOdW1iZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICBncmFwaGljLmdlb21ldHJ5ID0gbmV3IFBvaW50KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IGRvbm9yLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogZG9ub3IubGF0aXR1ZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IGdldEJsb29kR3JvdXBJY29uKGRvbm9yKTtcclxuICAgIGdyYXBoaWMuc3ltYm9sID0gbmV3IFBpY3R1cmVNYXJrZXJTeW1ib2woe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogc3ltYm9sSW1hZ2VTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMjhweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIzM3B4XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICBncmFwaGljLnBvcHVwVGVtcGxhdGUgID0gbmV3IFBvcHVwVGVtcGxhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0aXRsZVwiIDogXCJCbG9vZCBEb25vciBEZXRhaWxzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbnRlbnRcIiA6IGdldFBvcHVwVGVtcGxhdGVGb3JEb25vckluZm9ybWF0aW9uKGRvbm9yKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICByZXR1cm4gZ3JhcGhpYztcclxufVxyXG5cclxuLy8gU2V0cyB0aGUgaW5pdGlhbCBNYXBWaWV3LiBBdHRhY2hlcyB0aGUgZXZlbnRzIHRvIHdhdGNoLiBTZXRzIHRoZSBVSSB3aWRnZXRzIHRvIGJlIGRpc3BsYXllZCBvbiBNYXAuXHJcbmV4cG9ydCBmdW5jdGlvbiBzZXRJbml0aWFsTWFwVmlldyhtYXBSZWYsIGRvbm9yRWRpdGFibGUpe1xyXG5cclxuICBsZXQgbGF0ID0gMDtcclxuICBsZXQgbG9uID0gMDtcclxuICBsZXQgYWRkcmVzcyA9ICcnO1xyXG4gIGxldCBtYXBWaWV3QW5kR3JhcGhpY3NMYXllciA9IHt9O1xyXG5cclxuICBjb25zdCBiZWNvbWVEb25vckFjdGlvbiA9IHBvcHVwQWN0aW9ucy5iZWNvbWVEb25vckFjdGlvbjtcclxuICBjb25zdCB2YWxpZGF0ZUFuZFN1Ym1pdERvbm9yQWN0aW9uID0gcG9wdXBBY3Rpb25zLnZhbGlkYXRlQW5kU3VibWl0RG9ub3JBY3Rpb247XHJcbiAgY29uc3QgcmVzZXREb25vckFjdGlvbiA9IHBvcHVwQWN0aW9ucy5yZXNldERvbm9yQWN0aW9uO1xyXG5cclxuICBjb25zdCBtYXAyRCA9IG5ldyBNYXAoe1xyXG4gICAgICBiYXNlbWFwOiBcInN0cmVldHNcIlxyXG4gIH0pO1xyXG4gIGNvbnN0IHZpZXcgPSBuZXcgTWFwVmlldyh7XHJcbiAgICAgIGNvbnRhaW5lcjogUmVhY3RET00uZmluZERPTU5vZGUobWFwUmVmKSxcclxuICAgICAgbWFwOiBtYXAyRCxcclxuICAgICAgY2VudGVyOiBhcHBDb25zdGFudHMuREVGQVVMVF9MT0NBVElPTixcclxuICAgICAgem9vbTogYXBwQ29uc3RhbnRzLkRFRkFVTFRfWk9PTV9MRVZFTCxcclxuICAgICAgcGFkZGluZzoge1xyXG4gICAgICAgIGxlZnQ6IDEyMCAvLyBTYW1lIHZhbHVlIGFzIHRoZSAjc2lkZWJhciB3aWR0aCBpbiBDU1NcclxuICAgICAgfSxcclxuICAgICAgdWk6IHtcclxuICAgICAgICAgICAgY29tcG9uZW50czogW10gLy8gZm9yIGN1c3RvbSBVSSwgZW1wdHkgdGhlIGRlZmF1bHQgVUkgY29tcG9uZW50c1xyXG4gICAgICAgICAgfVxyXG4gIH0pO1xyXG4gIC8vIFVJIGNvbXBvbmVudHNcclxuICBjb25zdCBzZWFyY2hXaWRnZXQgPSBuZXcgU2VhcmNoKHtcclxuICAgIHZpZXc6IHZpZXdcclxuICB9KTtcclxuICBjb25zdCB6b29tV2lkZ2V0ID0gbmV3IFpvb20oe1xyXG4gICAgdmlldzogdmlld1xyXG4gIH0pO1xyXG4gIGNvbnN0IGxvY2F0ZVdpZGdldCA9IG5ldyBMb2NhdGUoe1xyXG4gICAgdmlldzogdmlld1xyXG4gIH0pO1xyXG4gIC8vR3JhcGhpY3MgTGF5ZXJcclxuICBjb25zdCBncmFwaGljc0xheWVyID0gbmV3IEdyYXBoaWNzTGF5ZXIoe2lkIDogJ2Jsb29kRG9ub3JzTGF5ZXInfSk7XHJcblxyXG4gIHZpZXcudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgbmF2aWdhdGVUb0N1cnJlbnRMb2NhdGlvbih2aWV3KVxyXG4gICAgICBtYXAyRC5hZGQoZ3JhcGhpY3NMYXllcik7XHJcbiAgICAgIGxldCBnZW9ncmFwaGljRXh0ZW50ID0gd2ViTWVyY2F0b3JVdGlscy53ZWJNZXJjYXRvclRvR2VvZ3JhcGhpYyh2aWV3LmV4dGVudCk7XHJcbiAgICAgIGlmKGdlb2dyYXBoaWNFeHRlbnQueG1pbiAmJiBnZW9ncmFwaGljRXh0ZW50LnhtYXggJiYgZ2VvZ3JhcGhpY0V4dGVudC55bWF4ICYmIGdlb2dyYXBoaWNFeHRlbnQueW1pbil7XHJcbiAgICAgICAgZ2V0RG9ub3JzKGdlb2dyYXBoaWNFeHRlbnQpO1xyXG4gICAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHZpZXcud2F0Y2goJ2V4dGVudCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCBnZW9ncmFwaGljRXh0ZW50ID0gd2ViTWVyY2F0b3JVdGlscy53ZWJNZXJjYXRvclRvR2VvZ3JhcGhpYyh2aWV3LmV4dGVudCk7XHJcbiAgICAgIGlmKGdlb2dyYXBoaWNFeHRlbnQueG1pbiAmJiBnZW9ncmFwaGljRXh0ZW50LnhtYXggJiYgZ2VvZ3JhcGhpY0V4dGVudC55bWF4ICYmIGdlb2dyYXBoaWNFeHRlbnQueW1pbil7XHJcbiAgICAgICAgZ2V0RG9ub3JzKGdlb2dyYXBoaWNFeHRlbnQpO1xyXG4gICAgICB9XHJcbiAgfSlcclxuXHJcbiAgdmlldy5vbignY2xpY2snLCAoZXZ0KSA9PiB7XHJcbiAgICB2aWV3LnBvcHVwLmFjdGlvbnMgPSBbXTtcclxuICAgIHZpZXcuaGl0VGVzdChldnQuc2NyZWVuUG9pbnQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICBpZihyZXNwb25zZSAmJiByZXNwb25zZS5yZXN1bHRzWzBdICYmIHJlc3BvbnNlLnJlc3VsdHNbMF0uZ3JhcGhpYyl7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBsYXQgPSBldnQubWFwUG9pbnQubGF0aXR1ZGU7XHJcbiAgICAgICAgbG9uID0gZXZ0Lm1hcFBvaW50LmxvbmdpdHVkZTtcclxuXHJcbiAgICAgICAgdmlldy5wb3B1cC5sb2NhdGlvbiA9IGV2dC5tYXBQb2ludDtcclxuICAgICAgICB2aWV3LnBvcHVwLnRpdGxlID0gXCJMb2NhdGlvbiBkZXRhaWxzIVwiO1xyXG4gICAgICAgIHZpZXcucG9wdXAuY29udGVudCA9IFwiLi4uXCI7XHJcbiAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zLnB1c2goYmVjb21lRG9ub3JBY3Rpb24pO1xyXG4gICAgICAgIHZpZXcucG9wdXAudmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgdmlldy5wb3B1cC5kb2NrRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBsb2NhdG9yVGFzayA9IG5ldyBMb2NhdG9yKHtcclxuICAgICAgICAgICB1cmw6IGFwcENvbnN0YW50cy5MT0NBVE9SX1VSTFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBsb2NhdG9yVGFzay5sb2NhdGlvblRvQWRkcmVzcyhldnQubWFwUG9pbnQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgLy8gSWYgYW4gYWRkcmVzcyBpcyBzdWNjZXNzZnVsbHkgZm91bmQsIHByaW50IGl0IHRvIHRoZSBwb3B1cCdzIGNvbnRlbnRcclxuICAgICAgICAgICAgYWRkcmVzcyA9IHJlc3BvbnNlLmFkZHJlc3MuTWF0Y2hfYWRkcjtcclxuICAgICAgICAgICAgdmlldy5wb3B1cC5jb250ZW50ID0gYWRkcmVzcztcclxuICAgICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3M7XHJcbiAgICAgICAgICB9KS5vdGhlcndpc2UoZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBwcm9taXNlIGZhaWxzIGFuZCBubyByZXN1bHQgaXMgZm91bmQsIHByaW50IGEgZ2VuZXJpYyBtZXNzYWdlXHJcbiAgICAgICAgICAgIC8vIHRvIHRoZSBwb3B1cCdzIGNvbnRlbnRcclxuICAgICAgICAgICAgYWRkcmVzcyA9IHN0cmluZ0NvbnN0YW50cy5OT19BRERSRVNTX0ZPVU5EO1xyXG4gICAgICAgICAgICB2aWV3LnBvcHVwLmNvbnRlbnQgPSBzdHJpbmdDb25zdGFudHMuTk9fQUREUkVTU19GT1VORDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgc2VhcmNoV2lkZ2V0Lm9uKFwic2VsZWN0LXJlc3VsdFwiLCBmdW5jdGlvbihldnQpe1xyXG4gICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICB2aWV3LnBvcHVwLmFjdGlvbnMucHVzaChiZWNvbWVEb25vckFjdGlvbik7XHJcbiAgICBhZGRyZXNzID0gZXZ0LnJlc3VsdC5uYW1lO1xyXG4gICAgbGF0ID0gZXZ0LnJlc3VsdC5mZWF0dXJlLmdlb21ldHJ5LmxhdGl0dWRlO1xyXG4gICAgbG9uID0gZXZ0LnJlc3VsdC5mZWF0dXJlLmdlb21ldHJ5LmxvbmdpdHVkZTtcclxuXHJcbiAgfSk7XHJcblxyXG4gIGxvY2F0ZVdpZGdldC5vbihcImxvY2F0ZVwiLCBmdW5jdGlvbihldnQpe1xyXG4gICAgdmlldy5wb3B1cC50aXRsZSA9IFwiWW91ciBjdXJyZW50IGxvY2F0aW9uXCI7XHJcbiAgICB2aWV3LnBvcHVwLmNvbnRlbnQgPSBcIlwiO1xyXG4gICAgdmlldy5wb3B1cC5sb2NhdGlvbiA9IHZpZXcuY2VudGVyO1xyXG4gICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICB2aWV3LnBvcHVwLmFjdGlvbnMucHVzaChiZWNvbWVEb25vckFjdGlvbik7XHJcbiAgICB2aWV3LnBvcHVwLnZpc2libGUgPSB0cnVlO1xyXG4gICAgdmlldy5wb3B1cC5kb2NrRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIGxhdCA9IGV2dC5wb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcbiAgICBsb24gPSBldnQucG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgIGFkZHJlc3MgPSBzdHJpbmdDb25zdGFudHMuTk9fQUREUkVTU19GT1VORDtcclxuXHJcbiAgfSk7XHJcblxyXG4gIHZpZXcucG9wdXAub24oXCJ0cmlnZ2VyLWFjdGlvblwiLCBmdW5jdGlvbihldnQpe1xyXG4gICAgLy8gSWYgdGhlIHpvb20tb3V0IGFjdGlvbiBpcyBjbGlja2VkLCBmaXJlIHRoZSB6b29tT3V0KCkgZnVuY3Rpb25cclxuICAgIGlmKGV2dC5hY3Rpb24uaWQgPT09IFwiYmVjb21lRG9ub3JcIil7XHJcbiAgICAgIGNvbnN0IGFkZERvbm9yRm9ybSA9IGdldFBvcHVwVGVtcGxhdGVGb3JBZGREb25vcigpO1xyXG4gICAgICB2aWV3LnBvcHVwLnRpdGxlID0gc3RyaW5nQ29uc3RhbnRzLkRPQ0tfUE9QVVA7XHJcbiAgICAgIHZpZXcucG9wdXAuY29udGVudCA9IGFkZERvbm9yRm9ybTtcclxuICAgICAgdmlldy5wb3B1cC5kb2NrRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIHZpZXcucG9wdXAuYWN0aW9ucyA9IFtdO1xyXG4gICAgICB2aWV3LnBvcHVwLmFjdGlvbnMucHVzaChyZXNldERvbm9yQWN0aW9uKTtcclxuICAgICAgdmlldy5wb3B1cC5hY3Rpb25zLnB1c2godmFsaWRhdGVBbmRTdWJtaXREb25vckFjdGlvbik7XHJcbiAgICB9ZWxzZSBpZihldnQuYWN0aW9uLmlkID09PSBcImFkZERvbm9yXCIpe1xyXG4gICAgICAgIGFkZERvbm9yQWN0aW9uKGxhdCwgbG9uLCBhZGRyZXNzLCB2aWV3KTtcclxuICAgIH1lbHNlIGlmKGV2dC5hY3Rpb24uaWQgPT09IFwicmVzZXREb25vclwiKXtcclxuICAgICAgICByZXNldERvbm9yKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHZpZXcud2F0Y2goXCJ3aWR0aEJyZWFrcG9pbnRcIiwgZnVuY3Rpb24obmV3VmFsKXtcclxuICAgIGlmIChuZXdWYWwgPT09IFwieHNtYWxsXCIgfHwgbmV3VmFsID09PSBcInNtYWxsXCIpe1xyXG4gICAgICAvLyBjbGVhciB0aGUgdmlldydzIGRlZmF1bHQgVUkgY29tcG9uZW50cyBpZlxyXG4gICAgICAvLyBhcHAgaXMgdXNlZCBvbiBhIG1vYmlsZSBkZXZpY2VcclxuICAgICAgdmlldy51aS5lbXB0eShcImJvdHRvbS1sZWZ0XCIpO1xyXG4gICAgICB2aWV3LnVpLmFkZChzZWFyY2hXaWRnZXQsIFwiYm90dG9tLXJpZ2h0XCIpO1xyXG4gICAgICB2aWV3LnBhZGRpbmcgPSB7XHJcbiAgICAgICAgICBsZWZ0OiAwIC8vIFNhbWUgdmFsdWUgYXMgdGhlICNzaWRlYmFyIHdpZHRoIGluIENTU1xyXG4gICAgICB9O1xyXG4gICAgfWVsc2V7XHJcbiAgICAgIHZpZXcucGFkZGluZyA9IHtcclxuICAgICAgICAgIGxlZnQ6IDEyMCAvLyBTYW1lIHZhbHVlIGFzIHRoZSAjc2lkZWJhciB3aWR0aCBpbiBDU1NcclxuICAgICAgfTtcclxuICAgICAgdmlldy51aS5lbXB0eShcImJvdHRvbS1sZWZ0XCIpO1xyXG4gICAgICB2aWV3LnVpLmFkZCh6b29tV2lkZ2V0LCBcImJvdHRvbS1sZWZ0XCIpO1xyXG4gICAgICB2aWV3LnVpLmFkZChsb2NhdGVXaWRnZXQsIFwiYm90dG9tLWxlZnRcIik7XHJcbiAgICAgIHZpZXcudWkuYWRkKHNlYXJjaFdpZGdldCwgXCJib3R0b20tbGVmdFwiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmlldy51aS5hZGQoem9vbVdpZGdldCwgXCJib3R0b20tbGVmdFwiKTtcclxuICB2aWV3LnVpLmFkZChsb2NhdGVXaWRnZXQsIFwiYm90dG9tLWxlZnRcIik7XHJcbiAgdmlldy51aS5hZGQoc2VhcmNoV2lkZ2V0LCBcImJvdHRvbS1sZWZ0XCIpO1xyXG5cclxuXHJcbiAgbWFwVmlld0FuZEdyYXBoaWNzTGF5ZXIgPSB7IHZpZXcgOiB2aWV3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFwaGljc0xheWVyIDogZ3JhcGhpY3NMYXllclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgcmV0dXJuIG1hcFZpZXdBbmRHcmFwaGljc0xheWVyO1xyXG59XHJcblxyXG5cclxuLy8gTmF2aWdhdGVzIHRvIHRoZSBjdXJyZW50TG9jYXRpb25cclxuZXhwb3J0IGZ1bmN0aW9uIG5hdmlnYXRlVG9DdXJyZW50TG9jYXRpb24odmlldyl7XHJcbiAgICAgICAgaWYgKG5hdmlnYXRvci5nZW9sb2NhdGlvbikge1xyXG4gICAgICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihcclxuICAgICAgICAgICAgICAgICAgICAvLyBTdWNjZXNzIGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24ocG9zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGxhdGl0dWRlID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbG9uZ2l0dWRlID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRMb2NhdGlvbiA9IG5ldyBQb2ludCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGxhdGl0dWRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlldy5nb1RvKGN1cnJlbnRMb2NhdGlvbiwgYXBwQ29uc3RhbnRzLkRFRkFVTFRfWk9PTV9MRVZFTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBPcHRpb25hbCBlcnJvciBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICApO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhbGVydChzdHJpbmdDb25zdGFudHMuR0VPX0xPQ0FUSU9OX05PVF9TVVBQT1JURUQpO1xyXG5cdFx0XHRcdH1cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3B1cFRlbXBsYXRlRm9yRG9ub3JJbmZvcm1hdGlvbihkb25vcil7XHJcbiAgcmV0dXJuIGA8ZGl2PlxyXG4gICAgICAgICAgICA8dWwgaWQ9IFwiZG9ub3JJbmZvcm1hdGlvblwiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgIDxsaSBpZD1cImRvbm9yTmFtZVwiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5OYW1lIDogPGI+PGk+JHtkb25vci5maXJzdE5hbWV9ICR7ZG9ub3IubGFzdE5hbWV9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBpZD1cImRvbm9yQmxvb2RHcm91cFwiIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5CbG9vZCBncm91cCA6IDxiPjxpPiR7ZG9ub3IuYmxvb2RHcm91cH08L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJTaG93SW5mb1wiIG5hbWU9XCJTaG93SW5mb1wiIG9uQ2xpY2s9XCJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG9ub3JDb250YWN0SW5mb3JtYXRpb24nKS5zdHlsZS5kaXNwbGF5PSdibG9jayc7XHJcbiAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ1Nob3dJbmZvJykuc3R5bGUuZGlzcGxheT0nbm9uZSdcIiBjbGFzcz1cImJ0biBidG4taW5mb1wiIHZhbHVlPVwiU2hvdyBDb250YWN0IEluZm9cIi8+XHJcbiAgICAgICAgICAgIDx1bCBpZD1cImRvbm9yQ29udGFjdEluZm9ybWF0aW9uXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIiA+XHJcbiAgICAgICAgICAgICAgPGI+Q29udGFjdCBJbmZvcm1hdGlvbjwvYj5cclxuICAgICAgICAgICAgICA8bGkgaWQ9XCJkb25vckVtYWlsXCIgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkVtYWlsIDogPGI+PGk+JHtkb25vci5lbWFpbEFkZHJlc3N9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaSBpZD1cImRvbm9yUGhvbmVOdW1iZXJcIiBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+Q29udGFjdCBOdW1iZXIgOiA8Yj48aT4gJHtkb25vci5tb2JpbGVOdW1iZXJ9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgIDwvZGl2PmA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRQb3B1cFRlbXBsYXRlRm9yQWRkRG9ub3IoZG9ub3Ipe1xyXG5cclxuICBsZXQgZmlyc3ROYW1lID0gZG9ub3IgJiYgZG9ub3IuZmlyc3ROYW1lIHx8ICcnO1xyXG4gIGxldCBsYXN0TmFtZSA9IGRvbm9yICYmIGRvbm9yLmxhc3ROYW1lIHx8ICcnO1xyXG4gIGxldCBibG9vZEdyb3VwID0gZG9ub3IgJiYgZG9ub3IuYmxvb2RHcm91cCB8fCAnQSsnO1xyXG4gIGxldCBtb2JpbGVOdW1iZXIgPSBkb25vciAmJiBkb25vci5tb2JpbGVOdW1iZXIgfHwgJyc7XHJcbiAgbGV0IGVtYWlsQWRkcmVzcyA9IGRvbm9yICYmIGRvbm9yLmVtYWlsQWRkcmVzcyB8fCAnJztcclxuXHJcbiAgcmV0dXJuIGA8Zm9ybSBuYW1lID0gXCJmb3JtRG9ub3JcIiBjbGFzcz1cImZvcm0taG9yaXpvbnRhbFwiIG9uU3VibWl0PVwiVmFsaWRhdGVBbmRTdWJtaXQoKVwiPlxyXG4gICAgICAgICAgXHQ8ZmllbGRzZXQ+XHJcbiAgICAgICAgICBcdDwhLS0gVGV4dCBpbnB1dC0tPlxyXG4gICAgICAgICAgXHQ8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgXHQgIDxsYWJlbCBjbGFzcz1cImNvbC1tZC00IGNvbnRyb2wtbGFiZWxcIiBmb3I9XCJmaXJzdE5hbWVcIj5GaXJzdCBOYW1lPC9sYWJlbD5cclxuICAgICAgICAgIFx0ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cclxuICAgICAgICAgIFx0ICA8aW5wdXQgaWQ9XCJmaXJzdE5hbWVcIiBuYW1lPVwiZmlyc3ROYW1lXCIgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cIkZpcnN0IE5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1tZFwiIHZhbHVlPSR7Zmlyc3ROYW1lfSA+XHJcbiAgICAgICAgICBcdCAgPHNwYW4gaWQ9XCJ3cm9uZ2ZuYW1lXCIgY2xhc3M9XCJlcnJvciBhbGVydC1kYW5nZXJcIj48L3NwYW4+XHJcbiAgICAgICAgICBcdCAgPC9kaXY+XHJcbiAgICAgICAgICBcdDwvZGl2PlxyXG5cclxuICAgICAgICAgIFx0PCEtLSBUZXh0IGlucHV0LS0+XHJcbiAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICBcdCAgPGxhYmVsIGNsYXNzPVwiY29sLW1kLTQgY29udHJvbC1sYWJlbFwiIGZvcj1cImxhc3ROYW1lXCI+TGFzdCBOYW1lPC9sYWJlbD5cclxuICAgICAgICAgIFx0ICA8ZGl2IGNsYXNzPVwiY29sLW1kLTRcIj5cclxuICAgICAgICAgIFx0ICA8aW5wdXQgaWQ9XCJsYXN0TmFtZVwiIG5hbWU9XCJsYXN0TmFtZVwiIHR5cGU9XCJ0ZXh0XCIgcGxhY2Vob2xkZXI9XCJMYXN0IE5hbWVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1tZFwiIHZhbHVlPSR7bGFzdE5hbWV9ID5cclxuICAgICAgICAgIFx0ICA8c3BhbiBpZD1cIndyb25nbG5hbWVcIiBjbGFzcz1cImVycm9yIGFsZXJ0LWRhbmdlclwiPjwvc3Bhbj5cclxuICAgICAgICAgIFx0ICA8L2Rpdj5cclxuICAgICAgICAgIFx0PC9kaXY+XHJcblxyXG4gICAgICAgICAgXHQ8IS0tIFNlbGVjdCBCbG9vZCBHcm91cCAtLT5cclxuXHJcbiAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICBcdCAgPGxhYmVsIGNsYXNzPVwiY29sLW1kLTQgY29udHJvbC1sYWJlbFwiIGZvcj1cImJsb29kR3JvdXBcIj5CbG9vZCBHcm91cDwvbGFiZWw+XHJcbiAgICAgICAgICBcdCAgPGRpdiBjbGFzcz1cImNvbC1tZC00XCI+XHJcbiAgICAgICAgICBcdFx0PHNlbGVjdCBpZD1cImJsb29kR3JvdXBcIiBuYW1lPVwiYmxvb2RHcm91cFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiQStcIj5BKzwvb3B0aW9uPlxyXG4gICAgICAgICAgXHRcdCAgPG9wdGlvbiB2YWx1ZT1cIkEtXCI+QS08L29wdGlvbj5cclxuICAgICAgICAgIFx0XHQgIDxvcHRpb24gdmFsdWU9XCJCK1wiPkIrPC9vcHRpb24+XHJcbiAgICAgICAgICBcdFx0ICA8b3B0aW9uIHZhbHVlPVwiQi1cIj5CLTwvb3B0aW9uPlxyXG4gICAgICAgICAgXHRcdCAgPG9wdGlvbiB2YWx1ZT1cIkFCK1wiPkFCKzwvb3B0aW9uPlxyXG4gICAgICAgICAgXHRcdCAgPG9wdGlvbiB2YWx1ZT1cIkFCLVwiPkFCLTwvb3B0aW9uPlxyXG4gICAgICAgICAgXHRcdCAgPG9wdGlvbiB2YWx1ZT1cIk8rXCI+Tys8L29wdGlvbj5cclxuICAgICAgICAgIFx0XHQgIDxvcHRpb24gdmFsdWU9XCJPLVwiPk8tPC9vcHRpb24+XHJcbiAgICAgICAgICBcdFx0PC9zZWxlY3Q+XHJcbiAgICAgICAgICBcdCAgPC9kaXY+XHJcbiAgICAgICAgICBcdDwvZGl2PlxyXG4gICAgICAgICAgXHQ8IS0tIFRleHQgaW5wdXQtLT5cclxuICAgICAgICAgIFx0PGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgIFx0ICA8bGFiZWwgY2xhc3M9XCJjb2wtbWQtNCBjb250cm9sLWxhYmVsXCIgZm9yPVwiZW1haWxcIj5FbWFpbDwvbGFiZWw+XHJcbiAgICAgICAgICBcdCAgPGRpdiBjbGFzcz1cImNvbC1tZC01XCI+XHJcbiAgICAgICAgICBcdCAgPGlucHV0IGlkPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiRW1haWxcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1tZFwiIHZhbHVlPSR7ZW1haWxBZGRyZXNzfT5cclxuICAgICAgICAgIFx0ICA8c3BhbiBpZD1cIndyb25nZW1haWxcIiBjbGFzcz1cImVycm9yIGFsZXJ0LWRhbmdlclwiPjwvc3Bhbj5cclxuICAgICAgICAgIFx0ICA8c3BhbiBjbGFzcz1cImhlbHAtYmxvY2tcIj5lZzogYWJjQG1haWwuY29tPC9zcGFuPlxyXG4gICAgICAgICAgXHQgIDwvZGl2PlxyXG4gICAgICAgICAgXHQ8L2Rpdj5cclxuXHJcbiAgICAgICAgICBcdDwhLS0gU2VhcmNoIGlucHV0LS0+XHJcbiAgICAgICAgICBcdDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICBcdCAgPGxhYmVsIGNsYXNzPVwiY29sLW1kLTQgY29udHJvbC1sYWJlbFwiIGZvcj1cIm1vYmlsZU51bWJlclwiPk1vYmlsZTwvbGFiZWw+XHJcbiAgICAgICAgICBcdCAgPGRpdiBjbGFzcz1cImNvbC1tZC01XCI+XHJcbiAgICAgICAgICBcdFx0PGlucHV0IGlkPVwibW9iaWxlTnVtYmVyXCIgbmFtZT1cIm1vYmlsZU51bWJlclwiIHR5cGU9XCJzZWFyY2hcIiBwbGFjZWhvbGRlcj1cIk1vYmlsZSBOdW1iZXJcIiBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1tZFwiIHZhbHVlPSR7bW9iaWxlTnVtYmVyfT5cclxuICAgICAgICAgIFx0XHQ8c3BhbiBpZD1cIndyb25nbW9iaWxlXCIgY2xhc3M9XCJlcnJvciBhbGVydC1kYW5nZXJcIj48L3NwYW4+XHJcbiAgICAgICAgICBcdFx0PHAgY2xhc3M9XCJoZWxwLWJsb2NrXCI+Zm9yIGV4OiAwMFhYIFhYWCBYWFhYIFhYWCBvciArWFggWFhYIFhYWFggWFhYIDwvcD5cclxuICAgICAgICAgIFx0ICA8L2Rpdj5cclxuICAgICAgICAgIFx0PC9kaXY+XHJcblxyXG5cclxuICAgICAgICAgIFx0PC9maWVsZHNldD5cclxuICAgICAgICAgIDwvZm9ybT5gO1xyXG5cclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBWYWxpZGF0ZUFuZFN1Ym1pdERvbm9yKCl7XHJcbiAgLy9lLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgdmFyIGZpcnN0TmFtZSA9IGRvY3VtZW50LmZvcm1Eb25vci5maXJzdE5hbWUudmFsdWU7XHJcbiAgdmFyIGxhc3ROYW1lID0gZG9jdW1lbnQuZm9ybURvbm9yLmxhc3ROYW1lLnZhbHVlO1xyXG4gIHZhciBlbWFpbCA9IGRvY3VtZW50LmZvcm1Eb25vci5lbWFpbC52YWx1ZTtcclxuICB2YXIgbW9iaWxlTnVtYmVyID0gZG9jdW1lbnQuZm9ybURvbm9yLm1vYmlsZU51bWJlci52YWx1ZTtcclxuICB2YXIgYmxvb2RHcm91cCA9IGRvY3VtZW50LmZvcm1Eb25vci5ibG9vZEdyb3VwLnZhbHVlO1xyXG4gIHZhciBoYXNFcnJvciA9IGZhbHNlO1xyXG4gIGlmIChmaXJzdE5hbWUudHJpbSgpPT1cIlwiKVxyXG4gIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2ZuYW1lJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdmbmFtZScpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5GSVJTVF9OQU1FX0VNUFRZO1xyXG4gICAgaGFzRXJyb3IgPSB0cnVlO1xyXG4gIH1cclxuICBlbHNlIGlmIChmaXJzdE5hbWUubGVuZ3RoID4gYXBwQ29uc3RhbnRzLkZJUlNUX05BTUVfTUFYX0xFTkdUSClcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdmbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZm5hbWUnKS5pbm5lckhUTUwgPSBzdHJpbmdDb25zdGFudHMuRklSU1RfTkFNRV9NQVhfTEVOR1RIO1xyXG4gICAgaGFzRXJyb3IgPSB0cnVlO1xyXG4gIH1cclxuICBlbHNlIGlmICgvW15hLXpBLVowLTlcXC1dLy50ZXN0KCBmaXJzdE5hbWUgKSlcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZW1haWwnKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2ZuYW1lJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkZJUlNUX05BTUVfQUxQSEFfTlVNRVJJQztcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9ZWxzZXtcclxuICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdmbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGlmIChsYXN0TmFtZS50cmltKCk9PVwiXCIpXHJcbiAge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbG5hbWUnKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2xuYW1lJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkxBU1RfTkFNRV9FTVBUWTtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9ZWxzZSBpZiAobGFzdE5hbWUubGVuZ3RoID4gYXBwQ29uc3RhbnRzLkxBU1RfTkFNRV9NQVhfTEVOR1RIKVxyXG4gIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2xuYW1lJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdsbmFtZScpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5MQVNUX05BTUVfTUFYX0xFTkdUSDtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9ZWxzZSBpZiAoL1teYS16QS1aMC05XFwtXS8udGVzdCggbGFzdE5hbWUgKSlcclxuICB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdsbmFtZScpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbG5hbWUnKS5pbm5lckhUTUwgPSBzdHJpbmdDb25zdGFudHMuTEFTVF9OQU1FX0FMUEhBX05VTUVSSUM7XHJcbiAgICBoYXNFcnJvciA9IHRydWU7XHJcbiAgfWVsc2V7XHJcbiAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbG5hbWUnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG5cclxuICBpZiAoZW1haWwudHJpbSgpPT1cIlwiKVxyXG4gIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2VtYWlsJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdlbWFpbCcpLmlubmVySFRNTCA9IHN0cmluZ0NvbnN0YW50cy5FTUFJTF9BRERSRVNTX0VNUFRZO1xyXG4gICAgaGFzRXJyb3IgPSB0cnVlO1xyXG4gIH1lbHNlIGlmIChlbWFpbC5zZWFyY2goL15bYS16QS1aXSsoW19cXC4tXT9bYS16QS1aMC05XSspKkBbYS16QS1aMC05XSsoW1xcLi1dP1thLXpBLVowLTldKykqKFxcLlthLXpBLVpdezIsNH0pKyQvKSA9PSAtMSkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nZW1haWwnKS5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmVcIjtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2VtYWlsJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkVNQUlMX0FERFJFU1NfSU5WQUxJRDtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9ZWxzZXtcclxuICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3JvbmdlbWFpbCcpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICB9XHJcblxyXG4gIGlmIChtb2JpbGVOdW1iZXIudHJpbSgpPT1cIlwiKVxyXG4gIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ21vYmlsZScpLnN0eWxlLmRpc3BsYXkgPSBcImlubGluZVwiO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbW9iaWxlJykuaW5uZXJIVE1MID0gc3RyaW5nQ29uc3RhbnRzLkNPTlRBQ1RfTlVNQkVSX0VNUFRZO1xyXG4gICAgaGFzRXJyb3IgPSB0cnVlO1xyXG5cclxuICB9ZWxzZSBpZiAobW9iaWxlTnVtYmVyLnNlYXJjaCgvXigwMHxcXCspKFswLTldezJ9KVsgXT8oWzAtOV17M30pWyBdPyhbMC05XXs0fSlbIF0/KFswLTldezN9KSQvKSA9PSAtMSkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dyb25nbW9iaWxlJykuc3R5bGUuZGlzcGxheSA9IFwiaW5saW5lXCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3Jvbmdtb2JpbGUnKS5pbm5lckhUTUwgPSBzdHJpbmdDb25zdGFudHMuQ09OVEFDVF9OVU1CRVJfSU5WQUxJRDtcclxuICAgIGhhc0Vycm9yID0gdHJ1ZTtcclxuICB9ZWxzZXtcclxuICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3Jvbmdtb2JpbGUnKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgfVxyXG4gIHJldHVybiAhaGFzRXJyb3I7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldERvbm9yKCl7XHJcbiAgZG9jdW1lbnQuZm9ybURvbm9yLmZpcnN0TmFtZS52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZm9ybURvbm9yLmxhc3ROYW1lLnZhbHVlPSBcIlwiO1xyXG4gIGRvY3VtZW50LmZvcm1Eb25vci5lbWFpbC52YWx1ZSA9IFwiXCI7XHJcbiAgZG9jdW1lbnQuZm9ybURvbm9yLm1vYmlsZU51bWJlci52YWx1ZT0gXCJcIjtcclxuICBkb2N1bWVudC5mb3JtRG9ub3IuYmxvb2RHcm91cC52YWx1ZT0gXCJBK1wiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2ZuYW1lJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2xuYW1lJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ2VtYWlsJykuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cm9uZ21vYmlsZScpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZERvbm9yQWN0aW9uKGxhdCxsb24sYWRkcmVzcyx2aWV3KXtcclxuXHJcbiAgaWYoVmFsaWRhdGVBbmRTdWJtaXREb25vcigpKXtcclxuICAgIHZhciBmaXJzdE5hbWUgPSBkb2N1bWVudC5mb3JtRG9ub3IuZmlyc3ROYW1lLnZhbHVlO1xyXG4gICAgdmFyIGxhc3ROYW1lID0gZG9jdW1lbnQuZm9ybURvbm9yLmxhc3ROYW1lLnZhbHVlO1xyXG4gICAgdmFyIGVtYWlsID0gZG9jdW1lbnQuZm9ybURvbm9yLmVtYWlsLnZhbHVlO1xyXG4gICAgdmFyIG1vYmlsZU51bWJlciA9IGRvY3VtZW50LmZvcm1Eb25vci5tb2JpbGVOdW1iZXIudmFsdWU7XHJcbiAgICB2YXIgYmxvb2RHcm91cCA9IGRvY3VtZW50LmZvcm1Eb25vci5ibG9vZEdyb3VwLnZhbHVlO1xyXG4gICAgbGV0IGRvbm9yID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogZmlyc3ROYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3ROYW1lOiBsYXN0TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbEFkZHJlc3M6IGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgICAgIG1vYmlsZU51bWJlcjogbW9iaWxlTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBsYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb24sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdC9kdW1teSBpcCBhZGRyZXNzIGlzIHNlbnQsIGNsaWVudCdzIGlwIGlzIHJlY29yZGVkIG9uIHNlcnZlciBzaWRlXHJcbiAgICAgICAgICAgICAgICAgICAgaXBBZGRyZXNzOiAnMTkyLjE2OC4xLjEnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGFkZHJlc3MsXHJcbiAgICAgICAgICAgICAgICAgICAgYmxvb2RHcm91cDogYmxvb2RHcm91cFxyXG4gICAgICAgICAgICAgICAgICB9O1xyXG4gICAgYWRkRG9ub3IoZG9ub3Isc3VjY2Vzc0NhbGxCYWNrKTtcclxuICAgIGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsQmFjayhyZXNwb25zZURvbm9yKXtcclxuICAgICAgICB2aWV3LnBvcHVwLnRpdGxlID0gc3RyaW5nQ29uc3RhbnRzLkFERF9ET05PUl9TVUNDRVNTXHJcbiAgICAgICAgdmlldy5wb3B1cC5jb250ZW50ID0gYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgaWQ9IFwiZG9ub3JJbmZvcm1hdGlvblwiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+TmFtZSA6IDxiPjxpPiR7cmVzcG9uc2VEb25vci5maXJzdE5hbWV9ICR7cmVzcG9uc2VEb25vci5sYXN0TmFtZX08L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5CbG9vZCBncm91cCA6IDxiPjxpPiR7cmVzcG9uc2VEb25vci5ibG9vZEdyb3VwfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkVtYWlsIDogPGI+PGk+JHtyZXNwb25zZURvbm9yLmVtYWlsQWRkcmVzc308L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5Db250YWN0IE51bWJlciA6IDxiPjxpPiAke3Jlc3BvbnNlRG9ub3IubW9iaWxlTnVtYmVyfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkFkZHJlc3MgOiA8Yj48aT4gJHtyZXNwb25zZURvbm9yLmFkZHJlc3N9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAke3N0cmluZ0NvbnN0YW50cy5FRElUX0RPTk9SX1VSTH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj0ke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9LyR7cmVzcG9uc2VEb25vci5faWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0vJHtyZXNwb25zZURvbm9yLl9pZH0gPC9hPmA7XHJcbiAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZWRpdERvbm9yQWN0aW9uKGRvbm9yRWRpdGFibGUsdmlldyl7XHJcbiAgaWYoVmFsaWRhdGVBbmRTdWJtaXREb25vcigpKXtcclxuICAgICAgbGV0IGRvbm9yID0gZG9ub3JFZGl0YWJsZTtcclxuICAgICAgZG9ub3IuZmlyc3ROYW1lID0gZG9jdW1lbnQuZm9ybURvbm9yLmZpcnN0TmFtZS52YWx1ZTtcclxuICAgICAgZG9ub3IubGFzdE5hbWUgPSBkb2N1bWVudC5mb3JtRG9ub3IubGFzdE5hbWUudmFsdWU7XHJcbiAgICAgIGRvbm9yLmVtYWlsQWRkcmVzcyA9IGRvY3VtZW50LmZvcm1Eb25vci5lbWFpbC52YWx1ZTtcclxuICAgICAgZG9ub3IubW9iaWxlTnVtYmVyID0gZG9jdW1lbnQuZm9ybURvbm9yLm1vYmlsZU51bWJlci52YWx1ZTtcclxuICAgICAgZG9ub3IuYmxvb2RHcm91cCA9IGRvY3VtZW50LmZvcm1Eb25vci5ibG9vZEdyb3VwLnZhbHVlO1xyXG4gICAgICB1cGRhdGVEb25vcihkb25vcixzdWNjZXNzQ2FsbEJhY2spO1xyXG4gICAgICBmdW5jdGlvbiBzdWNjZXNzQ2FsbEJhY2socmVzcG9uc2VEb25vcil7XHJcbiAgICAgICAgICB2aWV3LnBvcHVwLnRpdGxlID0gc3RyaW5nQ29uc3RhbnRzLkVESVRfRE9OT1JfU1VDQ0VTUztcclxuICAgICAgICAgIHZpZXcucG9wdXAuY29udGVudCA9IGA8dWwgaWQ9IFwiZG9ub3JJbmZvcm1hdGlvblwiIGNsYXNzPVwibGlzdC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5OYW1lIDogPGI+PGk+JHtyZXNwb25zZURvbm9yLmZpcnN0TmFtZX0gJHtyZXNwb25zZURvbm9yLmxhc3ROYW1lfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cImxpc3QtZ3JvdXAtaXRlbSBkb25vci1pbmZvXCI+Qmxvb2QgZ3JvdXAgOiA8Yj48aT4ke3Jlc3BvbnNlRG9ub3IuYmxvb2RHcm91cH08L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkVtYWlsIDogPGI+PGk+JHtyZXNwb25zZURvbm9yLmVtYWlsQWRkcmVzc308L2k+PC9iPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJsaXN0LWdyb3VwLWl0ZW0gZG9ub3ItaW5mb1wiPkNvbnRhY3QgTnVtYmVyIDogPGI+PGk+ICR7cmVzcG9uc2VEb25vci5tb2JpbGVOdW1iZXJ9PC9pPjwvYj48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibGlzdC1ncm91cC1pdGVtIGRvbm9yLWluZm9cIj5BZGRyZXNzIDogPGI+PGk+ICR7cmVzcG9uc2VEb25vci5hZGRyZXNzfTwvaT48L2I+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7c3RyaW5nQ29uc3RhbnRzLkVESVRfRE9OT1JfVVJMfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9JHt3aW5kb3cubG9jYXRpb24ucHJvdG9jb2x9Ly8ke3dpbmRvdy5sb2NhdGlvbi5ob3N0fS8ke3Jlc3BvbnNlRG9ub3IuX2lkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICR7d2luZG93LmxvY2F0aW9uLnByb3RvY29sfS8vJHt3aW5kb3cubG9jYXRpb24uaG9zdH0vJHtyZXNwb25zZURvbm9yLl9pZH0gPC9hPmA7XHJcbiAgICAgICAgICB2aWV3LnBvcHVwLmFjdGlvbnMgPSBbXTtcclxuICAgICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZURvbm9yQWN0aW9uKGRvbm9ySWQsdmlldyl7XHJcbiAgICAgIGRlbGV0ZURvbm9yKGRvbm9ySWQsIHN1Y2Nlc3NDYWxsQmFjayk7XHJcbiAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3NDYWxsQmFjayhyZXNwb25zZURvbm9yKXtcclxuICAgICAgICAgIHZpZXcucG9wdXAudGl0bGUgPSBzdHJpbmdDb25zdGFudHMuREVMRVRFX0RPTk9SX1NVQ0NFU1M7XHJcbiAgICAgICAgICB2aWV3LnBvcHVwLmNvbnRlbnQgPSBcIlwiO1xyXG4gICAgICAgICAgdmlldy5wb3B1cC5hY3Rpb25zID0gW107XHJcbiAgICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Qmxvb2RHcm91cEljb24oZG9ub3Ipe1xyXG4gIGxldCBzeW1ib2xJbWFnZVNvdXJjZSA9IFwiXCI7XHJcbiAgc3dpdGNoKGRvbm9yLmJsb29kR3JvdXApIHtcclxuICAgIGNhc2UgJ0ErJzpcclxuICAgICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcInB1YmxpYy9pbWFnZXMvYXBsdXMucG5nXCI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnQisnOlxyXG4gICAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IFwicHVibGljL2ltYWdlcy9icGx1cy5wbmdcIjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdBQisnOlxyXG4gICAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IFwicHVibGljL2ltYWdlcy9hYnBsdXMucG5nXCI7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgY2FzZSAnTysnOlxyXG4gICAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IFwicHVibGljL2ltYWdlcy9vcGx1cy5wbmdcIjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdBLSc6XHJcbiAgICAgIHN5bWJvbEltYWdlU291cmNlID0gXCJwdWJsaWMvaW1hZ2VzL2FtaW51cy5wbmdcIjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdCLSc6XHJcbiAgICAgIHN5bWJvbEltYWdlU291cmNlID0gXCJwdWJsaWMvaW1hZ2VzL2JtaW51cy5wbmdcIjtcclxuICAgICAgYnJlYWs7XHJcbiAgICBjYXNlICdBQi0nOlxyXG4gICAgICBzeW1ib2xJbWFnZVNvdXJjZSA9IFwicHVibGljL2ltYWdlcy9hYm1pbnVzLnBuZ1wiO1xyXG4gICAgICBicmVhaztcclxuICAgIGNhc2UgJ08tJzpcclxuICAgICAgc3ltYm9sSW1hZ2VTb3VyY2UgPSBcInB1YmxpYy9pbWFnZXMvb21pbnVzLnBuZ1wiO1xyXG4gICAgICBicmVhaztcclxuICB9XHJcbiAgcmV0dXJuIHN5bWJvbEltYWdlU291cmNlO1xyXG59XHJcbiJdfQ==