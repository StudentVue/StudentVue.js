# StudentVue.js

Node.js StudentVue library

# Usage

Install with `npm install studentvue.js`

### getUrls

Find URLs for gradebook servers

```javascript
const studentvue = require("studentvue.js")

studentvue.getUrls(12345).then(response => {
  console.log(response)
})
```

Example response

```javascript
[
  {
    DistrictID: '', //DistrictID is usually blank
    Name: 'LoganMD Unified School District',
    Address: 'The ISS',
    PvueURL: 'https://loganMD-rocks.edupoint.com/'
  },
  {
    DistrictID: '',
    Name: 'stupid example school district',
    Address: 'idk',
    PvueURL: 'https://bruh.edupoint.com/'
  }
]
```

### getGrades

Gets current grades/classes

```javascript
const studentvue = require("studentvue.js")

studentvue.getGrades("url", "id", "password").then(response => {
  console.log(response)
})
```

Example response (Marks are grades/assignments)

```javascript
[
  {
    Period: '1',
    Title: 'JavaScript class',
    Room: '42069',
    Staff: 'LoganMD',
    StaffEMail: 'logans@fancy.email',
    StaffGU: '123456789',
    Marks: { Mark: [Object] }
  }
]
```

Marks Example

```javascript
{
  Mark: {
    MarkName: 'S2',
    CalculatedScoreString: 'A+',
    CalculatedScoreRaw: '100.0',
    StandardViews: {},
    GradeCalculationSummary: { AssignmentGradeCalc: [Array] },
    Assignments: { Assignment: [Array] }
  }
}
```

Assignments Example

```javascript
{
  Assignment: [
    {
      GradebookID: '12345',
      Measure: 'Do your work', //assignment name
      Type: 'Assignments',
      Date: '3/5/2020', //date assigned
      DueDate: '3/5/2020',
      Score: 'Not Graded',
      ScoreType: 'Raw Score',
      Points: '10.0000 Points Possible',
      Notes: '',
      TeacherID: '123456',
      StudentID: '789',
      MeasureDescription: '',
      HasDropBox: 'false',
      DropStartDate: '3/5/2020',
      DropEndDate: '3/6/2020',
      Resources: {},
      Standards: {}
    }
  ]
}
```
