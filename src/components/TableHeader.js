import React from 'react'
import { Table } from 'semantic-ui-react'

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

export default TableHeader