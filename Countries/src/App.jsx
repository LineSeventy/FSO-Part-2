import { useEffect, useState } from 'react'


function App() {
  const [userQuery, setUserQuery] = useState("")
  const [country, setCountry] = useState([]) 
  const [countries, setCountries] = useState([])
  const [suggestion, setSuggestions] = useState([])
  const [showDetails, setShowDetails] = useState(null) 
  const url = "https://studies.cs.helsinki.fi/restcountries/api/all"
  const [weatherDetails, setWeatherDetails] = useState([])
  const weatherApi_Key = import.meta.env.VITE_WEATHER_API_KEY
  useEffect(() => {
    const countriesData = async () => {
      try {
        const respone = await fetch(url)
        const data = await respone.json()
        setCountries(data)
      } catch (error) {
        console.log(error)
        setCountries([])
      }
    }
    countriesData()
  }, [])

  useEffect(() => {
    if (!userQuery) {
      setCountry([]);
      return;
    }
    const filtered = countries.filter(c => 
      c.name.common.toLowerCase().includes(userQuery.toLocaleLowerCase()))
    setSuggestions(filtered.slice(0, 10))
  }, [userQuery, countries])

  useEffect(() => {
    if (!userQuery) {
      setCountry([]);
      return;
    }
    const findCountries = async () => {
      try {
        const countryName = userQuery.toLowerCase();
        const respone = await fetch(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        if (respone.ok) {
          const json = await respone.json();
          setCountry(Array.isArray(json) ? json : [json])
        }
      } catch (error) {
        setCountry([])
      }
    }
    findCountries();
  }, [userQuery])

  useEffect(() => {
  if (!country.length) {
    setWeatherDetails([]);
    return;
  }

  const c = country[0];
  if (!c.capitalInfo?.latlng) return;

  const [lat, lon] = c.capitalInfo.latlng;
  const findCountryWeather = async () => {
    try {
      console.log("Fetching weather for:", c.capital, "Lat/Lon:", lat, lon);
      console.log("Using API key:", weatherApi_Key);
      const respone = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApi_Key}&units=metric`
      );
      console.log("Weather API response status:", respone.status);
      if (respone.ok) {
        const json = await respone.json();
        console.log("Weather API data:", json);
        setWeatherDetails(json);
      } else {
        setWeatherDetails([]);
        console.log("Weather API fetch failed");
      }
    } catch (error) {
      setWeatherDetails([]);
      console.log("Weather API error:", error);
    }
  };
  findCountryWeather();
}, [country, weatherApi_Key]);

  return (
    <>
      <div>
        <p>find countries{" "} 
          <input type="text" value={userQuery} onChange={(e) => {
            setUserQuery(e.target.value)
            setShowDetails(null)
          }} />
        </p> 
      </div>
      {suggestion.length > 0 && (
        <ul>
          {suggestion.map(s => (
            <li key={s.cca3}>
              {s.name.common}{" "}
              <button onClick={() => {
                setUserQuery(s.name.common)
                setSuggestions([])
                setShowDetails(s.cca3)
                setCountry([s])
              }}>
                Details
              </button>
            </li>
          ))}
        </ul>
      )}
      {country.map(c => (
        showDetails === c.cca3 && (
          <div key={c.cca3}>
            <h1>{c.name.common}</h1>
            <p><strong>Capital:</strong> {c.capital && c.capital.join(', ')}</p>
            <p><strong>Borders:</strong> {c.borders ? c.borders.join(', ') : "None"}</p>
            <p><strong>Area:</strong> {c.area}</p>
            <p><strong>Languages:</strong> {c.languages ? Object.values(c.languages).join(', ') : "N/A"}</p>
            <img src={c.flags?.png} alt={`Flag of ${c.name.common}`} width={120} />

            {weatherDetails.main && (
              <div>
                <h2>Weather in {c.capital && c.capital[0]}</h2>
                <p><strong>Temperature:</strong> {weatherDetails.main.temp} °C</p>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherDetails.weather[0].icon}@2x.png`}
                  alt={weatherDetails.weather[0].description}
                />
                <p><strong>Wind:</strong> {weatherDetails.wind.speed} m/s</p>
              </div>
            )}
          </div>
        )
      ))}
    </>
  )
}

export default App
