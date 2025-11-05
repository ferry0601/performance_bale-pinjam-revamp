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

    var data = {"OkPercent": 99.9784498240069, "KoPercent": 0.021550175993103944};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5079376481574599, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.24856870229007633, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.2817525928152713, 500, 1500, "/api/offeringservice/getplafon"], "isController": false}, {"data": [0.18171437271619975, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.5696125907990315, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.8658940397350994, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.07370913534983196, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9986551105797967, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.21357729138166895, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.9995901639344262, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/login"], "isController": false}, {"data": [0.9980672019030628, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "esbmockupservice/signature_validate_event"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41763, 9, 0.021550175993103944, 2931.3444436463037, 35, 136023, 3127.5, 9641.600000000006, 16795.750000000004, 21809.790000000034, 180.5311800254178, 400.53795324076873, 111.91558897254619], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getinsurance", 2096, 1, 0.04770992366412214, 2690.4193702290004, 59, 5909, 3141.5, 4622.6, 4895.15, 5439.09, 11.061736734887747, 60.34770947900064, 7.194449868589101], "isController": false}, {"data": ["/api/offeringservice/getplafon", 6653, 0, 0.0, 2240.5397565008257, 55, 5347, 2567.0, 3978.0, 4214.0, 4618.46, 35.13209519937055, 12.076657724783626, 21.065533644935073], "isController": false}, {"data": ["/api/offeringservice/getoffering", 6568, 3, 0.045676004872107184, 3209.196711327647, 65, 6221, 3852.0, 4883.0, 5127.549999999999, 5557.619999999999, 34.670242079369935, 286.37704849142483, 21.770474274448116], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 826, 0, 0.0, 1644.0556900726392, 139, 10086, 661.0, 4951.100000000001, 7146.649999999997, 9537.210000000003, 4.439619031238578, 15.781458275105885, 3.550828111898824], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 604, 0, 0.0, 689.2748344370865, 146, 11893, 289.0, 777.0, 3460.0, 9189.500000000027, 3.3524824466461296, 1.4601632531290762, 2.124766706907557], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 6546, 4, 0.061106018942865874, 10489.281698747305, 213, 136023, 8066.0, 20377.6, 21464.3, 24442.299999999996, 28.658614001830017, 14.07652681217794, 18.44338537813084], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 6692, 0, 0.0, 116.32411835026895, 53, 656, 99.0, 184.0, 233.0, 360.0, 35.344199262694225, 13.49568546065766, 21.57238724529677], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 2924, 0, 0.0, 2922.6764705882338, 57, 6260, 3471.0, 4750.5, 5027.75, 5504.5, 15.432196501894719, 8.39427094878453, 9.93146239721545], "isController": false}, {"data": ["/api/informationservice/tnc", 1220, 0, 0.0, 53.50409836065577, 41, 1059, 48.0, 57.0, 66.95000000000005, 197.3199999999997, 6.439014091940677, 34.94297002823666, 4.282195895128517], "isController": false}, {"data": ["/api/loginservice/v2/login", 1, 0, 0.0, 441.0, 441, 441, 441.0, 441.0, 441.0, 441.0, 2.2675736961451247, 41.6312358276644, 2.6683850623582765], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 6726, 1, 0.014867677668748141, 138.02572108236708, 85, 4061, 118.0, 190.30000000000018, 236.64999999999964, 391.4599999999991, 35.51795700457836, 38.441827488593695, 20.253323207599976], "isController": false}, {"data": ["esbmockupservice/signature_validate_event", 907, 0, 0.0, 47.1113561190738, 35, 349, 41.0, 49.0, 60.0, 293.91999999999996, 4.853355878874791, 1.09958844130757, 2.905378079834226], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, 11.11111111111111, 0.0023944639992337716], "isController": false}, {"data": ["502/Bad Gateway", 6, 66.66666666666667, 0.01436678399540263], "isController": false}, {"data": ["400", 2, 22.22222222222222, 0.004788927998467543], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41763, 9, "502/Bad Gateway", 6, "400", 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getinsurance", 2096, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getoffering", 6568, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 6546, 4, "502/Bad Gateway", 2, "400", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 6726, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
