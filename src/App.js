import React, { Component } from 'react'
import './App.css'
import { Segment, Input, Container, Header, Menu, Table } from 'semantic-ui-react'
import TableHeader from './components/TableHeader'
import trainService from './services/trains'

class App extends Component {
  constructor(props) {
    super()
    this.state = {
      activeItem: 'saapuvat',
      trains: [],
      entry: '',
      stations: [],
      suggestions: []
    }
  }

  componentDidMount = async () => {
    console.log('App.js compontentDidMount()')    
    let stations = await trainService.getStations()
    //stations = stations.filter(station => station.passengerTraffic)
    this.setState({ stations }) 
  }

  handleEntryChange = async (e) => {
    let entry = e.target.value.toLowerCase()
    let formattedEntry = entry.charAt(0).toUpperCase() + entry.slice(1)
    await this.setState({ entry: formattedEntry })

    const stations = this.state.stations
    let searchStation = stations.filter(station => station.stationName.substring(0).includes(this.state.entry) && station.passengerTraffic)

    if(searchStation.length < 1 || searchStation.length > 10) {
      return null
    } else if(searchStation.length > 1) {
      await this.setState({ suggestions: searchStation })
      return null
    }
    searchStation = searchStation[0].stationShortCode
    console.log(searchStation)
    const data = await trainService.getTrains(searchStation)
    console.log('data', data)
    let trains = await data.map(train => ({ 
      juna: train.trainType+' '+train.trainNumber,
      lahtoasema: stations.filter(station => train.timeTableRows[0].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
      paateasema: stations.filter(station => train.timeTableRows[train.timeTableRows.length -1].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
      scheduledTime: train.timeTableRows.filter(station => station.type === "ARRIVAL" && station.stationShortCode === searchStation)[0].scheduledTime,
      actualTime: train.timeTableRows.filter(station => station.type === "ARRIVAL" && station.stationShortCode === searchStation)[0].actualTime,
      differenceInMinutes: train.timeTableRows.filter(station => station.type === "ARRIVAL" && station.stationShortCode === searchStation)[0].differenceInMinutes,
      cancelled: train.timeTableRows.filter(station => station.type === "ARRIVAL" && station.stationShortCode === searchStation)[0].cancelled
    }))
    trains.sort((a, b) => a.scheduledTime > b.scheduledTime ? -1 : a.scheduledTime < b.scheduledTime ? 1 : 0).reverse()
    this.setState({ trains })
  }

  formatTime = (timestamp) => {
    console.log('formatTime timestamp', timestamp)
    const offset = Math.abs(new Date().getTimezoneOffset() / 60)
    let hours = Number(timestamp.substring(11, 13)) + offset
    if (hours > 23) {
      hours -= 24
    }
    return hours + timestamp.substring(13, 16)
  }

  handleMenuClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem, suggestions } = this.state
    return (
      <Segment>
        <Container style={{ marginBottom: 50 }}>
          <Header as='h2' style={{ backgroundColor: '#24af29', color: 'white' }} block>
            Aseman junatiedot
          </Header>
        </Container>
        <Container text>
          <strong>Hae aseman nimellä:</strong><br />
          <Input
          name='entry'
          size='large'
          icon='search'
          placeholder='Aseman nimi...'
          onChange={this.handleEntryChange}
          autoFocus
          />
          <div>
            {suggestions.map((s, i) => <p key={i}>{s.stationName}</p>)}
          </div>
          <Menu tabular>
            <Menu.Item name='saapuvat' active={activeItem === 'saapuvat'} onClick={this.handleMenuClick}>Saapuvat</Menu.Item>
            <Menu.Item name='lahtevat' active={activeItem === 'lahtevat'} onClick={this.handleMenuClick}>Lähtevät</Menu.Item>
          </Menu>
          <Table striped>
            <TableHeader activeItem={activeItem} />
            <Table.Body>
             {this.state.trains.map((train, i) => 
              <Table.Row key={i} disabled={train.cancelled ? true : false}>
                <Table.Cell>{train.juna}</Table.Cell>
                <Table.Cell>{train.lahtoasema}</Table.Cell>
                <Table.Cell>{train.paateasema}</Table.Cell>
                <Table.Cell>
                  {this.formatTime(train.scheduledTime)}
                  <br />
                  <div style={{ color: train.cancelled ? 'red' : '' }}>{train.cancelled ? 'cancelled' : ''}</div>
                </Table.Cell>
              </Table.Row>
            )}
            </Table.Body>
          </Table>
        </Container>

      </Segment>
    )
  }
}

export default App
