import axios from 'axios'

const baseUrl = 'https://rata.digitraffic.fi/api/v1'

const getTrains = async (stationShortCode) => {
  const response = await axios.get(`${baseUrl}/live-trains/station/${stationShortCode}`)
  return response.data
}

const getStations = async () => {
  const response = await axios.get(`${baseUrl}/metadata/stations`)
  return response.data
}

const getArriving = async (stationShortCode) => {
  const response = await axios.get(`${baseUrl}/live-trains/station/${stationShortCode}?arrived_trains=0&arriving_trains=10&departed_trains=0&departing_trains=0&include_nonstopping=false`)
  return response.data
}

const getDeparting = async (stationShortCode) => {
  const response = await axios.get(`${baseUrl}/live-trains/station/${stationShortCode}?arrived_trains=0&arriving_trains=0&departed_trains=0&departing_trains=10&include_nonstopping=false`)
  return response.data
}

export default { getTrains, getStations, getArriving, getDeparting }