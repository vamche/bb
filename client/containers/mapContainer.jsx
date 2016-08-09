import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import io from 'socket.io'

import { getDonors, addDonor, getDonorDetails } from 'app/api/donorsAPI'
import Info from 'app/containers/infoContainer'
import { createGraphicForDonor, setInitialMapView, getPopupTemplateForAddDonor, editDonorAction, deleteDonorAction } from 'app/utilities/MapUtilities'
import { addDonorToList, updateDonorInList, deleteDonorFromList } from 'app/actions/donorActions'

import Point from 'esri/geometry/Point';
import * as appConstants from 'app/utilities/constants'

const socket = io.connect();


const mapStateToProps = (state) => {
	return {
		graphicsLayer : state.donorsReducer.graphicsLayer,
		view : state.donorsReducer.view,
		donors : state.donorsReducer.donors,
		filters : state.donorsReducer.filters,
		donorEditable : state.donorsReducer.donorEditable
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		addDonorToList : (donor) => {
			dispatch(addDonorToList(donor))
		},
		updateDonorInList : (donor) => {
			dispatch(updateDonorInList(donor))
		},
		deleteDonorFromList : (donorId) => {
			dispatch(deleteDonorFromList(donorId))
		}
	}
}

class MapUI extends Component {

	componentWillMount() {

		//GET THE DONOR DETAILS
		//IF THE URL CONTAINS DONOR ID
		let pathName = window.location.pathname;
		let donorId = pathName.split('/')[1];
		if (donorId && donorId != "") {
			getDonorDetails(donorId);
		}
	}

	componentDidMount() {

		setInitialMapView(this.refs.mapView, this.props.donorEditable);

		// Socket Operations
		socket.on('DONOR_ADDED', donor => this.props.addDonorToList(donor));
		socket.on('DONOR_UPDATED', donor => this.props.updateDonorInList(donor));
		socket.on('DONOR_REMOVED', donorId => this.props.deleteDonorFromList(donorId));

	}

	componentDidUpdate() {
    // Update the graphics when there is a donors' state change
		if (this.props.donors.length > 0) {
			let selectedFilters = [];
			this.props.filters.forEach(filterItem => {if(filterItem.selected){selectedFilters.push(filterItem.id)}});
			this.props.graphicsLayer && this.props.graphicsLayer.graphics && this.props.graphicsLayer.graphics.removeAll();
			this.props.donors.forEach(donor => {
				  // Filter donors
					if(selectedFilters.indexOf(donor.bloodGroup) > -1){
						this.props.graphicsLayer.graphics.add(createGraphicForDonor(donor));
					}
				});
		} else {
			this.props.graphicsLayer && this.props.graphicsLayer.graphics && this.props.graphicsLayer.graphics.removeAll();
		}

		const deleteDonorDetails = {
			title : "Delete",
			id : "deleteDonor",
			className : ""
		};

		const editDonorDetails = {
			title : "Edit",
			id : "editDonor",
			className : ""
		};

    // show the donor details if user is trying to edit

		if (this.props.donorEditable.latitude && this.props.donorEditable.longitude) {

			let donorLocation = new Point({
					longitude : this.props.donorEditable.longitude,
					latitude : this.props.donorEditable.latitude
				});
			this.props.view.goTo(donorLocation, appConstants.DEFAULT_ZOOM_LEVEL);
			this.props.view.popup.actions = [];
			this.props.view.popup.actions.push(deleteDonorDetails);
			this.props.view.popup.actions.push(editDonorDetails);
			this.props.view.popup.open({
				location : this.props.view.center,
				title : 'Edit Donor Details',
				content : getPopupTemplateForAddDonor(this.props.donorEditable)
			});
      document.formDonor.bloodGroup.value= this.props.donorEditable.bloodGroup;
			this.props.view.popup.on('trigger-action', (evt) => {
					if (evt.action.id === "editDonor") {
						editDonorAction(this.props.donorEditable, this.props.view);
					} else if (evt.action.id === "deleteDonor") {
						deleteDonorAction(this.props.donorEditable._id, this.props.view);
					}
				});
		}

	}

	render() {
        const mapStyle = {
            width: '100%',
            height: '100%'
        }

        return (
            <div style={mapStyle} ref='mapView'>
              <Info />
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapUI)
