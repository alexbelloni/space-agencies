import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Form';
import List from './List';
import externalImg from './assets/external.png';
import partnerImg from './assets/partner.png'

import styled from 'styled-components'

const Main = styled.div`

`

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
const Checkbox = styled.input`
background-color: initial;
cursor: default;
appearance: auto;
box-sizing: border-box;
margin: 3px 3px 3px 4px;
padding: initial;
border: initial;


width: 25px;
height: 20px;
top: 2px;
z-index: 2;
margin-left: 0;`
const Footer = styled.div`
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

ul {
  display: flex;
  list-style-type:none;
  justify-content: center;
  padding: 0;
}

  li a {
    text-decoration: none;
    color: var(--white);

    &:hover {
      opacity: 69%
    }
  }

  li a img {
    margin-left: 5px;
  }

  @media (min-width: 768px){
ul {
  width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    & > *{
      margin: 5px;
    }
}
  }
`

require('dotenv').config()

function App() {
  const [allAgencies, setAllAgencies] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [selected, setSelected] = useState({});
  const [textFilter, setTextFilter] = useState('');
  const [partnerFilter, setPartnerFilter] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    getDb().select({
      // Selecting the first 3 records in Grid view:
      //maxRecords: 3,
      view: "Grid view",
      fields: ["name", "acronym", "country", "spaceappsPartner", "url"],
      //filterByFormula: "{spaceappsPartner}",
    }).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      const ags = records.map(r => { return { ...r.fields, id: r.id } });

      setAllAgencies(ags);
      setAgencies(ags);

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) { console.error(err); return; }
      setLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setTextFilter('')
    if (partnerFilter) {
      setAgencies(allAgencies.filter(a => a.spaceappsPartner))
    } else {
      setAgencies(allAgencies)
    }

  }
    , [partnerFilter, allAgencies])

  function create(agency) {

    getDb().create([
      {
        "fields": {
          "name": agency.name,
          "acronym": agency.acronym || '',
          "country": agency.country,
          "spaceappsPartner": agency.spaceappsPartner,
          "url": agency.url || '',
        }
      }]
      , function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log(record.get('name'));
        });
      });

  }

  function update(agency) {
    if (!agency.id) {
      create(agency)
    }
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

    setTextFilter(text)
    const arr = filterAgencies(text);
    setAgencies(arr);
  }

  return (
    <Main className="App">
      <h1>Space Agencies Catalog</h1>
      {process.env.NODE_ENV === 'development' && <Form selected={selected} onSubmit={agency => update(agency)} />}

      {!loading ? (
        <>
          <Container>
            <Input type="text" placeholder="search for agency name, country or acronym" onChange={e => filter(e.target.value)} value={textFilter} />
          </Container>
          <Container style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "10px 0" }} >
            <Checkbox type="checkbox" checked={partnerFilter} onChange={e => setPartnerFilter(!partnerFilter)} /> <span onClick={e => setPartnerFilter(!partnerFilter)}> <img alt="partner logo" src={partnerImg} style={{ width: "17px", filter: "invert(1)" }} /> Space Apps Partner</span>
          </Container>
          <List agencies={agencies} onDelete={handleDelete} onSelect={handleSelect} />
        </>
      ) :
        'loading...'
      }


      <Footer>
        <p>Please note: this is not a Space Apps Challenge official website.</p>
        <ul>
          <li>
            <a href="https://nasadatanauts.github.io/alexbelloni/" target="blank">Alex Belloni Alves
              <img src={externalImg} alt="external link icon" style={{ width: "17px", filter: "invert(1)" }} />
            </a>
          </li>
          <li>
            <a href="https://spaceappschallenge.org" target="blank">NASA Space Apps 2021
              <img src={externalImg} alt="external link icon" style={{ width: "17px", filter: "invert(1)" }} />
            </a>
          </li>
        </ul>
      </Footer>
    </Main>
  );
}

export default App;
