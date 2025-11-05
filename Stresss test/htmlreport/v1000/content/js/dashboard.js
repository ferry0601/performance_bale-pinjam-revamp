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

    var data = {"OkPercent": 99.97354049048201, "KoPercent": 0.02645950951799098};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8642969054265779, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999852090454904, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.9999027962284937, 500, 1500, "/api/offeringservice/getplafon"], "isController": false}, {"data": [0.9996432856633265, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.49199432174573304, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.6908843717876446, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.3263550795196365, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9988671672708441, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9999507389162562, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.9997204039340811, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.5, 500, 1500, "/api/loginservice/v2/login"], "isController": false}, {"data": [0.9967822262466852, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [0.9994391475042064, 500, 1500, "esbmockupservice/signature_validate_event"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 336363, 89, 0.02645950951799098, 815.895660343151, 0, 300220, 90.0, 1634.9000000000015, 5257.550000000007, 39142.98, 295.21607823208956, 703.1742147202556, 188.9071913022357], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getinsurance", 30424, 0, 0.0, 84.06340389166394, 53, 1114, 77.0, 117.0, 138.0, 198.0, 31.49903040882271, 171.92195405752943, 20.48667407448821], "isController": false}, {"data": ["/api/offeringservice/getplafon", 30863, 3, 0.009720377150633444, 81.58351424035278, 1, 471, 75.0, 114.0, 133.0, 195.0, 31.875427322621093, 10.963550461637531, 19.110947218039364], "isController": false}, {"data": ["/api/offeringservice/getoffering", 30837, 0, 0.0, 95.71962253137454, 61, 1176, 88.0, 131.0, 152.0, 216.0, 31.86423934810418, 263.3156185191969, 20.008501856280265], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 30291, 16, 0.052820969925060246, 1896.6173780991005, 130, 39686, 1068.0, 7080.9000000000015, 10985.650000000005, 21048.43000000009, 31.203997770775107, 110.87178666863767, 24.95710368580548], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 30157, 0, 0.0, 2072.891401664621, 146, 50973, 561.0, 8945.500000000007, 20901.600000000006, 36321.93000000001, 31.023900861780742, 13.512363070658408, 19.662609042280955], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 30810, 4, 0.012982797792924375, 4385.685329438518, 212, 300220, 1583.0, 22090.600000000006, 32971.65000000001, 38378.94000000001, 27.107877209498753, 13.31821102225336, 17.44483522104886], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 30896, 19, 0.061496633868461936, 77.5411380113935, 0, 1085, 69.0, 97.0, 116.0, 191.9900000000016, 31.88701658855572, 12.215191603920752, 19.450321744819753], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 30450, 0, 0.0, 83.46738916256183, 54, 3122, 77.0, 117.0, 136.0, 198.0, 31.507224932613855, 17.138207311978437, 20.27662229550052], "isController": false}, {"data": ["/api/informationservice/tnc", 30401, 0, 0.0, 50.694812670635756, 41, 1115, 47.0, 54.0, 64.0, 110.0, 31.49784961722047, 170.93120148720132, 20.947300380202282], "isController": false}, {"data": ["/api/loginservice/v2/login", 1, 0, 0.0, 1425.0, 1425, 1425, 1425.0, 1425.0, 1425.0, 1425.0, 0.7017543859649122, 12.883771929824562, 0.8257949561403508], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 30922, 47, 0.15199534312140223, 111.67084923355557, 0, 4026, 102.0, 127.0, 146.0, 218.9900000000016, 31.861795520677916, 34.54125160902222, 18.14356091010444], "isController": false}, {"data": ["esbmockupservice/signature_validate_event", 30311, 0, 0.0, 45.90359935337007, 34, 6824, 40.0, 47.0, 55.0, 101.0, 31.468930776865545, 7.129679629133601, 18.838334537322833], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 66, 74.15730337078652, 0.019621658743678706], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, 4.49438202247191, 0.0011891914390108305], "isController": false}, {"data": ["400", 19, 21.348314606741575, 0.005648659335301445], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 336363, 89, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 66, "400", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["/api/offeringservice/getplafon", 30863, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 30291, 16, "400", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 30810, 4, "400", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 30896, 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 30922, 47, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 44, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
