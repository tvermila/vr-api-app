import React from 'react'
import TableHeader from './TableHeader'
import { Table } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const TrainTable = ({ trains, activeItem, formatTime }) => {
  return (
    <Table striped>
      <TableHeader activeItem={activeItem} />
      <Table.Body>
        {trains.map((train, i) =>
          <Table.Row key={i} disabled={train.cancelled ? true : false}>
            <Table.Cell>{train.train}</Table.Cell>
            <Table.Cell>{train.departureStation}</Table.Cell>
            <Table.Cell>{train.arrivalStation}</Table.Cell>
            <Table.Cell>
              {formatTime(train.scheduledTime)}
              <br />
              <div style={{ color: train.liveEstimate > train.scheduledTime ? 'red' : 'green' }}>
                {train.liveEstimate && train.differenceInMinutes !== 0 ? `(${formatTime(train.liveEstimate)})` : ''}
              </div>
              <div style={{ color: train.cancelled ? 'red' : '' }}>{train.cancelled ? 'cancelled' : ''}</div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  )
}

TrainTable.propTypes = {
  trains: PropTypes.array,
  activeItem: PropTypes.string,
  formatTime: PropTypes.func
}

export default TrainTable