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

	constructor(props) {
		super(props);

		this.state = {
										graphicsLayer : {},
										view : {},
										donors : [],
										filters : [],
										donorEditable : {}

									};
	}

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

		const mapViewAndGraphicsLayer = setInitialMapView(this.refs.mapView, this.props.donorEditable);

		this.setState({view : mapViewAndGraphicsLayer.view, graphicsLayer: mapViewAndGraphicsLayer.graphicsLayer });

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
			this.state.graphicsLayer && this.state.graphicsLayer.graphics && this.state.graphicsLayer.graphics.removeAll();
			this.props.donors.forEach(donor => {
				  // Filter donors
					if(selectedFilters.indexOf(donor.bloodGroup) > -1){
						this.state.graphicsLayer.graphics.add(createGraphicForDonor(donor));
					}
				});
		} else {
			this.state.graphicsLayer && this.state.graphicsLayer.graphics && this.state.graphicsLayer.graphics.removeAll();
		}

		if(this.props.donorEditable && this.props.donorEditable._id){
			document.formDonor.bloodGroup.value= this.props.donorEditable.bloodGroup ;
		}
	}

	componentWillReceiveProps(nextProps){
		 if(nextProps.donorEditable && nextProps.donorEditable._id){
			 		 const currentEditDonorID = this.props.donorEditable && this.props.donorEditable._id ? this.props.donorEditable._id : "";
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
					 if (nextProps.donorEditable.latitude && nextProps.donorEditable.longitude) {
								 if(currentEditDonorID != nextProps.donorEditable._id){
									 let donorLocation = new Point({
											 longitude : nextProps.donorEditable.longitude,
											 latitude : nextProps.donorEditable.latitude
										 });
									 this.state.view.goTo(donorLocation, appConstants.DEFAULT_ZOOM_LEVEL);
									 this.state.view.popup.dockEnabled = true;
									 this.state.view.popup.actions = [];
									 this.state.view.popup.actions.push(deleteDonorDetails);
									 this.state.view.popup.actions.push(editDonorDetails);
									 this.state.view.popup.open({
										 location : this.state.view.center,
										 title : 'Edit Donor Details',
										 content : getPopupTemplateForAddDonor(nextProps.donorEditable)
									 });
									 document.formDonor.bloodGroup.value= nextProps.donorEditable.bloodGroup;
									 this.state.view.popup.on('trigger-action', (evt) => {
											 if (evt.action.id === "editDonor") {
												 editDonorAction(nextProps.donorEditable, this.state.view);
											 } else if (evt.action.id === "deleteDonor") {
												 deleteDonorAction(nextProps.donorEditable._id, this.state.view);
											 }
										 });
								 }
						 }
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
