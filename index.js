const request = require("request")
let xmlParser = require('xml2json');


function getGrades(url, id, password) {
  return new Promise(resolve => {
    request.post({
      url: url + '//Service/PXPCommunication.asmx',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://edupoint.com/webservices/ProcessWebServiceRequest'
      },
      body: '<v:Envelope xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns:d="http://www.w3.org/2001/XMLSchema" xmlns:c="http://schemas.xmlsoap.org/soap/encoding/" xmlns:v="http://schemas.xmlsoap.org/soap/envelope/"><v:Header /><v:Body><ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/" id="o0" c:root="1"><userID i:type="d:string">' + id.toString() + '</userID><password i:type="d:string">' + password.toString() + '</password><skipLoginLog i:type="d:string">true</skipLoginLog><parent i:type="d:string">false</parent><webServiceHandleName i:type="d:string">PXPWebServices</webServiceHandleName><methodName i:type="d:string">Gradebook</methodName><paramStr i:type="d:string">&lt;Parms&gt;&lt;ChildIntID&gt;0&lt;/ChildIntID&gt;&lt;/Parms&gt;</paramStr></ProcessWebServiceRequest></v:Body></v:Envelope>'
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const res2 = xmlParser.toJson(JSON.parse(xmlParser.toJson(body))["soap:Envelope"]["soap:Body"]["ProcessWebServiceRequestResponse"]["ProcessWebServiceRequestResult"])
        resolve(JSON.parse(res2)["Gradebook"]["Courses"]["Course"])
      }
    })
  })
}

function getUrls(zip) {
  return new Promise(resolve => {
    request.post({
      url: 'https://support.edupoint.com/Service/HDInfoCommunication.asmx',
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://edupoint.com/webservices/ProcessWebServiceRequest'
      },
      body: '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/"><userID>EdupointDistrictInfo</userID><password>Edup01nt</password><skipLoginLog>1</skipLoginLog><parent>0</parent><webServiceHandleName>HDInfoServices</webServiceHandleName><methodName>GetMatchingDistrictList</methodName><paramStr>&lt;Parms&gt;&lt;Key&gt;5E4B7859-B805-474B-A833-FDB15D205D40&lt;/Key&gt;&lt;MatchToDistrictZipCode&gt;' + zip.toString() + '&lt;/MatchToDistrictZipCode&gt;&lt;/Parms&gt;</paramStr></ProcessWebServiceRequest></soap:Body></soap:Envelope>'
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        const res = xmlParser.toJson(JSON.parse(xmlParser.toJson(body))["soap:Envelope"]["soap:Body"]["ProcessWebServiceRequestResponse"]["ProcessWebServiceRequestResult"])
        resolve(JSON.parse(res)["DistrictLists"]["DistrictInfos"]["DistrictInfo"]);
      }
    })
  })
}

exports.getUrls = getUrls
exports.getGrades = getGrades
