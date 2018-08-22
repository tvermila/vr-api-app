import React from 'react'
import { Table } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const TableHeader = ({ activeItem }) => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Juna</Table.HeaderCell>
        <Table.HeaderCell>Lähtöasema</Table.HeaderCell>
        <Table.HeaderCell>Pääteasema</Table.HeaderCell>
        <Table.HeaderCell>{activeItem === 'lahtevat' ? 'Lähtee' : 'Saapuu'}</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  )
}

TableHeader.propTypes = { activeItem: PropTypes.string }

export default TableHeader