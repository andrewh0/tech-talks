import * as fs from 'fs';
import * as path from 'path';
import * as eventsOrgs from '../data/all-events-orgs.json';
import * as json2csv from 'json2csv';

const Json2csvParser = json2csv.Parser;

try {
  const parser = new Json2csvParser();
  const csv = parser.parse(eventsOrgs.events);
  fs.writeFile(path.join(__dirname, '../data/all-events.csv'), csv, err => {
    if (err) {
      throw err;
    }
  });
} catch (err) {
  console.error(err);
}
