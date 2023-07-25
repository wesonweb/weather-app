import Header from './Header'
import { useState } from 'react'
import { WiSunrise, WiSunset } from 'weather-icons-react'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
countries.registerLocale(enLocale)


import './App.css'

const BASE_URL = import.meta.env.VITE_BASE_URL
const API_KEY = import.meta.env.VITE_API_KEY


function App() {

  const [intro, setIntro] = useState(true)
  const [weatherByCity, setWeatherByCity] = useState({})
  const [location, setLocation] = useState('')
  // const [apiCalls, setApiCalls] = useState(0)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const url = `${BASE_URL}?q=${location}&units=metric&appid=${API_KEY}`

  const handleSubmit = (event) => {
    event.preventDefault()
    if (location !== '') {
      setLocation(location)
      getWeatherByCity()
    }
  }
//   useEffect(() => {
//   const interval = setInterval(() => {
//     console.log('This will run every second!');
//   }, 1000);
//   return () => clearInterval(interval);
// }, []);


    const getWeatherByCity = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(url)
        const data = await response.json()
        // setApiCalls(prev => prev + 1)
        setWeatherByCity(data)
        setIntro(false)
        setIsLoading(false)
        setLocation('')
      } catch (error) {
        setError(true)
        console.log(error.message)
      }
    }

  const { timezone, name } = weatherByCity || {} // timezone is in seconds

  const bstOffset = new Date().getTimezoneOffset() * 60 // BST offset in seconds
  const currentUTCTime = Math.floor((new Date().getTime() / 1000) + bstOffset) // UTC in seconds
  const utcAtLocation = currentUTCTime + timezone // UTC at location in seconds
  const timeAtLocation = new Date(utcAtLocation * 1000).toLocaleTimeString('en-GB', {timeStyle: 'short'}) // time converted to local time


  const {temp, temp_min, temp_max} = weatherByCity.main || {}
  const { country, sunrise, sunset } = weatherByCity.sys || {}
  const { description, icon } = weatherByCity.weather ? weatherByCity.weather[0] : {}

  const sunriseTime = new Date((sunrise + timezone) * 1000).toLocaleTimeString('en-GB', {timeStyle: 'short'})
  const sunsetTime = new Date((sunset + timezone) * 1000).toLocaleTimeString('en-GB', {timeStyle: 'short'})
  // const myLocation = navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords
  //     console.log(latitude, longitude);
  // })

  const round = (num) => {
    return Math.round(num)
  }

  const cityNotFound = () => {
    if (weatherByCity.cod === '404') {
      return <p className="text-center mt-2">Sorry, cannot locate that city. Please try again.</p>
    }
  }

  const loadingContent = () => {
    if (weatherByCity && isLoading) {
      return <p className="text-center">Loading...</p>
    }
  }

  const hasError = () => {
    if (error) {
      return <p className="text-center">Sorry, something went wrong. Please try again.</p>
    }
  }

  return (
    <>
      <div className="weather-container">
        <div className="content-container">
          {intro && (
              <Header />
            )}
          <form onSubmit={handleSubmit} className="search-form">
            <div>
              <input
                type="text"
                placeholder="Enter a city, eg London..."
                onChange={event => setLocation(event.target.value)}
                value={location}
                className="search-input"
                />
                <label className="sr-only">Location</label>
            </div>
          </form>
          {loadingContent()}
          {hasError()}
          {cityNotFound()}
            { weatherByCity.main && (
              <div>
                <h1 className="text-center mt-3">{name}</h1>
                <h2 className="text-center">{countries.getName(`${country}`, 'en')}</h2>
                <p className="text-center time">The time there is: {timeAtLocation}</p>
                <div className="flex justify-center gap mt-4 mb-4 temp-container">
                  <img
                    src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
                    alt=""
                    className="weather-icon"
                    />
                  <div className="temp flex-col">
                    <h2 className="text-center">{round(temp)}°C</h2>
                    <div className="flex gap">
                      <p className="text-center">min: {round(temp_min)}°C</p>
                      <span className="divider">|</span>
                      <p className="text-center">max: {round(temp_max)}°C</p>
                    </div>
                    <p className="text-center mt-1">{description}</p>
                  </div>
                </div>
                <div className="sunrise-set justify-center">
                  <div className="sunrise-set__info flex">
                    <WiSunrise size={56} className="icon sunrise" />
                    <div className="flex-col">
                      <span className="text-center">{sunriseTime}</span>
                      <span className="text-center">sunrise</span>
                    </div>
                  </div>
                  <div className="sunrise-set__info flex">
                    <WiSunset size={56} className="icon sunset" />
                    <div className="flex-col">
                      <span className="text-center">{sunsetTime}</span>
                      <span className="text-center">sunset</span>
                    </div>
                  </div>
              </div>
            </div>
            )}
            {/* {`API calls: ${apiCalls}`} */}
        </div>
      </div>
    </>
  )
}

export default App
