import React ,{ useState,useEffect } from 'react';
import './App.css';
import { MenuItem,FormControl,Select,Card,CardContent } from "@material-ui/core";

import InfoBox from "./InfoBox";

//import LineGraph from "./LineGraph";
import Table from "./Table";
//import { sortData, prettyPrintStat } from "./util";
//import numeral from "numeral";
//import Map from "./Map";
//import "leaflet/dist/leaflet.css";

function App() {

  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  
  //API call for data of covid - 19
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then( (response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
            name: country.country,
            value: country.countryInfo.iso2,
            }
          ));
          setCountries(countries);
        });
    };
    getCountriesData();
   },[]);

   //handle change on click any country
   const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setInputCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };


  return (
    <div className="App">
        <p> Covid tarcker app</p>
        {/* 1.Header */}
        <div className='app_header'> 
          <FormControl className="app__dropdown">
              <Select variant="outlined" value={country} onChange={onCountryChange}> 
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
          </FormControl>
        </div>
         
         {/* 2.Some data of coronavirus */}
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={countryInfo.todayCases}
            // total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={countryInfo.todayRecovered}
            // total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={countryInfo.todayDeaths}
            // total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            {/* <LineGraph casesType={casesType} /> */}
          </div>
        </CardContent>
      </Card>
        

    </div>
  );
}

export default App;























{/* <Header /> */}

        {/* <InfoBox /> */}

        {/* <Table /> */}


        {/* <Graph /> */}

        {/* <Map /> */}