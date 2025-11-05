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

    var data = {"OkPercent": 99.96976842614427, "KoPercent": 0.03023157385573493};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45951992260717095, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.45614035087719296, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.15579136310843628, 500, 1500, "/api/offeringservice/getplafon"], "isController": false}, {"data": [0.07916446324695928, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.7618453865336658, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.9755043227665706, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.054625366262034326, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.8817492895484685, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.21371769383697814, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [1.0, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/login"], "isController": false}, {"data": [0.996427070197562, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "esbmockupservice/signature_validate_event"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 49617, 15, 0.03023157385573493, 4280.0715682124965, 35, 34805, 5243.5, 15617.900000000001, 23117.500000000007, 27949.0, 254.44484900077435, 558.362235762573, 155.95784404631257], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getinsurance", 912, 1, 0.10964912280701754, 4078.135964912278, 57, 9234, 6668.0, 7945.3, 8260.8, 8760.74, 4.822411523025429, 26.29337096876537, 3.1364512444677106], "isController": false}, {"data": ["/api/offeringservice/getplafon", 9471, 0, 0.0, 3929.534473656443, 55, 8494, 4393.0, 6498.0, 6937.4, 7558.0, 49.011338173576, 16.84764749716675, 29.387657850171546], "isController": false}, {"data": ["/api/offeringservice/getoffering", 9455, 4, 0.04230565838180857, 5925.097091485969, 64, 9385, 6867.0, 8013.0, 8262.199999999999, 8729.320000000002, 52.52894508766862, 433.90450994397094, 32.98448407360441], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 401, 0, 0.0, 2273.9800498753116, 136, 13414, 170.0, 10139.400000000001, 11951.499999999998, 13332.560000000001, 2.169056595608877, 7.710318367203432, 1.7348216326207722], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 347, 0, 0.0, 275.0288184438041, 165, 1449, 218.0, 449.79999999999995, 499.59999999999945, 842.0, 1.8747636285050515, 0.8165474397590361, 1.1882046825193149], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 7167, 9, 0.12557555462536626, 13700.904283521719, 224, 34805, 10469.0, 25512.8, 27495.6, 29765.039999999986, 37.843546215381366, 18.57904677475777, 24.354391558531564], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 9501, 0, 0.0, 376.1190401010424, 55, 1717, 313.0, 747.8000000000011, 1013.0, 1292.0, 49.167602477786346, 18.773957586732873, 30.009522996695768], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 2012, 1, 0.04970178926441352, 5624.516401590442, 57, 9182, 7042.0, 8043.4, 8277.0, 8699.139999999998, 10.638804139192784, 5.785523103178422, 6.846652273171919], "isController": false}, {"data": ["/api/informationservice/tnc", 429, 0, 0.0, 48.083916083916066, 41, 315, 46.0, 51.0, 53.0, 71.69999999999987, 2.268532962471379, 12.310778977005324, 1.5086630346123135], "isController": false}, {"data": ["/api/loginservice/v2/login", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 40.70814855875831, 2.6092190964523283], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 9516, 0, 0.0, 134.27080706179092, 86, 3481, 117.0, 162.0, 187.0, 401.4899999999998, 49.23758323976675, 53.27660373990386, 28.080809191429474], "isController": false}, {"data": ["esbmockupservice/signature_validate_event", 405, 0, 0.0, 39.80493827160495, 35, 70, 39.0, 44.0, 46.0, 52.94, 2.2444636563144247, 0.5085112971337368, 1.3436095911335373], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 15, 100.0, 0.03023157385573493], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 49617, 15, "502/Bad Gateway", 15, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getinsurance", 912, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getoffering", 9455, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 7167, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 2012, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
