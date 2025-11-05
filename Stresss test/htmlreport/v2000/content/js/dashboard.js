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

    var data = {"OkPercent": 99.16150037910887, "KoPercent": 0.8384996208911288};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8376707848296984, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9848146984924623, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.6141295453801591, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.16280094413847365, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9980106516290727, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9998371706776956, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.9979962429555417, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.9878389348920279, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.19713173731030875, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.9847566054709626, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.9878186435895024, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9999346618752042, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.9872886845002915, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.9886454315733475, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 403578, 3384, 0.8384996208911288, 1818.1325295234262, 0, 303544, 161.0, 25928.700000000004, 41703.9, 49138.94000000001, 350.1661123802963, 853.4366464452645, 222.81016794231707], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 31840, 0, 0.0, 141.8728015075385, 62, 2383, 104.0, 285.0, 431.0, 1470.9900000000016, 32.86512910710894, 271.58664307066005, 20.63699024987407], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 30553, 2, 0.006546002029260629, 4784.3558079403, 152, 303544, 580.0, 33226.300000000025, 41213.95, 48224.990000000005, 29.801757301932877, 12.982755122923836, 18.88740961590233], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 31775, 5, 0.015735641227380016, 8947.434303697897, 219, 300311, 2278.0, 43177.20000000001, 48162.850000000006, 64831.660000000054, 27.637091716874412, 13.578234068390822, 17.78542017566405], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 31920, 2, 0.006265664160401002, 79.51318922305747, 0, 5521, 70.0, 97.0, 111.0, 219.950000000008, 32.94352229415717, 12.583187279976592, 20.105870461235114], "isController": false}, {"data": ["/api/informationservice/tnc", 30707, 0, 0.0, 48.70394372618634, 41, 1107, 46.0, 53.0, 58.0, 87.0, 31.81169284576193, 172.63435267958891, 21.15601838668347], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 31940, 29, 0.09079524107701942, 107.55801502817764, 0, 3170, 101.0, 121.0, 133.0, 177.9900000000016, 32.94277816741615, 35.684548193897236, 18.770619855914024], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 385.0, 385, 385, 385.0, 385.0, 385.0, 385.0, 2.5974025974025974, 47.742491883116884, 3.000710227272727], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 30795, 0, 0.0, 121.83341451534298, 54, 2339, 88.0, 214.0, 339.9500000000007, 1374.0, 31.8508229292828, 173.84204038257963, 20.715476631740568], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 30576, 3344, 10.936682365253795, 8852.328427524828, 33, 62939, 8658.5, 29447.700000000004, 35807.9, 51569.71000000005, 31.76209179385804, 101.73518794369386, 25.403469901532944], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 30013, 1, 0.003331889514543698, 135.94772265351742, 57, 2336, 97.0, 270.0, 420.0, 1443.9900000000016, 31.219086987591627, 173.28483835550057, 20.030214991062206], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 31893, 0, 0.0, 124.07268052550748, 53, 2277, 89.0, 248.0, 380.9500000000007, 1422.9600000000064, 32.90136090914343, 11.309842812518054, 19.727964451380924], "isController": false}, {"data": ["esbmockupservice/signature", 30610, 0, 0.0, 42.01983012087544, 34, 669, 39.0, 46.0, 51.0, 84.0, 31.77862723805213, 7.199845233621185, 19.023729000904254], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 30878, 0, 0.0, 123.53666040546601, 53, 2366, 88.0, 222.0, 366.0, 1338.9700000000048, 31.917290823804727, 17.361260731307848, 20.540522121960272], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 30076, 1, 0.0033249102274238596, 124.06410426918463, 1, 2344, 92.0, 237.0, 352.0, 1286.9900000000016, 31.267120973484907, 11.23874344724791, 18.53370253072029], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 464.0, 464, 464, 464.0, 464.0, 464.0, 464.0, 2.155172413793103, 39.567618534482754, 2.536115975215517], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 1417, 41.87352245862884, 0.35110932706936454], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 32, 0.9456264775413712, 0.007929074429230533], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, 0.0591016548463357, 4.955671518269083E-4], "isController": false}, {"data": ["400", 382, 11.288416075650119, 0.09465332599893948], "isController": false}, {"data": ["502/Bad Gateway", 1540, 45.508274231678485, 0.3815867069067194], "isController": false}, {"data": ["Response was null", 11, 0.32505910165484636, 0.0027256193350479957], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 403578, 3384, "502/Bad Gateway", 1540, "503/Service Temporarily Unavailable", 1417, "400", 382, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 32, "Response was null", 11], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 30553, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "400", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 31775, 5, "400", 4, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 31920, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 31940, 29, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 30576, 3344, "502/Bad Gateway", 1539, "503/Service Temporarily Unavailable", 1417, "400", 377, "Response was null", 11, "", ""], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 30013, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 30076, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
