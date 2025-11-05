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

    var data = {"OkPercent": 99.61118965865482, "KoPercent": 0.3888103413451828};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.35353968895172694, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0754381161007667, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.9108187134502924, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.07538461538461538, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.22476, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [1.0, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.9834413246940245, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.40225890529973934, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.7655440414507773, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [1.0, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.126, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [1.0, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.2087462300732443, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.9936507936507937, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59412, 231, 0.3888103413451828, 4110.70372988621, 0, 22862, 3623.0, 9129.900000000001, 9930.0, 15465.930000000011, 304.6300569143209, 665.3380098975158, 185.16274940073322], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 10956, 11, 0.10040160642570281, 6578.305677254467, 65, 11153, 7528.0, 9487.0, 9748.15, 10192.0, 57.30814899281817, 473.1162754688718, 35.98548808826376], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 342, 0, 0.0, 363.27777777777754, 156, 2493, 214.5, 663.6999999999996, 1242.0499999999995, 2274.1599999999994, 1.8915719958850012, 0.8238682716452252, 1.1988576419232089], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 5200, 2, 0.038461538461538464, 9215.010192307716, 231, 22862, 9427.0, 15465.900000000001, 16792.95, 18311.769999999997, 27.166530834012494, 13.342272656625498, 17.483148261342027], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 12500, 68, 0.544, 3241.7223199999858, 0, 9293, 3295.0, 6247.9, 6864.949999999999, 7907.99, 65.35537639468373, 25.517363371317877, 39.717432353917665], "isController": false}, {"data": ["/api/informationservice/tnc", 527, 0, 0.0, 47.240986717267525, 42, 105, 46.0, 52.0, 55.0, 77.16000000000008, 2.81290198611163, 15.264937828928055, 1.8706896997480664], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 12501, 142, 1.1359091272698185, 145.37908967282698, 0, 3285, 121.0, 182.0, 213.0, 348.97999999999956, 65.34420573937588, 71.68302591343893, 36.84330242799645], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 51.057942708333336, 3.2090928819444446], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 1151, 1, 0.08688097306689835, 5099.00695047784, 58, 10614, 7154.0, 9583.8, 9830.399999999998, 10240.28, 6.045104568229325, 32.96702400545951, 3.9316793383210262], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 386, 1, 0.25906735751295334, 757.2590673575127, 141, 6571, 289.5, 2370.4000000000005, 2816.149999999995, 6257.78, 2.1094164130084323, 7.482177890474291, 1.68712113501358], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 308, 0, 0.0, 70.86038961038962, 59, 149, 69.0, 80.0, 83.0, 93.91000000000003, 1.7082924286039147, 9.482357582211574, 1.0960430913991914], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 12500, 1, 0.008, 4915.310880000026, 55, 10485, 5445.0, 8254.0, 8738.949999999999, 9352.97, 65.35161784465136, 22.46427655922425, 39.18544273107025], "isController": false}, {"data": ["esbmockupservice/signature", 403, 0, 0.0, 40.019851116625276, 35, 97, 39.0, 43.0, 47.0, 62.87999999999994, 2.195491343335622, 0.49741600747447673, 1.3142931576804062], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 2321, 5, 0.2154243860404998, 6060.589831968976, 56, 10941, 7091.0, 9570.8, 9854.0, 10287.460000000001, 12.141407377958192, 6.597314061813417, 7.813659630932079], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 315, 0, 0.0, 123.89523809523814, 54, 9682, 65.0, 75.0, 80.39999999999998, 207.91999999999655, 1.7472723137768262, 0.6279259877635469, 1.035736615686068], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 37.014868951612904, 2.372495589717742], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 196, 84.84848484848484, 0.3298996835656096], "isController": false}, {"data": ["400", 1, 0.4329004329004329, 0.0016831616508449472], "isController": false}, {"data": ["502/Bad Gateway", 34, 14.718614718614718, 0.057227496128728204], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59412, 231, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 196, "502/Bad Gateway", 34, "400", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 10956, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 5200, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 12500, 68, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 54, "502/Bad Gateway", 14, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 12501, 142, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 142, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 1151, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 386, 1, "400", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 12500, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 2321, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
