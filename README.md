# StudentVue.js

Node.js Library for interacting with StudentVue portals.

## Installation

Install with `npm install studentvue.js`

## Basic Usage

Logging in and getting messages:

```javascript
const StudentVue = require('studentvue.js');
StudentVue.login('district url', 'username', 'password')
    .then(client => client.getMessages())
    .then(console.log);
```

Getting districts near a zip code:

```javascript
const StudentVue = require('studentvue.js');
StudentVue.getDistrictUrls('zip code').then(console.log);
{
    "DistrictLists": {
        "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
        "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
        "DistrictInfos": {
            "DistrictInfo": [
                {"DistrictID":"","Name":"San Francisco Unified School District","Address":"San Francisco CA 94102","PvueURL":"https://portal.sfusd.edu/"}
                ...
            ]
        }
    }
}
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

