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

    var data = {"OkPercent": 67.58017825020202, "KoPercent": 32.419821749797975};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3790812471961176, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.010722952762571252, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.5846572507234434, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.002815411068911437, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9874808188929226, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9982757299409917, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.9649431307991619, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.0060362941738299905, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.3171182738003986, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.014543216051401419, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.011567401639651106, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9995305524152599, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.008839726547664262, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.016444972591712348, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 684319, 221855, 32.419821749797975, 5066.087741243706, 0, 60032, 143.0, 31791.900000000016, 40191.0, 43776.990000000005, 327.8039802911114, 527.4422952478066, 207.71757838659104], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 53157, 33256, 62.56184510036307, 8124.034802566002, 0, 58086, 73.0, 30788.20000000001, 38212.700000000004, 44710.97, 25.49756881638268, 92.50445627808742, 15.90646657263428], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 52181, 8, 0.01533125083842778, 2030.450393821497, 0, 24635, 586.0, 7999.700000000019, 12280.95, 15987.820000000029, 25.83298389999292, 11.259257211672939, 16.37015251357468], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 52923, 36834, 69.5992290686469, 7629.9580144738875, 0, 60032, 61.0, 32698.700000000004, 40614.65000000001, 47950.82000000003, 25.62545666362103, 10.155921177226157, 16.396341435919894], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 53438, 655, 1.2257195254313409, 79.87886896964814, 0, 1482, 64.0, 91.0, 114.0, 188.0, 25.900530292492103, 10.52955096382999, 15.614957958531427], "isController": false}, {"data": ["/api/informationservice/tnc", 52196, 70, 0.13410989347842747, 69.09058165376754, 0, 1915, 53.0, 91.0, 104.0, 163.0, 25.77743185742111, 139.7811619388781, 17.120665528487727], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 53456, 947, 1.7715504340017958, 151.81248129302492, 0, 4116, 104.0, 147.0, 192.0, 388.9900000000016, 25.901458556018884, 28.63875658774715, 14.51023347095825], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 387.0, 387, 387, 387.0, 387.0, 387.0, 387.0, 2.5839793281653747, 47.495760658914726, 2.985202680878553], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 52350, 40889, 78.10697230181471, 4469.409799426986, 0, 57862, 51.0, 23491.0, 30766.900000000045, 41492.780000000035, 25.555933077139375, 37.331001915077906, 16.59752647949814], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 52184, 162, 0.3104399816035566, 4141.863502222948, 0, 27771, 2224.0, 9947.900000000001, 11666.850000000002, 13757.87000000002, 25.803338057154612, 91.49425165826153, 20.634071428090206], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 51983, 22960, 44.168285785737645, 11878.663178346818, 0, 57085, 9176.5, 34681.20000000001, 40028.75, 45964.54000000007, 25.461506021411314, 82.78137359527138, 16.303459078030016], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 53426, 28994, 54.26945681877737, 9048.542282783617, 0, 59379, 3737.5, 28917.600000000006, 33588.10000000001, 41841.890000000014, 25.614926522375544, 9.15679494376568, 15.218946925295471], "isController": false}, {"data": ["esbmockupservice/signature", 52189, 15, 0.02874168886163751, 58.34313744275562, 0, 3478, 43.0, 63.0, 85.0, 142.0, 25.80129409391673, 5.8617262105310255, 15.441061951668736], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 52660, 39266, 74.56513482719332, 5381.758621344495, 0, 59027, 55.0, 27163.800000000047, 34729.15000000002, 42897.96000000001, 25.697432013554348, 10.156288695899244, 16.489025579918476], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 52174, 17799, 34.1146931421781, 12875.221566297414, 0, 57764, 13153.0, 32558.700000000004, 36501.700000000004, 42206.93000000001, 25.55012793672947, 8.97285964223626, 15.143985730310598], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 43.71279761904762, 2.8018043154761907], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 214907, 96.86822474138513, 31.40450579335076], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 3079, 1.3878434112370692, 0.44993636008937354], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 29, 0.013071600820355639, 0.004237789685804428], "isController": false}, {"data": ["400", 167, 0.0752743909310135, 0.024403823363080668], "isController": false}, {"data": ["502/Bad Gateway", 3592, 1.6190755223006017, 0.5249013983244656], "isController": false}, {"data": ["401", 9, 0.004056703702868991, 0.001315176109387581], "isController": false}, {"data": ["500", 2, 9.014897117486647E-4, 2.9226135764168464E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 70, 0.031552139911203265, 0.010229147517458962], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 684319, 221855, "503/Service Temporarily Unavailable", 214907, "502/Bad Gateway", 3592, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 3079, "400", 167, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 70], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 53157, 33256, "503/Service Temporarily Unavailable", 32531, "502/Bad Gateway", 375, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 346, "401", 2, "400", 1], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 52181, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 52923, 36834, "503/Service Temporarily Unavailable", 36218, "502/Bad Gateway", 308, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 235, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 70, "400", 3], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 53438, 655, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 654, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/informationservice/tnc", 52196, 70, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 68, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 53456, 947, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 922, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 25, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 52350, 40889, "503/Service Temporarily Unavailable", 40556, "502/Bad Gateway", 255, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 75, "400", 2, "401", 1], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 52184, 162, "400", 153, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 51983, 22960, "503/Service Temporarily Unavailable", 22099, "502/Bad Gateway", 754, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 100, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 4, "401", 2], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 53426, 28994, "503/Service Temporarily Unavailable", 27642, "502/Bad Gateway", 860, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 487, "400", 4, "401", 1], "isController": false}, {"data": ["esbmockupservice/signature", 52189, 15, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 52660, 39266, "503/Service Temporarily Unavailable", 38728, "502/Bad Gateway", 382, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 155, "400", 1, "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 52174, 17799, "503/Service Temporarily Unavailable", 17133, "502/Bad Gateway", 655, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 5, "401", 3, "400", 2], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
