import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [temp, setTemp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [city, setCity] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [background, setBackground] = useState(null);
  useEffect(() => {
    const success = (position) => {
      setCoords({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    };
    const error = () => {
      setHasError(true);
      setIsLoading(false);
    };
    navigator.geolocation.getCurrentPosition(success, error);
  }, []);
  useEffect(() => {
    if (coords) {
      const API_KEY = "49a60b22c8d123afaafd22e8199974cc";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`;

      axios
        .get(url)
        .then((res) => {
          setWeather(res.data);
          const celcius = (res.data.main.temp - 273.15).toFixed(1);
          const fahrenheit = ((celcius * 9) / 5 + 32).toFixed(1);
          setTemp({ celcius, fahrenheit });
          setMessageError(false);
          setBackground(res.data.weather[0].main);
        })
        .catch((err) => {
          console.error(err);
          setMessageError(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [coords, city]);
  const objStyles = {
    backgroundImage: `url(/images/${background}.jpg)`,
  };

  return (
    <div style={objStyles} className="app flex-container">
      {isLoading ? (
        <span className="loader"></span>
      ) : hasError ? (
        <h1 className="permission">✅Please acept the permissions✅</h1>
      ) : (
        <WeatherCard
          weather={weather}
          temp={temp}
          setCity={setCity}
          messageError={messageError}
          city={city}
        />
      )}
    </div>
  );
}
export default App;
