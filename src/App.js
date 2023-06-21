// import logo from './logo.svg';
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
  }, []);

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
        weather && Math.round(weather.main.temp) > 15 ? 'warmBg' : ''
      }`}
    >
      <div className="appBg">
        <div className="searchBox">
          <input
            className="searchBar"
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
          />
        </div>
        {weather !== null ? (
          <div className="weatherWrap">
            <div className="locationBox">
              <div className="location">
                {weather.name} {weather.sys.country}
              </div>
              <div className="date"> {currentDate}</div>
            </div>
            <div className="weatherBox">
              <div className="temp">{Math.round(weather.main.temp)}&deg;c</div>
              <div className="weather">{weather.weather[0].main}</div>
              <div className="weatherDescription">
                {weather.weather[0].description}
              </div>
            </div>
          </div>
        ) : (
          <div className="noWeatherPlaceholder">
            Please type your city in the search box above
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
