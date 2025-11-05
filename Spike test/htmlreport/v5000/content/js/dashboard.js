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

    var data = {"OkPercent": 79.7157433581476, "KoPercent": 20.284256641852398};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.25357854785850237, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10413832605427079, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.1530808729139923, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.03450016829350387, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.12336733424555293, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.4160369437447523, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.8012748756218906, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.1244472520530638, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.11463187325256291, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.23905723905723905, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.14505193755053802, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.3776207839562443, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.09974184463740905, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.20037105751391465, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88793, 18011, 20.284256641852398, 3579.9721712297533, 0, 136722, 2.0, 9545.700000000004, 14739.550000000007, 33019.98, 300.8392314442438, 666.7403632748576, 146.8783172903446], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 13967, 1451, 10.3887735376244, 3921.9947733944255, 0, 9526, 4628.0, 6823.200000000001, 7185.199999999997, 7762.5999999999985, 77.62592607001729, 594.132473907821, 43.69720840778483], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 1558, 1222, 78.43388960205391, 915.8042362002567, 0, 25003, 1.0, 227.0, 2525.8499999999467, 22511.680000000004, 8.655940264011733, 17.109766510456023, 1.1831255000222232], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 8913, 1437, 16.122517670817906, 12544.148434870414, 0, 136722, 9720.0, 30461.2, 32660.199999999997, 34924.72, 30.508300530549374, 24.342599451266473, 16.479317532731475], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 16078, 1830, 11.382012688145291, 4150.988928971274, 0, 12588, 4133.5, 8399.0, 9458.0, 10813.21, 89.35945532860914, 54.3799119858969, 48.41087757919966], "isController": false}, {"data": ["/api/informationservice/tnc", 2382, 1389, 58.31234256926952, 26.87069689336692, 0, 1244, 1.0, 53.0, 58.0, 222.17000000000007, 13.226940312182444, 48.43721693369039, 3.6670264320161925], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 16080, 2070, 12.873134328358208, 287.74975124378096, 0, 9160, 124.0, 515.0, 688.0, 3379.0, 89.35467917335808, 111.84931070339026, 44.39992956650756], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 49.410912298387096, 3.10557375672043], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 3166, 1408, 44.47252053063803, 2275.803853442831, 0, 7892, 63.0, 6330.6, 6848.899999999998, 7464.99, 17.578634685322452, 72.0173431817551, 6.355667527275756], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 2146, 1365, 63.606710158434296, 2511.400279589932, 0, 20538, 1.0, 11680.8, 14836.899999999994, 19284.600000000006, 11.257823032897395, 31.65806780595731, 3.3189846172156563], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 891, 677, 75.98204264870931, 24.21773288439955, 0, 6150, 1.0, 66.0, 70.0, 78.20000000000061, 5.844270843582125, 18.450655861160854, 0.9005997387788033], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 16077, 1537, 9.560241338558189, 3332.3128693164126, 0, 9285, 3365.0, 6444.200000000001, 6826.0, 7464.0, 89.35787057365341, 48.28629529519167, 48.457457119116036], "isController": false}, {"data": ["esbmockupservice/signature", 2194, 1365, 62.215132178669094, 18.683226982680072, 0, 521, 1.0, 44.0, 49.0, 110.10000000000036, 12.183812300430375, 19.23839242329585, 2.755888388518673], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 4261, 1424, 33.419385120863645, 2818.6636939685554, 0, 7898, 2732.0, 6507.800000000001, 6906.099999999997, 7449.280000000001, 23.658027405778757, 27.546411606161303, 10.137054702942123], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 1078, 836, 77.55102040816327, 178.6354359925794, 0, 7676, 1.0, 62.0, 66.0, 7264.47, 6.747663668400529, 13.105335614894937, 0.8979223197128176], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 438.0, 438, 438, 438.0, 438.0, 438.0, 438.0, 2.28310502283105, 41.916381278538815, 2.6866616723744294], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 17966, 99.7501526844706, 20.233576971157635], "isController": false}, {"data": ["502/Bad Gateway", 33, 0.18322136472155906, 0.037165091842825446], "isController": false}, {"data": ["400", 12, 0.06662595080783966, 0.013514578851936526], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88793, 18011, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 17966, "502/Bad Gateway", 33, "400", 12, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 13967, 1451, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1446, "502/Bad Gateway", 5, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 1558, 1222, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1222, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 8913, 1437, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1432, "502/Bad Gateway", 3, "400", 2, "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 16078, 1830, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1807, "502/Bad Gateway", 23, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/informationservice/tnc", 2382, 1389, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1389, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 16080, 2070, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 2070, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 3166, 1408, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1406, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 2146, 1365, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1355, "400", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 891, 677, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 677, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 16077, 1537, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1537, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["esbmockupservice/signature", 2194, 1365, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1365, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 4261, 1424, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1424, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 1078, 836, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 836, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
