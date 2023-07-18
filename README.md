# StudentVue.js

Node.js Library for interacting with StudentVue portals.

**Important: 1.0.0 release removes built-in xml to javascript object parsing**. Use the library of your choice to parse xml, see notes below 

## Installation

Install with `npm install studentvue.js`

## Basic Usage

Logging in and getting messages:

```javascript
const { login } = require('studentvue.js');
login('district url', 'username', 'password')
    .then(client => client.getMessages())
    .then(console.log);
```

Getting districts near a zip code:

```javascript
const { getDistrictUrls } = require('studentvue.js');
getDistrictUrls('zip code').then(console.log);
```
```xml
<DistrictLists xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
     <DistrictInfos>
          <DistrictInfo DistrictID="" Name="Jefferson Elementary School District" Address="Daly City CA 94015" PvueURL="https://ca-jsd.edupoint.com" />
          <DistrictInfo DistrictID="" Name="Jefferson Union High School District" Address="Daly City CA 94015" PvueURL="https://genesis.juhsd.net/pxp" />
          <DistrictInfo DistrictID="" Name="Key Academy Charter School" Address="Hayward CA 94541" PvueURL="https://ca-kac.edupoint.com/" />
          <DistrictInfo DistrictID="" Name="Millbrae School District" Address="Millbrae CA 94030" PvueURL="https://ca-mesd-pvue.edupoint.com" />
          <DistrictInfo DistrictID="" Name="Newark Unified School District" Address="Newark CA 94560" PvueURL="https://vue.newarkunified.org/PXP" />
          <DistrictInfo DistrictID="" Name="Pacifica School District" Address="Pacifica CA 94044-3042" PvueURL="https://synergy.pacificasd.org/" />
          <DistrictInfo DistrictID="" Name="Pleasanton Unified School District" Address="Pleasanton CA 94566" PvueURL="https://ca-pleas-psv.edupoint.com" />
          <DistrictInfo DistrictID="" Name="San Francisco Unified School District" Address="San Francisco CA 94102" PvueURL="https://ca-sfu-psv.edupoint.com" />
          <DistrictInfo DistrictID="" Name="Tamalpais Union High School District" Address="Larkspur CA 94939" PvueURL="https://ca-tamal-psv.edupoint.com/" />
     </DistrictInfos>
</DistrictLists>
```

## New in 1.0.0 - Getting JSON output

install a package such as the reccomended `xml2js`, and utilize the serialize field in `getDistrictUrls` and `login`:

```js
const { getDistrictUrls } = require("./index");
const { parseStringPromise } = require("xml2js");

getDistrictUrls('zip code', parseStringPromise).then(val => {
    console.log(val);
})
```
```js
const { login } = require('studentvue.js');
login('district url', 'username', 'password', {}, parseStringPromise)
    .then(client => client.getMessages())
    .then(console.log);
```
Pass in a function that accepts a string of XML and returns a promise into the serialize field.

**Before 1.0.0** the default xml parser was `xml2json`. The following code should restore previous functionality:

```js
const { toJson } = require("xml2json");
login('district url', 'username', 'password', (xml) => {
    return Promise.resolve(toJson(xml));
});
```

## Methods

Example responses and more documentation to come.

### StudentVueClient.getMessages() - get messages from teachers / school
### StudentVueClient.getCalendar() - get assignments / events from calendar
### StudentVueClient.getAttendance() - get past attendance
### StudentVueClient.getGradebook([, reportPeriod]) - get grades and assignments from the specified reporting period, or the current grades if no reporting period is specified
### StudentVueClient.getClassNotes() - get provided class notes
### StudentVueClient.getStudentInfo() - get school's info on the student
### StudentVueClient.getSchedule([, termIndex]) - get student's schedule from the specified term, or the current schedule if no term is specified
### StudentVueClient.getSchoolInfo() - get school info
### StudentVueClient.listReportCards() - list all uploaded report card documents
### StudentVueClient.getReportCard(documentGuid) - get content of a report card document by it's guid
### StudentVueClient.listDocuments() - list all uploaded documents
### StudentVueClient.getDocument(documentGuid) - get content of a document by it's guid

