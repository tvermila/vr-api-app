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
    console.log('App.js compontentDidMount()')
    let stations = await trainService.getStations()
    this.setState({ stations })
  }

  clearEntry = () => this.setState({ entry: '', arrivingTrains: [], departingTrains: [], suggestions: [] })

  handleEntryChange = async (e) => {
    let entry = e.target.value.toLowerCase()
    let formattedEntry = entry.charAt(0).toUpperCase() + entry.slice(1)
    await this.setState({ entry: formattedEntry })

    const stations = this.state.stations
    let searchStation = stations.filter(station => station.stationName.substring(0).includes(this.state.entry) && station.passengerTraffic)

    if(searchStation.length < 1 || searchStation.length > 5) {
      return null
    } else if(searchStation.length > 1) {
      await this.setState({ suggestions: searchStation })
      return null
    }
    const shortCode = searchStation[0].stationShortCode

    const arriving = await trainService.getArriving(shortCode)
    console.log('arriving', arriving)
    const departing = await trainService.getDeparting(shortCode)
    let arrivingTrains = await arriving.map(train => {
      const arrivingTrain = train.timeTableRows.filter(station => station.type === 'ARRIVAL' && station.stationShortCode === shortCode)[0]
      console.log('arrivingTrain', arrivingTrain)
      return {
        train: train.trainType+' '+train.trainNumber,
        arrivalStation: stations.filter(station => train.timeTableRows[0].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        departureStation: stations.filter(station => train.timeTableRows[train.timeTableRows.length -1].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        scheduledTime: arrivingTrain.scheduledTime,
        liveEstimate: arrivingTrain.liveEstimateTime,
        differenceInMinutes: arrivingTrain.differenceInMinutes,
        cancelled: arrivingTrain.cancelled
      }
    })

    let departingTrains = await departing.map(train => {
      const departingTrain = train.timeTableRows.filter(station => station.type === 'DEPARTURE' && station.stationShortCode === shortCode)[0]
      return {
        train: train.trainType+' '+train.trainNumber,
        arrivalStation: stations.filter(station => train.timeTableRows[0].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        departureStation: stations.filter(station => train.timeTableRows[train.timeTableRows.length -1].stationShortCode === station.stationShortCode)[0].stationName.split(' ')[0],
        scheduledTime: departingTrain.scheduledTime,
        liveEstimate: departingTrain.liveEstimateTime,
        differenceInMinutes: departingTrain.differenceInMinutes,
        cancelled: departingTrain.cancelled
      }
    })

    arrivingTrains.sort((a, b) => a.scheduledTime > b.scheduledTime ? -1 : a.scheduledTime < b.scheduledTime ? 1 : 0).reverse()
    departingTrains.sort((a, b) => a.scheduledTime > b.scheduledTime ? -1 : a.scheduledTime < b.scheduledTime ? 1 : 0).reverse()
    console.log('arriving trains', arrivingTrains)

    this.setState({ arrivingTrains, departingTrains })
  }

  formatTime = (timestamp) => {
    const offset = Math.abs(new Date().getTimezoneOffset() / 60)
    let hours = Number(timestamp.substring(11, 13)) + offset
    if (hours > 23) {
      hours -= 24
    }
    return hours + timestamp.substring(13, 16)
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