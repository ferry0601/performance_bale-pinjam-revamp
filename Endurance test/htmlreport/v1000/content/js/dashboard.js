/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.47955259410377, "KoPercent": 3.520447405896231};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.795117805656886, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9193118266461454, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.5773249015263417, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.13121871566353316, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9617613947544575, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9671903313983845, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.9579093854085869, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.920582872377917, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.24714808437365476, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.9204484125148417, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.920949308334982, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9695660861679398, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.9203172320964239, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.9209237498267392, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 848983, 29888, 3.520447405896231, 1600.9211845231725, 0, 120024, 399.0, 7706.0, 8315.0, 12611.970000000005, 429.5624851370428, 1093.5319157498013, 264.0827468262843], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 65623, 2392, 3.6450634686009478, 315.1620925590121, 0, 60028, 89.0, 3010.4000000000087, 6983.0, 8333.920000000013, 33.254887413889385, 294.76561284576, 20.134579841305374], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 64992, 2068, 3.1819300837026097, 4506.674067577591, 0, 60027, 581.0, 20766.200000000026, 37556.95, 54592.26000000012, 33.06020546649114, 17.03442234231902, 20.286480561639948], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 65528, 2986, 4.556830667806128, 9828.0830332072, 0, 60060, 2265.0, 39953.000000000015, 49622.750000000015, 60007.990000000005, 33.20418791924544, 19.58967492992096, 20.488891745685045], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 65732, 2504, 3.8094078987403397, 73.1587506845983, 0, 60023, 66.0, 109.0, 124.0, 187.0, 33.38451154099903, 15.861351558290083, 19.60007282800313], "isController": false}, {"data": ["/api/informationservice/tnc", 65118, 2121, 3.2571639178107437, 54.289812340673585, 0, 60027, 48.0, 89.0, 104.0, 160.0, 33.136081426075826, 177.07767307083384, 21.319014201991024], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 65751, 2634, 4.006022722087877, 115.41219144956038, 0, 60042, 102.0, 128.0, 148.0, 237.0, 33.33703457517603, 38.377396431299374, 18.250881358213793], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 373.0, 373, 373, 373.0, 373.0, 373.0, 373.0, 2.680965147453083, 49.27844336461126, 3.097247821715818], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 65263, 2220, 3.4016211329543538, 315.85575287682235, 0, 60036, 78.0, 3734.9000000000015, 7044.9000000000015, 8372.990000000002, 33.10599162496481, 177.6836043610675, 20.820510553444745], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 65044, 2068, 3.1793862616075272, 4350.12682184371, 0, 60013, 1835.0, 12318.200000000012, 18909.600000000006, 33241.85000000002, 33.08477197123064, 116.98797423072716, 25.621674289031425], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 64851, 2063, 3.18113830164531, 321.6712001356962, 0, 60022, 82.0, 3722.9000000000015, 6813.9000000000015, 8315.990000000002, 32.98534374674157, 180.26991531741228, 20.506526513436807], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 65711, 2476, 3.768014487680906, 282.9070018718333, 0, 60030, 76.0, 2285.800000000003, 6536.850000000002, 7967.980000000003, 33.29222743955204, 14.482203621323269, 19.227464156049052], "isController": false}, {"data": ["esbmockupservice/signature", 65059, 1979, 3.0418543168508583, 48.95975960282216, 0, 120024, 41.0, 85.0, 97.0, 139.0, 33.14078171880333, 10.25376447480019, 19.23568104308979], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 65378, 2293, 3.507296032304445, 308.15659702040404, 0, 60036, 78.0, 3651.900000000016, 6731.9000000000015, 8293.980000000003, 33.154774854544065, 20.584374408090813, 20.620872007903024], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 64931, 2084, 3.209560918513499, 296.9481449538743, 0, 60037, 77.0, 2928.0, 6189.750000000004, 7955.970000000005, 33.016714040913044, 14.4848757824378, 18.961660627297736], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 428.0, 428, 428, 428.0, 428.0, 428.0, 428.0, 2.336448598130841, 42.89573598130841, 2.7494341413551404], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 6806, 22.771680942184155, 0.8016650510080885], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21863, 73.1497591006424, 2.5751987966779075], "isController": false}, {"data": ["400", 5, 0.01672912205567452, 5.889399434382078E-4], "isController": false}, {"data": ["502/Bad Gateway", 660, 2.2082441113490363, 0.07774007253384344], "isController": false}, {"data": ["401", 1, 0.0033458244111349037, 1.1778798868764157E-4], "isController": false}, {"data": ["Response was null", 1, 0.0033458244111349037, 1.1778798868764157E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 552, 1.8468950749464668, 0.06501896975557815], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 848983, 29888, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 21863, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 6806, "502/Bad Gateway", 660, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 552, "400", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 65623, 2392, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1705, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 638, "502/Bad Gateway", 44, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 5, "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 64992, 2068, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1696, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 303, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 69, "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 65528, 2986, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1696, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 558, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 444, "502/Bad Gateway", 287, "401", 1], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 65732, 2504, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1706, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 795, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", "", "", ""], "isController": false}, {"data": ["/api/informationservice/tnc", 65118, 2121, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1628, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 491, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", ""], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 65751, 2634, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1701, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 928, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 65263, 2220, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1571, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 582, "502/Bad Gateway", 64, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", ""], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 65044, 2068, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1862, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 193, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 9, "400", 4, "", ""], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 64851, 2063, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1666, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 343, "502/Bad Gateway", 50, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 65711, 2476, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1724, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 694, "502/Bad Gateway", 55, "400", 1, "Response was null", 1], "isController": false}, {"data": ["esbmockupservice/signature", 65059, 1979, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1724, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 253, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 65378, 2293, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1555, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 636, "502/Bad Gateway", 99, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 3, "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 64931, 2084, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1629, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 392, "502/Bad Gateway", 61, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
