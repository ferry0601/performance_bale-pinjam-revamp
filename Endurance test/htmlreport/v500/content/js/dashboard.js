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

    var data = {"OkPercent": 99.48421172422564, "KoPercent": 0.5157882757743518};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6396678336892417, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.292847882454624, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.9933879231072382, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.2872340425531915, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9925839693010822, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9964618005503866, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.990429796956503, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.3159958180867747, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.9897360703812317, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.2904487714825722, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.4286422841369792, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9976152971033517, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.32711945422152694, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.4149649430324277, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 298766, 1541, 0.5157882757743518, 2577.991120140816, 0, 19371, 181.0, 9383.0, 10613.600000000006, 12634.94000000001, 147.5439385775995, 372.8256027742207, 93.5567558595573], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 23140, 254, 1.097666378565255, 5044.244511668097, 0, 16296, 6198.0, 10353.800000000003, 11269.0, 12856.920000000013, 11.440521893470647, 103.0419173387994, 7.147520534012563], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 22837, 43, 0.1882909313832815, 218.72014712965748, 0, 2679, 205.0, 272.0, 307.0, 497.9900000000016, 11.349308938059123, 4.985144201189946, 7.179523977384377], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 23077, 144, 0.6239979200069333, 6014.396672011092, 0, 19371, 7217.0, 12283.0, 13392.95, 15299.980000000003, 11.412274537478222, 5.699814139305956, 7.311324018660357], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 23193, 172, 0.7416030698917777, 62.9849523563145, 0, 342, 60.0, 69.0, 80.0, 119.9900000000016, 11.488269017585328, 4.558609492316635, 6.959882606123956], "isController": false}, {"data": ["/api/informationservice/tnc", 22893, 78, 0.34071550255536626, 48.70663521600469, 0, 1063, 46.0, 52.0, 57.0, 97.0, 11.360168400242358, 61.53174448823044, 7.529214837312593], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 23197, 183, 0.788895115747726, 106.38655860671639, 0, 3236, 99.0, 115.0, 134.0, 211.0, 11.486961602836459, 12.547670420993404, 6.499758439304355], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 358.0, 358, 358, 358.0, 358.0, 358.0, 358.0, 2.793296089385475, 51.34318261173185, 3.227020775139665], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 22956, 103, 0.4486844397978742, 4812.841392228645, 0, 15521, 5673.0, 10269.0, 11126.800000000003, 12637.94000000001, 11.360436522645404, 61.8295436859163, 7.361684792425584], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 22847, 53, 0.23197794021096863, 200.88142863395657, 0, 3283, 172.0, 267.0, 342.0, 586.9400000000096, 11.350882727749225, 40.31381745051657, 9.059415921796557], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 22751, 103, 0.45272735264383984, 5128.764362006078, 0, 16562, 6269.0, 10391.0, 11280.95, 12882.990000000002, 11.288577949786642, 62.43098115215962, 7.230671970359482], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 23186, 178, 0.7677046493573708, 3482.13426205467, 0, 15502, 2904.5, 9019.0, 9946.900000000001, 11515.94000000001, 11.460652386243659, 4.0674876371412925, 6.831013889108574], "isController": false}, {"data": ["esbmockupservice/signature", 22854, 54, 0.2362824888422158, 41.04253084799152, 0, 542, 39.0, 45.0, 49.0, 85.0, 11.351512442258977, 2.630132664655044, 6.779331507971986], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 23013, 106, 0.46060922087515754, 4726.96745317862, 0, 15953, 5644.0, 10203.0, 11093.95, 12589.0, 11.38548932669126, 6.274692245963774, 7.298211235322871], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 22820, 70, 0.3067484662576687, 3612.8204206836167, 0, 15098, 3154.5, 9073.900000000001, 10000.0, 11555.950000000008, 11.31975326707822, 4.108380216071123, 6.6979933147047666], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 417.0, 417, 417, 417.0, 417.0, 417.0, 417.0, 2.398081534772182, 44.02727817745804, 2.821961181055156], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1190, 77.2225827384815, 0.398305028015236], "isController": false}, {"data": ["502/Bad Gateway", 347, 22.517845554834523, 0.11614440732881251], "isController": false}, {"data": ["400", 4, 0.25957170668397145, 0.0013388404303033142], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 298766, 1541, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1190, "502/Bad Gateway", 347, "400", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 23140, 254, "502/Bad Gateway", 137, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 117, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 22837, 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 23077, 144, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 104, "502/Bad Gateway", 40, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 23193, 172, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 172, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/informationservice/tnc", 22893, 78, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 78, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 23197, 183, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 182, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 22956, 103, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 84, "502/Bad Gateway", 19, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 22847, 53, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 48, "400", 4, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 22751, 103, "502/Bad Gateway", 65, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 38, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 23186, 178, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 138, "502/Bad Gateway", 40, "", "", "", "", "", ""], "isController": false}, {"data": ["esbmockupservice/signature", 22854, 54, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 54, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 23013, 106, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 91, "502/Bad Gateway", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 22820, 70, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 41, "502/Bad Gateway", 29, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
