// Metalog formula Generator!
//
// Created by Daniel ONeil
//
// Version 3.5.2
var hdrToggle = false;

$(document).ready(() => {
    generateOutput();
    $("#advancedHdr").hide();
    
    
    $("#quantileSelect").change(() => {
        $("#p5Label").html($("#quantileSelect").val() + "% Quantile:");
        $("#p95Label").html(100-$("#quantileSelect").val() + "% Quantile:")
    });

    $("input").change(() => {
        generateOutput();
        drawCDF();
        drawPDF();
            
    });
    $("#hdr").click(() => {
        $("#advancedHdr").toggle("fast",() => {
            hdrToggle = !hdrToggle;
            console.log("hdr toggled!~");
            console.log(hdrToggle);
            generateOutput();
        });
        switch ($("#generate-type").val()) {
            case "excel": 
                $("#randomCellInput").toggle("fast");
                break;
            default: 
                break;
        };
    });

    $("#generate-type").change(() => {
        switch ($("#generate-type").val()){
            case "excel": defaultRand = "A1";
            case "R": defaultRand = "rand";
            case "python": defaultRand = "rand";
        }
        $("#randRef").val(defaultRand);
        generateOutput();
    });
    
    $("#clear").click(() => {
        $("#randRef").val("");
        $("#excel-placeholder").val("");
        $("#seed").val("");
        $("#quantileSelect").val("");
        $("#p0").val("");
        $("#p5").val("");
        $("#p50").val("");
        $("#p95").val("");
        $("#p100").val("");
    })
});

