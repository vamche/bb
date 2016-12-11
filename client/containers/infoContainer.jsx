import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import Map from "esri/Map"
import MapView from "esri/views/MapView"
import watchUtils from 'esri/core/watchUtils'

import { getDonors } from 'app/api/donorsAPI'
import {  toggleFilter } from 'app/actions/donorActions'

import FiltersList from 'app/components/FiltersList'

const mapStateToProps = (state) => {
    return {
        filters : state.donorsReducer.filters
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFilter: (filterItem) => {
            dispatch(toggleFilter(filterItem))
        }
    }
}

class Info extends Component {

   constructor(props){
      super(props);
      this.onClickFilterButton = this.onClickFilterButton.bind(this);
   }

   onClickFilterButton(){
      let filtersDiv = this.refs.filterByBloodGroup;
      filtersDiv.style.display = filtersDiv.style.display == '' ? 'block' : 
                                                                (filtersDiv.style.display == 'block' ? 'none' : 'block') ;
   }

    render() {
        return (
            <div id='info'>
                  <h1 className="logo">Blood  <br/>
                    Bank
                  </h1>
                  <div ref="filterByBloodGroup" className="bloodGroupFilters">
                    <FiltersList filters={this.props.filters} onFilterClick={this.props.toggleFilter}/>
                  </div>
                  <button className="btnFilter" onClick={this.onClickFilterButton}>
                    <i className="fa fa-filter" aria-hidden="true"></i>
                  </button>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)
