import axios from 'axios'

const getTrains = async (stationShortCode) => {
  const response = await axios.get(`https://rata.digitraffic.fi/api/v1/live-trains/station/${stationShortCode}?arrived_trains=0&arriving_trains=10&departed_trains=0&departing_trains=0&include_nonstopping=false`)
  return response.data
}

const getStations = async () => {
  const response = await axios.get('https://rata.digitraffic.fi/api/v1/metadata/stations')
  return response.data
}

export default { getTrains, getStations }