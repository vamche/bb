import React, { PropTypes } from 'react'
import FilterItem from 'app/components/FilterItem'
import { ListGroup, ListGroupItem } from 'react-bootstrap'


const FiltersList = ({ filters, onFilterClick }) => (
  <ListGroup>
    {filters.map(filterItem =>
      <FilterItem
        key={filterItem.id}
        {...filterItem}
        onClick={() => onFilterClick(filterItem)}
      />
    )}
  </ListGroup>
)

FiltersList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired,
  onFilterClick: PropTypes.func.isRequired
}

export default FiltersList
