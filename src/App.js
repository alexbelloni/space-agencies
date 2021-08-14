import React, { useState, useEffect } from 'react';
import './App.css';
import Form from './Form';
import List from './List';

require('dotenv').config()

function App() {
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
      //console.log(JSON.stringify(ags))

      setAgencies(ags);

      // To fetch the next page of records, call `fetchNextPage`.
      // If there are more records, `page` will get called again.
      // If there are no more records, `done` will get called.
      fetchNextPage();

    }, function done(err) {
      if (err) { console.error(err); return; }
    });
  }, [])

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
    // getDb().destroy([id], function (err, deletedRecords) {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //   console.log('Deleted', deletedRecords.length, 'records');
    //   setAgencies(agencies.filter(a => a.id != id))
    // });
  }

  return (
    <div className="App">
      <h1>Space Agencies Catalog</h1>
      <Form selected={selected} onSubmit={agency => update(agency)} />
      <List agencies={agencies} onDelete={handleDelete} onSelect={handleSelect} />
      <footer style={{textAlign: "center", padding: "10px 0"}}>
        Alexandre Alves . NASA Space Apps 2021 . The Power of Tenth
      </footer>
    </div>
  );
}

export default App;
