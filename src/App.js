import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Form';
import List from './List';
import externalImg from './assets/external.png';

import styled from 'styled-components'
const Container = styled.div`
display: flex;
flex-direction: column;
padding: 0 10px;

@media (min-width: 768px){
  width: 700px
}
`
const Input = styled.input`
    width: 100%;
    background-color: white;
    color: black;
    padding: 5px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    font-style: italic;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
`

const Footer = styled.div`
  padding: 10px 0px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > a {
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: var(--white);
    margin: 0 5px;

    &:hover {
      opacity: 79%
    }

    & > *{
      margin: 0 5px;
    }
  }
`


require('dotenv').config()

function App() {
  const [allAgencies, setAllAgencies] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selected, setSelected] = useState({});

  var agenciaDb;
  const getDb = () => {
    if (agenciaDb) {
      return agenciaDb
    } else {
      var Airtable = require('airtable');
      Airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: process.env.REACT_APP_API_KEY
      });
      var base = Airtable.base(process.env.REACT_APP_BASE);

      return base(process.env.REACT_APP_BASE_NAME);
    }
  }

  useEffect(() => {
    getDb().select({
      // Selecting the first 3 records in Grid view:
      //maxRecords: 3,
      view: "Grid view",
      fields: ["name", "acronym", "country", "spaceappsPartner", "url"],
      //filterByFormula: "{spaceappsPartner}",
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      const ags = records.map(r => { return { ...r.fields, id: r.id } });

      //create json backup
      //console.log(JSON.stringify(ags))
      console.log('setAllAgencies')

      setAllAgencies(ags);
      setAgencies(ags);

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) { console.error(err); return; }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // function create(agency) {

  //   getDb().create([
  //     {
  //       "fields": {
  //         "name": agency.name,
  //         "acronym": agency.acronym || '',
  //         "country": agency.country,
  //         "spaceappsPartner": agency.spaceappsPartner,
  //         "url": agency.url || '',
  //       }
  //     }]
  //     , function (err, records) {
  //       if (err) {
  //         console.error(err);
  //         return;
  //       }
  //       records.forEach(function (record) {
  //         console.log(record.get('name'));
  //       });
  //     });

  // }

  function update(agency) {
    getDb().update([
      {
        "id": agency.id,
        "fields": {
          "name": agency.name,
          "acronym": agency.acronym,
          "country": agency.country,
          "spaceappsPartner": agency.spaceappsPartner,
          "url": agency.url,
        }
      }
    ], function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.get('name'));
        agencies.splice(agencies.findIndex(a => a.id === agency.id), 1, agency)
        setAgencies(agencies)
      });
    });

  }

  const handleSelect = agency => {
    setSelected(agency)
  }

  const handleDelete = id => {
    getDb().destroy([id], function (err, deletedRecords) {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Deleted', deletedRecords.length, 'records');
      setAgencies(agencies.filter(a => a.id !== id))
    });
  }

  function filter(text) {
    function filterAgencies() {
      const arr = allAgencies.filter(a => {
        const text2 = text.toLowerCase();
        return a.name.toLowerCase().includes(text2) ||
          (a.country && a.country.toLowerCase().includes(text2)) ||
          (a.acronym && a.acronym.toLowerCase().includes(text2));
      })

      return arr.reduce((acc, curr) => acc.some(a => a.name === curr.name) ? acc : [...acc, curr], []);
    }

    const arr = filterAgencies(text);
    setAgencies(arr);
  }

  return (
    <div className="App">
      <h1>Space Agencies Catalog</h1>
      {process.env.NODE_ENV === 'development' && <Form selected={selected} onSubmit={agency => update(agency)} />}

      <Container>
        <Input type="text" placeholder="search for agency name, country or acronym" onChange={e => filter(e.target.value)} />
      </Container>
      <List agencies={agencies} onDelete={handleDelete} onSelect={handleSelect} />
      <Footer>
        <a href="https://nasadatanauts.github.io/alexbelloni/" target="blank">Alex Belloni Alves <img src={externalImg} alt="external link icon" style={{ width: "17px", filter: "invert(1)" }} /></a> .
        <a href="https://spaceappschallenge.org" target="blank">NASA Space Apps 2021 - The Power of Ten <img src={externalImg} alt="external link icon" style={{ width: "17px", filter: "invert(1)" }} /></a>
      </Footer>
    </div>
  );
}

export default App;
