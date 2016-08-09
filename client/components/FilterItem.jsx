import React, { PropTypes } from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

const FilterItem = ({ onClick, selected, text }) => (
  <ListGroupItem
    onClick={onClick}
    style={{
      textDecoration: selected ? 'none' : 'line-through'
    }}
  >
    {text}
  </ListGroupItem>
)

FilterItem.propTypes = {
  onClick: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired
}

export default FilterItem
