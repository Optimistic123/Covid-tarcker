import React ,{ useState,useEffect } from 'react';
import './App.css';
import { MenuItem,FormControl,Select,Card,CardContent } from "@material-ui/core";

import InfoBox from "./InfoBox";

import LineGraph from "./LineGraph";
import Table from "./Table";
//import { sortData, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

function App() {
  //select a country
  const [country, setInputCountry] = useState("worldwide");
  //collect data as a whole i.e coolective data from all countries
  const [countryInfo, setCountryInfo] = useState({});
  //store data for a particular country i.e name of country and cases of that country
  const [countries, setCountries] = useState([]);
  //store data for each cases i.e all ,recovered, death
  const [casesType, setCasesType] = useState("cases");
 

  //store data of each country used for table representation
  const [tableData, setTableData] = useState([]);
  //store country for mappimg country in map
  const [mapCountries, setMapCountries] = useState([]);
  //initialize center of map nad zoom type
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);


  //API call for data of covid - 19 
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);
  
  //API call for data of covid - 19 for a pricular country
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
          setCountries(countries);   //data store name of a country and cases in that country
          setMapCountries(data);
          setTableData(data);       
        });
    };
    getCountriesData();
   },[]);

   //handle change on click any country
   const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setInputCountry(countryCode);
    
    //get the data of each country by using countrycode and this is selected from dropdown 
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
    <div className="app">
    <div className="app__left">

      <div className="app__header">
        <h1>COVID-19 Tracker</h1>
        <FormControl className="app__dropdown">
          <Select
            variant="outlined"
            value={country}
            onChange={onCountryChange}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox 
          onClick={(e) => setCasesType("cases")}  
          title="Coronavirus Cases" 
          isRed 
          active={casesType === "cases"} 
          cases={countryInfo.todayCases} 
          total={numeral(countryInfo.cases).format("0.0a")}
        />
        <InfoBox onClick={(e) => setCasesType("recovered")} title="Recovered" active={casesType === "recovered"} 
          cases={countryInfo.todayRecovered} 
          total={numeral(countryInfo.recovered).format("0.0a")}
        />
        <InfoBox onClick={(e) => setCasesType("deaths")} title="Deaths" isRed active={casesType === "deaths"} 
          cases={countryInfo.todayDeaths} 
          total={numeral(countryInfo.deaths).format("0.0a")}
        />
      </div>

      <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
      />

    </div>
    <Card className="app__right">
      <CardContent>
        <div className="app__information">
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide {casesType}</h3>
          {/* <p>Line graph</p> */}

          <LineGraph className='app__graph' casesType={casesType} />
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