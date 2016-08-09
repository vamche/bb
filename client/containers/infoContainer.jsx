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

    render() {
        return (
            <div id='info'>
                <h1>Blood <br/>
                    Bank </h1>
                  <FiltersList filters={this.props.filters} onFilterClick={this.props.toggleFilter}/>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)
