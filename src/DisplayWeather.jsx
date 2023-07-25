import { WiSunrise, WiSunset } from 'weather-icons-react'
import PropTypes from 'prop-types'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
countries.registerLocale(enLocale)

const Weather = ({ weatherByCity }) => {
  const round = (num) => {
    return Math.round(num)
  }

  const { timezone, name } = weatherByCity || {} // timezone is in seconds
  const {temp, temp_min, temp_max} = weatherByCity.main || {}
  const { country, sunrise, sunset } = weatherByCity.sys || {}
  const { description, icon } = weatherByCity.weather ? weatherByCity.weather[0] : {}

  const bstOffset = new Date().getTimezoneOffset() * 60 // BST offset in seconds
  const currentUTCTime = Math.floor((new Date().getTime() / 1000) + bstOffset) // UTC in seconds
  const utcAtLocation = currentUTCTime + timezone // UTC at location in seconds
  const timeAtLocation = new Date(utcAtLocation * 1000).toLocaleTimeString('en-GB', {timeStyle: 'short'}) // time converted to local time



  const sunriseTime = new Date((sunrise + timezone) * 1000).toLocaleTimeString('en-GB', {timeStyle: 'short'})
  const sunsetTime = new Date((sunset + timezone) * 1000).toLocaleTimeString('en-GB', {timeStyle: 'short'})
  // const myLocation = navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords
  //     console.log(latitude, longitude);
  // })

  return (
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
  )
}

export default Weather

Weather.propTypes = {
  weatherByCity: PropTypes.object.isRequired,
  round: PropTypes.func
}
