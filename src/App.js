import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [searchQuery, setSeatchQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const api_key = process.env.REACT_APP_WEATHER_API_KEY;
  const base_url = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(currentDate);

    const fetchWeatherByLocation = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `${base_url}weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getLocationAndFetchWeather = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
        },
        error => {
          console.error(error);
        }
      );
    };

    if (!searchQuery) {
      getLocationAndFetchWeather();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `${base_url}weather?q=${searchQuery}&units=metric&appid=${api_key}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = e => {
    setSeatchQuery(e.target.value);
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div
      className={`app ${
        weather && Math.round(weather.main.temp) > 15 ? 'warm-bg' : ''
      }`}
    >
      <div className="app-bg">
        <div className="search-box">
          <input
            className="search-bar"
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
          />
        </div>
        {weather !== null ? (
          <div className="weather-wrap">
            <div className="location-box">
              <div className="location">
                {weather.name} {weather.sys.country}
              </div>
              <div className="date"> {currentDate}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}&deg;c</div>
              <div className="weather">{weather.weather[0].main}</div>
              <div className="weather-description">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        ) : (
          <div className="no-weather-placeholder">
            Please type your city in the search box above
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
