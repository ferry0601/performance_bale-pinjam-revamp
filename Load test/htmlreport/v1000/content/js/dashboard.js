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

    var data = {"OkPercent": 99.31493819828515, "KoPercent": 0.6850618017148584};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8140427229872684, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9521789778667225, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.5500982016817038, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.10245264981776901, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9706066758225353, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9958167810280486, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.9906412323123769, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.9730969352461728, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.18647751282825234, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.9603599446239041, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.962100170235642, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9986124935903237, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.9699260550679332, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.9703294674993078, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 431056, 2953, 0.6850618017148584, 1555.4581794476849, 0, 300314, 102.0, 3794.4000000000087, 15294.300000000025, 26699.88000000002, 349.64869332736333, 863.7552704746047, 221.75908618693958], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 33479, 213, 0.6362197198243675, 211.4332566683584, 0, 2754, 133.0, 363.0, 501.0, 795.0, 34.606264458470214, 284.68202525955473, 21.592697440488987], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 32586, 611, 1.8750383600319156, 4755.533143067586, 0, 299784, 594.0, 22255.9, 32581.9, 44847.550000000076, 33.666283711742395, 14.570473889607216, 21.33470319034685], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 33474, 193, 0.5765668877337635, 8229.931110712796, 0, 300314, 2123.0, 31902.700000000004, 40330.9, 46668.80000000003, 27.215873243009437, 13.659543550610842, 17.41705710407344], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 33494, 861, 2.5706096614318983, 786.1354869528909, 0, 60772, 78.0, 118.0, 141.0, 27707.360000000102, 34.574951276715225, 13.651971486555677, 20.945363178151737], "isController": false}, {"data": ["/api/informationservice/tnc", 33228, 136, 0.4092933670398459, 51.288612013963764, 0, 1056, 48.0, 57.0, 64.0, 108.0, 34.426560711159, 186.39817512316293, 22.801299912711038], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 33498, 270, 0.8060182697474476, 115.08636336497727, 0, 3412, 106.0, 134.0, 150.0, 213.9900000000016, 34.557890501686735, 37.75993711506917, 19.54994042276624], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 364.0, 364, 364, 364.0, 364.0, 364.0, 364.0, 2.7472527472527473, 50.49686641483517, 3.173828125], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 33249, 156, 0.46918704321934496, 166.2584739390655, 0, 2265, 114.0, 296.0, 412.0, 681.0, 34.42688131739329, 187.40830109005773, 22.28586555730255], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 33130, 46, 0.1388469664956233, 5131.962903712671, 0, 52346, 2547.0, 10998.900000000001, 13534.0, 21577.99, 34.08706245247823, 121.05869948030862, 27.24982578030873], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 32505, 7, 0.02153514843870174, 201.59178587909665, 0, 2637, 124.0, 355.0, 496.0, 780.9900000000016, 33.89189003199945, 188.10347405883667, 21.740406763285403], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 33483, 230, 0.6869157482901771, 180.66117134067983, 0, 2134, 115.0, 317.0, 438.0, 666.0, 34.58108786403456, 12.373931589312013, 20.593330781898402], "isController": false}, {"data": ["esbmockupservice/signature", 33153, 45, 0.1357343226857298, 44.15953307393033, 0, 1098, 41.0, 50.0, 58.0, 98.0, 34.42335966508011, 7.900613052203519, 20.578981904451894], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 33268, 177, 0.5320428038956354, 170.0611398340739, 0, 2683, 116.0, 296.0, 413.0, 710.9900000000016, 34.426841926073564, 19.06635608886995, 22.037678458659435], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 32507, 8, 0.024610083981911588, 178.2446242347795, 0, 2301, 114.0, 309.0, 434.0, 698.9900000000016, 33.8838711022395, 12.194035898745524, 20.080515700815123], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 42.49855324074074, 2.723976417824074], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1696, 57.43311886217406, 0.3934523588582458], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 0.033863867253640365, 2.3198841913811663E-4], "isController": false}, {"data": ["400", 40, 1.3545546901456147, 0.009279536765524664], "isController": false}, {"data": ["502/Bad Gateway", 1062, 35.963427023366066, 0.24637170112467985], "isController": false}, {"data": ["401", 41, 1.388418557399255, 0.009511525184662781], "isController": false}, {"data": ["500", 2, 0.06772773450728073, 4.6397683827623326E-4], "isController": false}, {"data": ["Response was null", 111, 3.7588892651540804, 0.025750714524330944], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 431056, 2953, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1696, "502/Bad Gateway", 1062, "Response was null", 111, "401", 41, "400", 40], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 33479, 213, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 212, "400", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 32586, 611, "502/Bad Gateway", 523, "Response was null", 57, "401", 24, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 3, "400", 2], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 33474, 193, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 187, "400", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 33494, 861, "502/Bad Gateway", 539, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 250, "Response was null", 54, "401", 17, "500", 1], "isController": false}, {"data": ["/api/informationservice/tnc", 33228, 136, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 136, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 33498, 270, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 270, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 33249, 156, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 156, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 33130, 46, "400", 30, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 32505, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 33483, 230, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 229, "400", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["esbmockupservice/signature", 33153, 45, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 45, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 33268, 177, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 177, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 32507, 8, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
