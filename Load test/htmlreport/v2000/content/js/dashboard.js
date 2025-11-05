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

    var data = {"OkPercent": 85.17311979089132, "KoPercent": 14.826880209108678};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7131174322320457, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8491504914308292, 500, 1500, "/api/offeringservice/getoffering"], "isController": false}, {"data": [0.39465728367461, 500, 1500, "/api/paylaterservice/v1/transaction/getpaylateraccountinformation"], "isController": false}, {"data": [0.16465932978854952, 500, 1500, "/api/offeringservice/getdebiturdata"], "isController": false}, {"data": [0.853954379158789, 500, 1500, "/api/paylaterservice/v1/user/paylatermenu"], "isController": false}, {"data": [0.9005015451643954, 500, 1500, "/api/informationservice/tnc"], "isController": false}, {"data": [0.8951306267631547, 500, 1500, "/api/userservice/getmenuislandlist"], "isController": false}, {"data": [1.0, 500, 1500, "/api/loginservice/v2/loginHaveStatusOffer"], "isController": false}, {"data": [0.8614402917046491, 500, 1500, "/api/offeringservice/getinsurance"], "isController": false}, {"data": [0.018241133311330576, 500, 1500, "/api/mortgageservice/getmortgageapplicationparameter"], "isController": false}, {"data": [0.8477000386548125, 500, 1500, "/api/offeringservice/checkdisbursmentstatus"], "isController": false}, {"data": [0.8622591230970417, 500, 1500, "/api/offeringservice/getplafonNoStatusOffering"], "isController": false}, {"data": [0.9049685343077548, 500, 1500, "esbmockupservice/signature"], "isController": false}, {"data": [0.8594042617806347, 500, 1500, "/api/offeringservice/getinsurancekring"], "isController": false}, {"data": [0.8561388152305435, 500, 1500, "/api/offeringservice/getplafonHaveStatusOffer"], "isController": false}, {"data": [0.5, 500, 1500, "/api/loginservice/v2/loginNoStatusOffering"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 517243, 76691, 14.826880209108678, 3227.6474307046324, 0, 1029620, 134.0, 22633.800000000003, 29282.850000000002, 58955.96000000001, 262.2449383126661, 597.248597445118, 151.62998062194086], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/api/offeringservice/getoffering", 40494, 3310, 8.17405047661382, 238.10357089939205, 0, 6210, 103.0, 830.0, 1328.0, 2349.970000000005, 37.92215721952878, 294.84226892180465, 21.866594834599777], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 39362, 4780, 12.14369188557492, 13802.08637772469, 0, 1029620, 954.0, 47874.700000000004, 54766.9, 67335.0, 20.038782441094522, 12.321290779185722, 11.50395498140296], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 40435, 3908, 9.664894274761963, 16518.18728824065, 0, 300219, 1682.0, 54480.9, 67855.9, 74721.99, 34.141868392322024, 23.067320488688473, 19.852377225744156], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 40727, 4304, 10.56792791023154, 920.7313084685749, 0, 61257, 70.0, 340.0, 1436.9000000000015, 25319.790000000034, 37.568468573178585, 20.397974734658334, 20.954911569401627], "isController": false}, {"data": ["/api/informationservice/tnc", 39478, 3913, 9.911849637772937, 45.48343381123702, 0, 4180, 46.0, 53.0, 57.0, 92.0, 37.05935805584343, 189.46632136933897, 22.203054132883963], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 40765, 4139, 10.15331779712989, 107.02823500551904, 0, 9704, 99.0, 120.0, 134.0, 289.9800000000032, 38.117046870923794, 45.81661023922853, 19.53143627819039], "isController": false}, {"data": ["/api/loginservice/v2/loginHaveStatusOffer", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 46.06731672932331, 2.895422149122807], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 39492, 3960, 10.027347310847766, 160.74096019447194, 0, 5863, 72.0, 412.0, 868.9500000000007, 2229.9100000000144, 37.052569952065845, 190.4871430783389, 21.68463024834004], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 39389, 30370, 77.10274442103125, 9243.535149407197, 0, 83862, 42.0, 27276.800000000003, 30628.750000000004, 41162.65000000005, 37.06669728189473, 44.67061039414832, 27.379137400755372], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 38805, 3817, 9.836361293647725, 205.93706996521183, 0, 7164, 91.0, 610.0, 948.0, 2401.9600000000064, 36.59257624749991, 191.28964295215712, 21.17030260748627], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 40529, 3333, 8.2237410249451, 205.34316168669423, 0, 5850, 89.0, 711.0, 1149.9500000000007, 2401.9600000000064, 37.935288457578444, 19.096637219994534, 20.87631454388078], "isController": false}, {"data": ["esbmockupservice/signature", 39408, 3119, 7.914636622005684, 97.39715286236321, 0, 9229, 39.0, 50.0, 97.0, 4576.0, 37.066020557118996, 14.415748142783846, 20.432762468972914], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 39514, 3976, 10.06225641544769, 171.28190008604653, 0, 7188, 77.0, 422.90000000000146, 882.0, 2257.970000000005, 37.052561300262276, 26.694751326210977, 21.44717622963886], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 38843, 3762, 9.6851427541642, 196.32270936848266, 0, 7906, 94.0, 538.0, 857.9500000000007, 2287.980000000003, 36.60835292099653, 19.88833743445123, 19.59929742119068], "isController": false}, {"data": ["/api/loginservice/v2/loginNoStatusOffering", 1, 0, 0.0, 671.0, 671, 671, 671.0, 671.0, 671.0, 671.0, 1.4903129657228018, 27.36121460506706, 1.7537374254843516], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 871, 1.135726486810708, 0.16839280570254214], "isController": false}, {"data": ["502/Bad Gateway", 12115, 15.79716003181599, 2.342225994358551], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 384, 0.5007106440129871, 0.0742397673820622], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 30186, 39.36055078170841, 5.835941714049296], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 6, 0.007823603812702924, 0.0011599963653447219], "isController": false}, {"data": ["Response was null", 91, 0.1186579911593277, 0.017593278207728283], "isController": false}, {"data": ["503/Service Temporarily Unavailable", 16874, 22.00258178925819, 3.262296444804473], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1670, 2.1775697278689807, 0.3228656550209476], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: No such host is known (mbankingdev.btn.co.id)", 1, 0.0013039339687838207, 1.9333272755745365E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 725, 0.9453521273682701, 0.1401662274791539], "isController": false}, {"data": ["400", 9, 0.011735405719054386, 0.0017399945480170828], "isController": false}, {"data": ["500", 36, 0.046941622876217545, 0.006959978192068331], "isController": false}, {"data": ["401", 120, 0.15647207625405848, 0.02319992730689444], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 12753, 16.629069903900067, 2.4655722745402064], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: no further information", 850, 1.1083438734662476, 0.1643328184238356], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 517243, 76691, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 30186, "503/Service Temporarily Unavailable", 16874, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 12753, "502/Bad Gateway", 12115, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 1670], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/api/offeringservice/getoffering", 40494, 3310, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2034, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1099, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 95, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 44, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 37], "isController": false}, {"data": ["/api/paylaterservice/v1/transaction/getpaylateraccountinformation", 39362, 4780, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2531, "502/Bad Gateway", 979, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 592, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 434, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 110], "isController": false}, {"data": ["/api/offeringservice/getdebiturdata", 40435, 3908, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2026, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1164, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 610, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 64, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 37], "isController": false}, {"data": ["/api/paylaterservice/v1/user/paylatermenu", 40727, 4304, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2212, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1006, "502/Bad Gateway", 745, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 252, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 29], "isController": false}, {"data": ["/api/informationservice/tnc", 39478, 3913, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2726, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1101, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 69, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 16, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 1], "isController": false}, {"data": ["/api/userservice/getmenuislandlist", 40765, 4139, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2721, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1017, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 397, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 4, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/api/offeringservice/getinsurance", 39492, 3960, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2047, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1776, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 96, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 23, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 14], "isController": false}, {"data": ["/api/mortgageservice/getmortgageapplicationparameter", 39389, 30370, "503/Service Temporarily Unavailable", 16874, "502/Bad Gateway", 10377, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2118, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 762, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 110], "isController": false}, {"data": ["/api/offeringservice/checkdisbursmentstatus", 38805, 3817, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2747, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 932, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 72, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 49, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 11], "isController": false}, {"data": ["/api/offeringservice/getplafonNoStatusOffering", 40529, 3333, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2054, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1031, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 159, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 48, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 40], "isController": false}, {"data": ["esbmockupservice/signature", 39408, 3119, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2159, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: no further information", 850, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 64, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 43, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3], "isController": false}, {"data": ["/api/offeringservice/getinsurancekring", 39514, 3976, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2035, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 1571, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 330, "Non HTTP response code: java.net.SocketException/Non HTTP response message: An established connection was aborted by the software in your host machine", 19, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 19], "isController": false}, {"data": ["/api/offeringservice/getplafonHaveStatusOffer", 38843, 3762, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: mbankingdev.btn.co.id", 2776, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 860, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 58, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset by peer", 34, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 32], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
