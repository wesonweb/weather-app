import Header from './Header'
import DisplayWeather from './DisplayWeather'
import { useState } from 'react'



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
              <DisplayWeather
              weatherByCity={weatherByCity}
              />
            )}
            {/* {`API calls: ${apiCalls}`} */}
        </div>
      </div>
    </>
  )
}

export default App
