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

    var data = {"OkPercent": 95.84108321906494, "KoPercent": 4.158916780935055};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7789551570115536, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8632282550202509, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.5632527392918592, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.1697529984900715, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.9495824399052025, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9950949414703139, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.964827450095861, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.9139163998683463, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.15603125754284336, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.8866597186034393, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.8680326249541388, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9998492022800616, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.9045837786486165, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.8899780474419172, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [0.5, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 441942, 18380, 4.158916780935055, 2757.278212978159, 0, 301471, 2264.0, 37682.40000000001, 44832.55, 49974.70000000005, 405.1473298020385, 960.5681921445649, 254.5967241584985], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 35307, 619, 1.7531934177358597, 389.6124564533945, 0, 6380, 135.0, 2109.800000000003, 2924.0, 4302.990000000002, 36.31290374668698, 296.3386011771456, 22.40412546867013], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 33129, 153, 0.4618310241782124, 10707.406230191069, 0, 301471, 627.0, 66023.30000000002, 86443.85, 106471.0, 30.694610445562443, 13.628978308479493, 19.369936362699317], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 35101, 478, 1.3617845645423208, 15333.1142132703, 0, 300439, 2159.0, 73045.0, 97556.40000000002, 108749.89000000001, 34.76578826950543, 17.96807989861753, 22.073466464474535], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 35444, 1011, 2.8523868637851257, 135.77846744159862, 0, 7136, 73.0, 119.0, 322.9500000000007, 3382.920000000013, 36.58338967131305, 16.053311439469788, 21.698127033650547], "isController": false}, {"data": ["/api/informationservice/tnc", 33231, 160, 0.48147813788330174, 50.18597093075768, 0, 1105, 48.0, 58.0, 68.0, 121.0, 34.428777157302555, 186.33496349725706, 22.786240130062367], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 35468, 1223, 3.4481786399007555, 104.53820345099844, 0, 3190, 102.0, 127.0, 142.0, 201.0, 36.58210810225415, 41.24598434381591, 20.14383196499389], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 360.0, 360, 360, 360.0, 360.0, 360.0, 360.0, 2.7777777777777777, 51.057942708333336, 3.2090928819444446], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 33421, 271, 0.8108674186888484, 279.1183088477303, 0, 6352, 98.0, 1073.0, 2058.0, 4298.950000000008, 34.434581918779266, 187.08172720271182, 22.21700842421682], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 33144, 12787, 38.580135167752836, 7431.7496077721535, 0, 70089, 2946.5, 30169.800000000003, 36009.700000000004, 48301.92000000001, 34.43053122993786, 79.3906263553308, 27.536869420581965], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 32623, 160, 0.490451521932379, 349.2999417588821, 0, 6360, 122.0, 1534.0, 2479.9500000000007, 3520.9900000000016, 33.92014007667202, 187.7525534024766, 21.658478192691724], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 35433, 780, 2.2013377360088056, 345.8574774927326, 0, 6369, 116.0, 1873.0, 2726.0, 3937.970000000005, 36.42181587930732, 14.158371968703326, 21.361196852087318], "isController": false}, {"data": ["esbmockupservice/signature", 33157, 5, 0.015079771993847453, 43.471212715263455, 0, 356, 41.0, 51.0, 70.0, 105.0, 34.42708398227405, 7.811171699461536, 20.606074292810362], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 33684, 410, 1.2171951074694216, 301.88050706566816, 0, 6374, 113.0, 1199.800000000003, 2337.9500000000007, 4415.970000000005, 34.68704528861076, 19.647293118868316, 22.05262143529441], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 32798, 323, 0.9848161473260565, 328.45222269650503, 0, 6361, 123.0, 1428.9000000000015, 2367.9500000000007, 4111.780000000035, 34.08469732398026, 12.932093766237983, 20.006142017407118], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 519.0, 519, 519, 519.0, 519.0, 519.0, 519.0, 1.9267822736030829, 35.3745183044316, 2.26735609344894], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 8492, 46.20239390642002, 1.9215191133678176], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 5546, 30.17410228509249, 1.2549158034312196], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3, 0.01632208922742111, 6.788221078784094E-4], "isController": false}, {"data": ["400", 28, 0.15233949945593037, 0.006335673006865154], "isController": false}, {"data": ["502/Bad Gateway", 4224, 22.98150163220892, 0.9557815278928005], "isController": false}, {"data": ["401", 5, 0.02720348204570185, 0.001131370179797349], "isController": false}, {"data": ["Response was null", 82, 0.44613710554951036, 0.018554470948676523], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 441942, 18380, "503/Service Temporarily Unavailable", 8492, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 5546, "502/Bad Gateway", 4224, "Response was null", 82, "400", 28], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 35307, 619, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 616, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 33129, 153, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 141, "502/Bad Gateway", 10, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 35101, 478, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 470, "502/Bad Gateway", 4, "400", 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, "", ""], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 35444, 1011, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1001, "502/Bad Gateway", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/informationservice/tnc", 33231, 160, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 160, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 35468, 1223, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1223, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 33421, 271, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 267, "502/Bad Gateway", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 33144, 12787, "503/Service Temporarily Unavailable", 8492, "502/Bad Gateway", 4183, "Response was null", 82, "400", 24, "401", 5], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 32623, 160, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 157, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 35433, 780, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 775, "502/Bad Gateway", 4, "400", 1, "", "", "", ""], "isController": false}, {"data": ["esbmockupservice/signature", 33157, 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 33684, 410, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 408, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 32798, 323, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 322, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
