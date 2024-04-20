const xml2json = require("xml2json");

class StudentVueClient {
  constructor(username, password, url) {
    this.username = username;
    this.password = password;

    const host = new URL(url).host;
    const endpoint = `https://${host}/Service/PXPCommunication.asmx`;

    const wsdlURL = endpoint + "?WSDL";

    this.endpoint = endpoint;
    this.wsdlURL = wsdlURL;
  }

  getMessages() {
    return this._xmlJsonSerialize(this._makeServiceRequest("GetPXPMessages"));
  }

  getCalendar() {
    return this._xmlJsonSerialize(this._makeServiceRequest("StudentCalendar"));
  }

  getAttendance() {
    return this._xmlJsonSerialize(this._makeServiceRequest("Attendance"));
  }

  getGradebook(reportPeriod) {
    let params = {};
    if (typeof reportPeriod !== "undefined") {
      params.ReportPeriod = reportPeriod;
    }
    return this._xmlJsonSerialize(
      this._makeServiceRequest("Gradebook", params)
    );
  }

  getClassNotes() {
    return this._xmlJsonSerialize(this._makeServiceRequest("StudentHWNotes"));
  }

  getStudentInfo() {
    return this._xmlJsonSerialize(this._makeServiceRequest("StudentInfo"));
  }

  getSchedule(termIndex) {
    let params = {};
    if (typeof termIndex !== "undefined") {
      params.TermIndex = termIndex;
    }
    return this._xmlJsonSerialize(
      this._makeServiceRequest("StudentClassList", params)
    );
  }

  getSchoolInfo() {
    return this._xmlJsonSerialize(
      this._makeServiceRequest("StudentSchoolInfo")
    );
  }

  listReportCards() {
    return this._xmlJsonSerialize(
      this._makeServiceRequest("GetReportCardInitialData")
    );
  }

  getReportCard(documentGuid) {
    return this._xmlJsonSerialize(
      this._makeServiceRequest("GetReportCardDocumentData", {
        DocumentGU: documentGuid,
      })
    );
  }

  listDocuments() {
    return this._xmlJsonSerialize(
      this._makeServiceRequest("GetStudentDocumentInitialData")
    );
  }

  getDocument(documentGuid) {
    return this._xmlJsonSerialize(
      this._makeServiceRequest("GetContentOfAttachedDoc", {
        DocumentGU: documentGuid,
      })
    );
  }

  _xmlJsonSerialize(servicePromise) {
    return servicePromise.then((result) =>
      xml2json.toJson(result[0].ProcessWebServiceRequestResult)
    );
  }

  async _makeServiceRequest(
    methodName,
    params = {},
    serviceHandle = "PXPWebServices"
  ) {
    let paramStr = `<Parms>${Object.entries(params).reduce(
      (acc, [key, value]) => `${acc}<${key}>${value}</${key}>`,
      ""
    )}</Parms>`;
    paramStr = paramStr.replaceAll("<", "&lt;").replaceAll(">", "&gt;");

    return await fetch(this.wsdlURL, {
      method: "POST",
      headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
      body: `<?xml version="1.0" encoding="utf-8"?>
            <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
                <soap12:Body>
                    <ProcessWebServiceRequest xmlns="http://edupoint.com/webservices/">
                        <userID>${this.userID}</userID>
                        <password>${this.password}</password>
                        <skipLoginLog>true</skipLoginLog>
                        <parent>false</parent>
                        <webServiceHandleName>${serviceHandle}</webServiceHandleName>
                        <methodName>${methodName}</methodName>
                        <paramStr>${paramStr}</paramStr>
                    </ProcessWebServiceRequest>
                </soap12:Body>
            </soap12:Envelope>`
        .split("\n")
        .map((s) => s.trim())
        .join("\n"),
    });
  }
}

/**
 * @deprecated Create an instance of StudentVueClient directly instead
 */
function login(url, username, password) {
  return new StudentVueClient(username, password, url);
}

function getDistrictUrls(zipCode) {
  return soap
    .createClientAsync(
      "https://support.edupoint.com/Service/HDInfoCommunication.asmx?WSDL",
      {
        endpoint:
          "https://support.edupoint.com/Service/HDInfoCommunication.asmx",
        escapeXML: false,
      }
    )
    .then((client) => {
      const supportClient = new StudentVueClient(
        "EdupointDistrictInfo",
        "Edup01nt",
        client
      );
      return supportClient._xmlJsonSerialize(
        supportClient._makeServiceRequest(
          "GetMatchingDistrictList",
          {
            MatchToDistrictZipCode: zipCode,
            Key: "5E4B7859-B805-474B-A833-FDB15D205D40", // idk how safe this is
          },
          "HDInfoServices"
        )
      );
    });
}

module.exports = { login, getDistrictUrls };
