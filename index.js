const soap = require('soap');

class StudentVueClient {
    // serialize should be a function that takes XML input and returns a promise.
    constructor(username, password, client, serialize) {
        this.username = username;
        this.password = password;

        this.client = client;

        if (serialize) {
            this.serialize = serialize;
        } else {
            this.serialize = function (data) {
                return Promise.resolve(data);
            };
        }
    }

    getMessages() {
        return this._serialize(this._makeServiceRequest('GetPXPMessages'));
    }

    getCalendar() {
        return this._serialize(this._makeServiceRequest('StudentCalendar'));
    }

    getAttendance() {
        return this._serialize(this._makeServiceRequest('Attendance'));
    }

    getGradebook(reportPeriod) {
        let params = {};
        if (typeof reportPeriod !== 'undefined') {
            params.ReportPeriod = reportPeriod;
        }
        return this._serialize(this._makeServiceRequest('Gradebook', params));
    }

    getClassNotes() {
        return this._serialize(this._makeServiceRequest('StudentHWNotes'));
    }

    getStudentInfo() {
        return this._serialize(this._makeServiceRequest('StudentInfo'));
    }

    getSchedule(termIndex) {
        let params = {};
        if (typeof termIndex !== 'undefined') {
            params.TermIndex = termIndex;
        }
        return this._serialize(this._makeServiceRequest('StudentClassList', params));
    }

    getSchoolInfo() {
        return this._serialize(this._makeServiceRequest('StudentSchoolInfo'));
    }

    listReportCards() {
        return this._serialize(this._makeServiceRequest('GetReportCardInitialData'));
    }

    getReportCard(documentGuid) {
        return this._serialize(this._makeServiceRequest('GetReportCardDocumentData', { DocumentGU: documentGuid }));
    }

    listDocuments() {
        return this._serialize(this._makeServiceRequest('GetStudentDocumentInitialData'));
    }

    getDocument(documentGuid) {
        return this.serialize(this._makeServiceRequest('GetContentOfAttachedDoc', { DocumentGU: documentGuid }));
    }

    _serialize(servicePromise) {
        return servicePromise.then((result) => {
            return this.serialize(result[0].ProcessWebServiceRequestResult)
        });
    }

    _makeServiceRequest(methodName, params = {}, serviceHandle = 'PXPWebServices') {
        let paramStr = '&lt;Parms&gt;';
        Object.entries(params).forEach(([key, value]) => {
            paramStr += '&lt;' + key + '&gt;';
            paramStr += value;
            paramStr += '&lt;/' + key + '&gt;';
        });
        paramStr += '&lt;/Parms&gt;';

        return this.client.ProcessWebServiceRequestAsync({
            userID: this.username,
            password: this.password,
            skipLoginLog: 1,
            parent: 0,
            webServiceHandleName: serviceHandle,
            methodName,
            paramStr
        });
    }
}

function login(url, username, password, soapOptions = {}, serialize) {
    const host = new URL(url).host;
    const endpoint = `https://${ host }/Service/PXPCommunication.asmx`;

    const resolvedOptions = Object.assign({
        endpoint: endpoint, // enforces https
        escapeXML: false
    }, soapOptions);

    const wsdlURL = endpoint + '?WSDL';
    return soap.createClientAsync(wsdlURL, resolvedOptions)
        .then(client => new StudentVueClient(username, password, client, serialize));
}

function getDistrictUrls(zipCode, serialize) {
    return soap.createClientAsync('https://support.edupoint.com/Service/HDInfoCommunication.asmx?WSDL', {
        endpoint: 'https://support.edupoint.com/Service/HDInfoCommunication.asmx',
        escapeXML: false
    })
        .then(client => {
            const supportClient = new StudentVueClient('EdupointDistrictInfo', 'Edup01nt', client, serialize);
            return supportClient._serialize(supportClient._makeServiceRequest('GetMatchingDistrictList', {
                MatchToDistrictZipCode: zipCode,
                Key: '5E4B7859-B805-474B-A833-FDB15D205D40' // idk how safe this is
            }, 'HDInfoServices'));
        });
}

module.exports = { login, getDistrictUrls };
