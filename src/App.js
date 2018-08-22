import React, { Component } from 'react'
import { Segment, Container, Header, Menu } from 'semantic-ui-react'
import trainService from './services/trains'
import SearchField from './components/SearchField'
import TrainTable from './components/TrainTable'

class App extends Component {
  constructor() {
    super()
    this.state = {
      activeItem: 'saapuvat',
      entry: '',
      stations: [],
      suggestions: [],
      arrivingTrains: [],
      departingTrains: []
    }
  }

  componentDidMount = async () => {
    const stations = await trainService.getStations()
    this.setState({ stations })
  }

  clearEntry = () => this.setState({ entry: '', suggestions: [] })

  setSuggestions = (filteredStations) => {
    if(filteredStations.length < 1 || filteredStations.length > 5)
      return null
    this.setState({ suggestions: filteredStations })
  }

  getStation = () => {
    const { entry, stations } = this.state
    const filteredStations = stations.filter(station => station.stationName.substring(0).includes(entry) && station.passengerTraffic && station.type === 'STATION')
    this.setSuggestions(filteredStations)
    if (filteredStations.length !== 1 || filteredStations[0].stationName !== entry)
      return null
    else
      return filteredStations[0]
  }

  getArrivingTrains = async (shortCode) => {
    const stations = this.state.stations
    let arriving = await trainService.getArriving(shortCode)
    arriving = await arriving.filter(t => t.trainType !== 'T')

    let arrivingTrains = await arriving.map(train => {
      const arrivingTrain = train.timeTableRows.filter(station => station.type === 'ARRIVAL' && station.stationShortCode === shortCode)[0]
      return {
        train: `${train.trainType} ${train.trainNumber}`,
        arrivalStation: stations.filter(station => train.timeTableRows[train.timeTableRows.length -1].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        departureStation: stations.filter(station => train.timeTableRows[0].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        scheduledTime: arrivingTrain.scheduledTime,
        liveEstimate: arrivingTrain.liveEstimateTime,
        differenceInMinutes: arrivingTrain.differenceInMinutes,
        cancelled: arrivingTrain.cancelled
      }
    })

    arrivingTrains.sort((a, b) => a.scheduledTime < b.scheduledTime ? -1 : a.scheduledTime > b.scheduledTime ? 1 : 0)
    this.setState({ arrivingTrains })
  }

  getDepartingTrains = async (shortCode) => {
    const stations = this.state.stations
    let departing = await trainService.getDeparting(shortCode)
    departing = await departing.filter(t => t.trainType !== 'T')

    let departingTrains = await departing.map(train => {
      const departingTrain = train.timeTableRows.filter(station => station.type === 'DEPARTURE' && station.stationShortCode === shortCode)[0]
      return {
        train: `${train.trainType} ${train.trainNumber}`,
        arrivalStation: stations.filter(station => train.timeTableRows[train.timeTableRows.length -1].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        departureStation: stations.filter(station => train.timeTableRows[0].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        scheduledTime: departingTrain.scheduledTime,
        liveEstimate: departingTrain.liveEstimateTime,
        differenceInMinutes: departingTrain.differenceInMinutes,
        cancelled: departingTrain.cancelled
      }
    })

    departingTrains.sort((a, b) => a.scheduledTime < b.scheduledTime ? -1 : a.scheduledTime > b.scheduledTime ? 1 : 0)
    this.setState({ departingTrains })
  }

  handleEntryChange = async (e) => {
    let entry = e.target.value.toLowerCase()
    const formattedEntry = `${entry.charAt(0).toUpperCase()}${entry.slice(1)}`
    await this.setState({ entry: formattedEntry })

    const station = this.getStation()
    if(!station) return null
    const shortCode = station.stationShortCode
    this.getArrivingTrains(shortCode)
    this.getDepartingTrains(shortCode)
  }

  formatTime = (timestamp) => {
    const offset = Math.abs(new Date().getTimezoneOffset() / 60)
    let hours = Number(timestamp.substring(11, 13)) + offset
    if (hours > 23) {
      hours -= 24
    }
    return `${hours}${timestamp.substring(13, 16)}`
  }

  handleMenuClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem, suggestions, departingTrains, arrivingTrains, entry } = this.state
    const trains = activeItem === 'saapuvat' ? arrivingTrains : departingTrains
    return (
      <Segment>
        <Container style={{ marginBottom: 50 }}>
          <Header as='h2' style={{ backgroundColor: '#24af29', color: 'white' }} block>Aseman junatiedot</Header>
        </Container>
        <Container text>
          <SearchField handleEntryChange={this.handleEntryChange} suggestions={suggestions} entry={entry} clearEntry={this.clearEntry} />
          <Menu tabular>
            <Menu.Item name='saapuvat' active={activeItem === 'saapuvat'} onClick={this.handleMenuClick}>Saapuvat</Menu.Item>
            <Menu.Item name='lahtevat' active={activeItem === 'lahtevat'} onClick={this.handleMenuClick}>Lähtevät</Menu.Item>
          </Menu>
          <TrainTable trains={trains} activeItem={activeItem} formatTime={this.formatTime} />
        </Container>
      </Segment>
    )
  }
}

export default App