function cdfInv(p) {

    let p0_ = $("#p0").val();
    let p5_ = $("#p5").val();
    let p50_ = $("#p50").val();
    let p95_ = $("#p95").val();
    let p100_ = $("#p100").val();
    
    let bounding = Metalog.bounding(p0_, p100_);

    if ((p < 0) || (p > 1)) {
        console.log("NormSInv: Argument out of range.");
        retVal = 0;
    } else {
        let p0 = Number(p0_);
        let p5 = Number(p5_);
        let p50 = Number(p50_);
        let p95 = Number(p95_);
        let p100 = Number(p100_);

        let quantileSelect = $("#quantileSelect").val();
        let percentileSelect = Number(quantileSelect/100);
        console.log(bounding + ", " + percentileSelect + ", " + p0 + ", " + p5 + ", " + p50 +", " + p95 + ", " + p100);


        switch (bounding) {
            case "u":
                retVal = p50+0.5*(Math.log((1-percentileSelect)/percentileSelect))**-1*(p95-p5)*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*(1-2*(p50-p5)/(p95-p5))*(p95-p5)*(p-0.5)*Math.log(p/(1-p))
                return retVal;
            case "su":
                retVal = p100-Math.exp(-(-Math.log(p100-p50)-(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log((p100-p95)/(p100-p5))*Math.log(p/(1-p))-((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log(((p100-p95)*(p100-p5))/(p100-p50)**2)*(p-0.5)*Math.log(p/(1-p))))
                return retVal;
            case "sl":
                retVal = p0+Math.exp(Math.log(p50-p0)+(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log((p95-p0)/(p5-p0))*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log(((p95-p0)*(p5-p0))/(p50-p0)**2)*(p-0.5)*Math.log(p/(1-p)))
                return retVal;
            case "b":
                retVal = (p0+p100*Math.exp(Math.log((p50-p0)/(p100-p50))+(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log(((p95-p0)/(p100-p95))/((p5-p0)/(p100-p5)))*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log((((p95-p0)/(p100-p95))*((p5-p0)/(p100-p5)))/((p50-p0)/(p100-p50))**2)*(p-0.5)*Math.log(p/(1-p))))/(1+Math.exp(Math.log((p50-p0)/(p100-p50))+(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log(((p95-p0)/(p100-p95))/((p5-p0)/(p100-p5)))*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log((((p95-p0)/(p100-p95))*((p5-p0)/(p100-p5)))/((p50-p0)/(p100-p50))**2)*(p-0.5)*Math.log(p/(1-p))))
                return retVal;
        };  
    };  
};
function pdfInv(p) {

    let p0_ = $("#p0").val();
    let p5_ = $("#p5").val();
    let p50_ = $("#p50").val();
    let p95_ = $("#p95").val();
    let p100_ = $("#p100").val();
    
    quantileSelect = $("#quantileSelect").val();
    percentileSelect = Number(quantileSelect/100);
    
    let bounding = Metalog.bounding(p0_, p100_);
    
    if ((p < 0) || (p > 1)) {
        console.log("NormSInv: Argument out of range.");
        retVal = 0;
    } else { 
        let p0 = Number(p0_);
        let p5 = Number(p5_);
        let p50 = Number(p50_);
        let p95 = Number(p95_);
        let p100 = Number(p100_);
        
        switch (bounding) {
            case "u":
                var retVal = ((1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*(p95-p5)/(p*(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*(1-2*(p50-p5)/(p95-p5))*(p95-p5)*((p-0.5)/(p*(1-p))+Math.log(p/(1-p))))**(-1);
                return retVal;
            case "su":
                var retVal = (-(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log((p100-p95)/(p100-p5))/(p*(1-p))-((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log(((p100-p95)*(p100-p5))/(p100-p50)**2)*((p-0.5)/(p*(1-p))+Math.log(p/(1-p))))**(-1)*Math.exp((-Math.log(p100-p50)-(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log((p100-p95)/(p100-p5))*Math.log(p/(1-p))-((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log(((p100-p95)*(p100-p5))/(p100-p50)**2)*(p-0.5)*Math.log(p/(1-p))));
                return retVal;
            case "sl":
                var retVal =((1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log((p95-p0)/(p5-p0))/(p*(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log(((p95-p0)*(p5-p0))/(p50-p0)**2)*((p-0.5)/(p*(1-p))+Math.log(p/(1-p))))**(-1)*Math.exp(-(Math.log(p50-p0)+(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log((p95-p0)/(p5-p0))*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log(((p95-p0)*(p5-p0))/(p50-p0)**2)*(p-0.5)*Math.log(p/(1-p))));
                return retVal;
            case "b":
                var retVal =((1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log(((p95-p0)/(p100-p95))/((p5-p0)/(p100-p5)))/(p*(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log((((p95-p0)/(p100-p95))*((p5-p0)/(p100-p5)))/((p50-p0)/(p100-p50))**2)*((p-0.5)/(p*(1-p))+Math.log(p/(1-p))))**(-1)*(1+Math.exp(Math.log((p50-p0)/(p100-p50))+(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log(((p95-p0)/(p100-p95))/((p5-p0)/(p100-p5)))*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log((((p95-p0)/(p100-p95))*((p5-p0)/(p100-p5)))/((p50-p0)/(p100-p50))**2)*(p-0.5)*Math.log(p/(1-p))))**2/((p100-p0)*Math.exp(Math.log((p50-p0)/(p100-p50))+(1/2)*(Math.log((1-percentileSelect)/percentileSelect))**-1*Math.log(((p95-p0)/(p100-p95))/((p5-p0)/(p100-p5)))*Math.log(p/(1-p))+((1-2*percentileSelect)*(Math.log((1-percentileSelect)/percentileSelect)))**-1*Math.log((((p95-p0)/(p100-p95))*((p5-p0)/(p100-p5)))/((p50-p0)/(p100-p50))**2)*(p-0.5)*Math.log(p/(1-p))))
                return retVal;
        };
    }; 
    
    
};

google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(() => {
        drawCDF();
        drawPDF()
    }
);

function drawCDF() {

    var dataArray = [
        ['x', 'P(x)']
    ];
    for (var i = 1; i < 999; i++ ) {
        var j = i/1000;
        dataArray.push([cdfInv(j),j ]);
    };
    console.log("dataArray0: " + dataArray[0] + " dataArray1: " + dataArray[1] + " dataArray2: " + dataArray[2]);

    var data = google.visualization.arrayToDataTable(dataArray);
    var options = {
        hAxis: {
            title: 'Variable',
            minValue:cdfInv(0.001),
            maxValue:cdfInv(0.999)
        },
        vAxis: {
            title: 'C Probability',
            format:'#,###%'
        },
        animation:{
            "startup": true,
            duration: 500,
            easing: 'out',
          },
    };

    var chart = new google.visualization.LineChart(document.getElementById('cdf_div'));
    chart.draw(data, options);
};

function drawPDF() {

    var dataArray = [
    ['x', 'P(x)']
    ];
    for (var i = 1; i < 999; i++ ) {
        var j = i/1000;
        dataArray.push([cdfInv(j), pdfInv(j)]);
    };
    console.log("dataArray0: " + dataArray[0] + " dataArray1: " + dataArray[1] + " dataArray2: " + dataArray[2]);

    var data = google.visualization.arrayToDataTable(dataArray);
    var options = {
        hAxis: {
            title: 'Variable',
            minValue:cdfInv(0.001),
            maxValue:cdfInv(0.999)
        },
        vAxis: {
            title: 'Probability',
            format:'#,###%'
        },
        animation: {
            "startup": true,
            duration: 500,
            easing: 'out',
          },
    };

    var chart = new google.visualization.LineChart(document.getElementById('pdf_div'));
    chart.draw(data, options);
};

var Metalog = new function() {
    
    this.bounding = function(p0, p100) {
        let bounding;
        if (p0 === "" && p100 === "") {
            bounding = "u";
            //console.log("unBounded!")            
        } if (p0 === "" && p100 !== "") {
            bounding = "su";
            //console.log("SL!")            
        } if (p0 !== "" && p100 === "") {
            bounding = "sl";
            //console.log("SU!")            
        } if (p0 !== "" && p100 !== "") {
            bounding = "b";
            //console.log("Bounded!");
        };
        return bounding;
    };
            
    this.metalogInputValidationTest =function(p0, p5, p50, p95, p100 ) {
            
        let bounding = Metalog.bounding(p0,p100);
            
        switch (bounding) {
            case "u":
                if ( p5<p50 && p50<p95 ) {
                    return true;
                } else {
                    console.log("Values are messed up. u");
                };
            case "su":
                if ( p5<p50 && p50<p95 ) {
                
                } else {
                        console.log("Values are messed up.");
                };
            case "sl":
                if ( p5<p50 && p50<p95 ) {

                } else {
                        console.log("Values are messed up.");
                };
            case "b":
                if ( p5<p50 && p50<p95 ) { 
                    console.log("In development")
                } else {
                    console.log("Values are messed up.");
                };
                        
        };
    };

    this.feasibilityTest = function(p0, p5, p50, p95, p100, quantileSelect) {
            
        let bounding = Metalog.bounding(p0,p100);
        
        switch (bounding) {
            case "u":
                k = 1.66711;
                p5 = Number(p5);
                deciQuantileSelect = Number(quantileSelect);

                lowerFeasibility = p5 + 0.5*(1-k*(0.5-deciQuantileSelect))*(p95-p5)
                upperFeasibility = p5 + 0.5*(1+k*(0.5+deciQuantileSelect))*(p95-p5)
                    
                if ( lowerFeasibility <= p50 && p50 <= upperFeasibility ) {
                    console.log("P50 is between: " + lowerFeasibility + " to " + upperFeasibility);
                    return true;
                } else {
                    alert("Median value is outside the feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    console.log("Values are outside feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    return false;
                    };
            case "su":
                k = 1.66711;
                p5 = Number(p5);
                deciQuantileSelect = Number(quantileSelect);
                    
                lowerFeasibility = p5 + 0.5*(1-k*(0.5-deciQuantileSelect))*(p95-p5)
                upperFeasibility = p5 + 0.5*(1+k*(0.5+deciQuantileSelect))*(p95-p5)
     
                if ( lowerFeasibility <= p50 && p50 <= upperFeasibility ) {
                    console.log("P50 is between: " + lowerFeasibility + " to " + upperFeasibility);
                    return true;
                } else {
                    alert("Median value is outside the feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    console.log("Values are outside feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    return false;
                    };
            case "sl":
                var k = 1.66711;
                var p5 = Number(p5);
                var deciQuantileSelect = Number(quantileSelect);
             
                var lowerFeasibility = p5 + 0.5*(1-k*(0.5-deciQuantileSelect))*(p95-p5)
                var upperFeasibility = p5 + 0.5*(1+k*(0.5+deciQuantileSelect))*(p95-p5)
 
                if ( lowerFeasibility <= p50 && p50 <= upperFeasibility ) {
                    console.log("P50 is between: " + lowerFeasibility + " to " + upperFeasibility);
                    return true;
                } else {
                    alert("Median value is outside the feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    console.log("Values are outside feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    return false;
                };
            case "b":
                var k = 1.66711;
                var p5 = Number(p5);
                var deciQuantileSelect = Number(quantileSelect);
                    
                var lowerFeasibility = p5 + 0.5*(1-k*(0.5-deciQuantileSelect))*(p95-p5)
                var upperFeasibility = p5 + 0.5*(1+k*(0.5+deciQuantileSelect))*(p95-p5)

                if ( lowerFeasibility <= p50 && p50 <= upperFeasibility ) {
                    console.log("P50 is between: " + lowerFeasibility + " to " + upperFeasibility);
                    return true;
                } else {
                    alert("Median value is outside the feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    console.log("Values are outside feasible Range of " + lowerFeasibility + " to " + upperFeasibility);
                    return false;
                    };
            };
        };

    this.formula = function(p0, p5, p50, p95, p100, rand, type, percentileSelect) {
        
        let bounding = Metalog.bounding(p0,p100);

        const formulas_dictionary = {
                "excel": {
                    "u" : "=" + p50 + "+(1/2)*(LN((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*(" + p95 + "-" + p5 + ")*LN(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(LN((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*(1-2*(" + p50 + "-" + p5 + ")/(" + p95 + "-" + p5 + "))*(" + p95 + "-" + p5 + ")*(" + rand + "-0.5)*LN(" + rand + "/(1-" + rand + "))",
                    "sl": "=" + p0 + "+EXP(LN(" + p50 + "-" + p0 + ")+(1/2)*(LN((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*LN((" + p95 + "-" + p0 + ")/(" + p5 + "-" + p0 + "))*LN(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(LN((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*LN(((" + p95 + "-" + p0 + ")*(" + p5 + "-" + p0 + "))/(" + p50 + "-" + p0 + ")^2)*(" + rand + "-0.5)*LN(" + rand + "/(1-" + rand + ")))",
                    "su" : "=" + p100 + "-EXP(-(-LN(" + p100 + "-" + p50 + ")-(1/2)*(LN((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*LN((" + p100 + "-" + p95 + ")/(" + p100 + "-" + p5 + "))*LN(" + rand + "/(1-" + rand + "))-((1-2*" + percentileSelect + ")*(LN((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*LN(((" + p100 + "-" + p95 + ")*(" + p100 + "-" + p5 + "))/(" + p100 + "-" + p50 + ")^2)*(" + rand + "-0.5)*LN(" + rand + "/(1-" + rand + "))))",
                    "b" : "=(" + p0 + "+" + p100 + "*EXP(LN((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))+(1/2)*(LN((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*LN(((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))/((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))*LN(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(LN((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*LN((((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))*((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))/((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))^2)*(" + rand + "-0.5)*LN(" + rand + "/(1-" + rand + "))))/(1+EXP(LN((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))+(1/2)*(LN((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*LN(((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))/((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))*LN(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(LN((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*LN((((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))*((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))/((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))^2)*(" + rand + "-0.5)*LN(" + rand + "/(1-" + rand + "))))"
                },
                "javascript": {
                    "u" : "To be implemented.",
                    "sl": "To be implemented.",
                    "su" : "To be implemented.",
                    "b" : "To be implemented."
                },
                "python": {
                    "u" : p50 + "+0.5 * math.pow((1-" + percentileSelect + ")/"+ percentileSelect +",-1/math.exp(1))* ("+p95+"-"+p5+")* math.log(" +rand+ "/(1-"+ rand + ")) + math.pow((1-2*" + percentileSelect+ ") * math.log((1-" + percentileSelect+ ")/" + percentileSelect + "),-1) * (1- 2 * (" + p95 + "-" + p50 + ")/("+ p95 + "-" + p5 +")) * ("+ p95 + "-" + p5 + ") * (" + rand + " - 0.5) * math.log("+ rand +"/(1-" + rand + "))",
                    "sl": p0 + "+math.exp(math.log(" + p50 + "-" + p0 + ")+(1/2)*(math.log((1-" + percentileSelect + ")/" + percentileSelect + "))**-1*math.log((" + p95 + "-" + p0 + ")/(" + p5 + "-" + p0 + "))*math.log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(math.log((1-" + percentileSelect + ")/" + percentileSelect + ")))**-1*math.log(((" + p95 + "-" + p0 + ")*(" + p5 + "-" + p0 + "))/(" + p50 + "-" + p0 + ")**2)*(" + rand + "-0.5)*math.log(" + rand + "/(1-" + rand + ")))",
                    "su" : "" + p100 + "-math.exp(-(-math.log(" + p100 + "-" + p50 + ")-(1/2)*(math.log((1-" + percentileSelect + ")/" + percentileSelect + "))**-1*math.log((" + p100 + "-" + p95 + ")/(" + p100 + "-" + p5 + "))*math.log(" + rand + "/(1-" + rand + "))-((1-2*" + percentileSelect + ")*(math.log((1-" + percentileSelect + ")/" + percentileSelect + ")))**-1*math.log(((" + p100 + "-" + p95 + ")*(" + p100 + "-" + p5 + "))/(" + p100 + "-" + p50 + ")**2)*(" + rand + "-0.5)*math.log(" + rand + "/(1-" + rand + "))))",
                    "b" : "(" + p0 + "+" + p100 + "*math.exp(math.log((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))+(1/2)*(math.log((1-" + percentileSelect + ")/" + percentileSelect + "))**-1*math.log(((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))/((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))*math.log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(math.log((1-" + percentileSelect + ")/" + percentileSelect + ")))**-1*math.log((((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))*((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))/((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))**2)*(" + rand + "-0.5)*math.log(" + rand + "/(1-" + rand + "))))/(1+math.exp(math.log((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))+(1/2)*(math.log((1-" + percentileSelect + ")/" + percentileSelect + "))**-1*math.log(((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))/((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))*math.log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(math.log((1-" + percentileSelect + ")/" + percentileSelect + ")))**-1*math.log((((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))*((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))/((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))**2)*(" + rand + "-0.5)*math.log(" + rand + "/(1-" + rand + "))))"
                },
                "R": {
                    "u" : p50 + "+(1/2)*(log((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*(" + p95 + "-" + p5 + ")*log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(log((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*(1-2*(" + p50 + "-" + p5 + ")/(" + p95 + "-" + p5 + "))*(" + p95 + "-" + p5 + ")*(" + rand + "-0.5)*log(" + rand + "/(1-" + rand + "))",
                    "sl": p0 + "+exp(log(" + p50 + "-" + p0 + ")+(1/2)*(log((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*log((" + p95 + "-" + p0 + ")/(" + p5 + "-" + p0 + "))*log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(log((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*log(((" + p95 + "-" + p0 + ")*(" + p5 + "-" + p0 + "))/(" + p50 + "-" + p0 + ")^2)*(" + rand + "-0.5)*log(" + rand + "/(1-" + rand + ")))",
                    "su" : p100 + "-exp(-(-log(" + p100 + "-" + p50 + ")-(1/2)*(log((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*log((" + p100 + "-" + p95 + ")/(" + p100 + "-" + p5 + "))*log(" + rand + "/(1-" + rand + "))-((1-2*" + percentileSelect + ")*(log((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*log(((" + p100 + "-" + p95 + ")*(" + p100 + "-" + p5 + "))/(" + p100 + "-" + p50 + ")^2)*(" + rand + "-0.5)*log(" + rand + "/(1-" + rand + "))))",
                    "b" : "(" + p0 + "+" + p100 + "*exp(log((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))+(1/2)*(log((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*log(((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))/((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))*log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(log((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*log((((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))*((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))/((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))^2)*(" + rand + "-0.5)*log(" + rand + "/(1-" + rand + "))))/(1+exp(log((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))+(1/2)*(log((1-" + percentileSelect + ")/" + percentileSelect + "))^-1*log(((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))/((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))*log(" + rand + "/(1-" + rand + "))+((1-2*" + percentileSelect + ")*(log((1-" + percentileSelect + ")/" + percentileSelect + ")))^-1*log((((" + p95 + "-" + p0 + ")/(" + p100 + "-" + p95 + "))*((" + p5 + "-" + p0 + ")/(" + p100 + "-" + p5 + ")))/((" + p50 + "-" + p0 + ")/(" + p100 + "-" + p50 + "))^2)*(" + rand + "-0.5)*log(" + rand + "/(1-" + rand + "))))"
                }
            };
            return formulas_dictionary[type][bounding]
    };

};

function createMetalog(type) {

    let p0_ = $("#p0").val();
    let p5_ = $("#p5").val();
    let p50_ = $("#p50").val();
    let p95_ = $("#p95").val();
    let p100_ = $("#p100").val();
    quantileSelect = $("#quantileSelect").val();
    percentileSelect = Number(quantileSelect/100);

    console.log(Metalog.bounding(p0_,p100_));

    randRef = $("#randRef").val();

    var feasible = Metalog.feasibilityTest(p0_, p5_, p50_, p95_, p100_, percentileSelect);
    var printout = "";

    if (feasible) {
        // Add in import statements depending on platform
        switch (type) {
                default: 
                    printout = "Error"
                    break;
                case 'excel': 
                    var randExcel = ""
                    if (hdrToggle) {
                        console.log(hdrToggle)
                        randExcel = "( MOD(( MOD( MOD( 999999999999989, MOD( PM_Index*2499997 + (" + $("#varid").val() + ")*1800451 + (" + $("#entity").val() + ")*2000371 + (0)*1796777 + (0)*2299603, 7450589 ) * 4658 + 7450581 ) * 383, 99991 ) * 7440893 + MOD( MOD( 999999999999989, MOD( PM_Index*2246527 + (" + $("#varid").val() + ")*2399993 + (" + $("#entity").val() + ")*2100869 + (0)*1918303 + (0)*1624729, 7450987 ) * 7580 + 7560584 ) * 17669, 7440893 )) * 1343, 4294967296 ) + 0.5 ) / 4294967296"
                    } else {
                        randExcel = randRef;
                    }
                    printout = Metalog.formula(p0_, p5_, p50_, p95_, p100_, randExcel, type, percentileSelect);
                    break;

                case 'R': 
                    if (hdrToggle) {
                        console.log(hdrToggle)
                        printout = String.raw`install.packages("{ADD YOUR DIRECTORY TO THE PACKAGE HERE}/rHDR",repos = NULL,type="source")`;
                        printout += "\n\nlibrary(rHDR)\nrandoms = sample.HDR(1000," + $("#varid").val() + "," + $("#entity").val() + ",0,0)\n"
                    };

                    printout += "metalog <- function("+randRef+"){\n\t";
                    printout += Metalog.formula(p0_, p5_, p50_, p95_, p100_, randRef, type, percentileSelect);
                    printout += "\n}\n\nhead(metalog(randoms))";
                    break;

                case 'python': 
                    if (hdrToggle) {
                        printout = "from Github.PyHDR.hdr import hdr\nimport math\npm_trials = 100000 \nvar =  "+ $("#varid").val() +" \nent = " + $("#entity").val() + " \nrandoms = hdr(pm_trials=pm_trials, var=var, ent=ent, attr1=0, attr2=0, round_off= 15)\n\n";
                    }

                    printout += "metalogArray = []\n\ndef monteCarlo(randoms, array): \n\n\tfor rand in randoms:\n\t\tmetalogVal ="+ Metalog.formula(p0_, p5_, p50_, p95_, p100_, randRef, type, percentileSelect); +"\n\n\t\tarray.append (float('{0:.16f}'.format(metalogVal)))\n\nreturn metalogArray\n\nmonteCarlo("

                    break;
            }

    } else {
        console.log("Failed feasibility test")
        printout = "Metalog inputs are outside feasible range.";
    };

    return printout
};

function generateOutput(){
    printout = createMetalog($("#generate-type").val());
    $("#excel-placeholder").val(printout);
}

