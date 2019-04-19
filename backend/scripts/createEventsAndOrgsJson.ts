import * as data2017 from '../../data/events-2017.json';
import * as data2018 from '../../data/events-2018.json';
import * as data2019 from '../../data/events-2019.json';
import * as fs from 'fs';
import * as path from 'path';

type EventInput = {
  city: string;
  country: string;
  name: string;
  startDate: string;
  endDate?: string;
  twitter?: string;
  url: string;
  cfpUrl?: string;
  cfpEndDate?: string;
};

type EventOutput = {
  city: string;
  country: string;
  endDate: string | null;
  startDate: string;
  name: string;
};

type OrganizationOutput = {
  name: string;
  twitterHandle: Array<string> | string | null;
  website: Array<string> | string | null;
};

function concatData(sources: Array<any>): Array<EventInput> {
  let results: Array<EventInput> = [];
  for (let source of sources) {
    results = results.concat(source);
  }
  return results;
}

let jsonList = concatData([data2017, data2018, data2019]);

function createEvents(list: Array<EventInput>): Array<EventOutput> {
  let results: Array<EventOutput> = [];
  for (let event of list) {
    results.push({
      city: event.city,
      country: event.country,
      endDate: event.endDate || null,
      startDate: event.startDate,
      name: event.name
    });
  }
  return results;
}

function createOrgs(list: Array<EventInput>): Array<OrganizationOutput> {
  let results: Array<OrganizationOutput> = [];

  let orgs: {
    [key: string]: {
      website: Array<string>;
      twitterHandle: Array<string>;
      name: string;
    };
  } = {};
  for (let event of list) {
    let foundOrg = orgs[event.name];
    if (foundOrg) {
      if (event.url && !foundOrg.website.includes(event.url)) {
        foundOrg.website.push(event.url);
      }
      if (event.twitter && !foundOrg.twitterHandle.includes(event.twitter)) {
        foundOrg.twitterHandle.push(event.twitter);
      }
    } else {
      orgs[event.name] = {
        website: event.url ? [event.url] : [],
        twitterHandle: event.twitter ? [event.twitter] : [],
        name: event.name
      };
    }
  }

  for (let k in orgs) {
    let org = orgs[k];
    let result = {
      website:
        org.website.length === 0
          ? null
          : org.website.length === 1
          ? org.website[0]
          : org.website,
      name: org.name,
      twitterHandle:
        org.twitterHandle.length === 0
          ? null
          : org.twitterHandle.length === 1
          ? org.twitterHandle[0]
          : org.twitterHandle
    };
    results.push(result);
  }
  return results;
}

let events = createEvents(jsonList);
let orgs = createOrgs(jsonList);

fs.writeFile(
  path.join(__dirname, '../data/all-events-orgs.json'),
  JSON.stringify({
    events,
    organizations: orgs
  }),
  'utf8',
  err => {
    if (err) {
      throw err;
    }
  }
);
