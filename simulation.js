
var citySize = 1000; // in meters

var people = [];

var infectedData = [];
var recoveredData = [];

var totalInfected = 1;
var totalRecovered = 0;
var totalDead = 0;
var days = 0;

var movement = 0.05;

var chart;
var barChart;

var infectionRadius = 75; // meters

var updateInterval; // result of setInteval

// colors representing uninfected, infected, recovered, dead
const UNINFECTED = "green";
const INFECTED = "red";
const RECOVERED = "blue";
const DEAD = "black";

window.onload = function() {

    $("#start").click(function() {
        updateInterval = setInterval(update, 1000);
    });
    $("#stop").click(function() {
        clearInterval(updateInterval);
    });
    $("#reset").click(function() {
        clearInterval(updateInterval);
        init();
        chart.render();
        barChart.render();
    });

    init();

    chart.render();
    barChart.render();
}

/**
 * Initialize the people array and graphs.
 * 
 */
function init() {

    // create people randomly distibuted in the city
    for (var i = 0; i < 100; i++) {
        people[i] = {
            x: Math.random() * citySize,
            y: Math.random() * citySize,
            color: "green",
            id: i,
            dx: (0.5 - Math.random()) * movement * citySize,
            dy: (0.5 - Math.random()) * movement * citySize
        };
    }

    // start with one infected
    people[Math.floor(Math.random() * 100)].color = INFECTED;

    infectedData = [];
    infectedData.push({x:0, y: 1});

    chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        zoomEnabled: true,
        title:{
            text: "Population"
        },
        axisX: {
            title:"Distance (meters)",
            minimum: 0,
            maximum: citySize
        },
        axisY:{
            title: "Distance (meters)",
            minimum: 0,
            maximum: citySize
        },
        data: [{
            type: "scatter",
            toolTipContent: "<b>Area: </b>{x} sq.ft<br/><b>Price: </b>${y}k",
            //name: "Uninfected",
		    showInLegend: true,
            dataPoints: people
        }]
    });
    chart.render();  

    // Bar Chart
    barChart = new CanvasJS.Chart("barChartContainer", {
        animationEnabled: true,
        title: {
            text: "Infections"
        },
        axisX: {
            title: "Days",
            minimum: 0
        },
        axisY: {
            title: "Number of Infections",
            //titleFontColor: "#4F81BC",
            min: 0,
            maximum
            : 100
        },
        data: [{
            indexLabelFontColor: "darkSlateGray",
            name: "views",
            type: "area",
            yValueFormatString: "",
            dataPoints: infectedData,
            name: "Infected",
		    showInLegend: true,
            legendMarkerType: "square",
            
        },
        {
            indexLabelFontColor: "darkSlateGray",
            name: "views",
            type: "area",
            yValueFormatString: "",//"#,##0.0mn",
            dataPoints: recoveredData,
            name: "Recovered",
		    showInLegend: true,
            legendMarkerType: "square",
        },
        ]
    });
}

/**
 * Update the people array and re-render the graphs.
 * 
 */
function update() {

    days++;

    // infect nearby people
    people.forEach(function(person) {
        
        // Update recovered patients
        if (person.color == INFECTED) {
            if (person.infectedDays == undefined) {
                person.infectedDays = 1;
            } else if (person.infectedDays >= 14) {
                person.color == RECOVERED;
                if (totalInfected > 0) {
                    totalInfected --;
                }
                totalRecovered++;
                recoveredData.push({x:days, y: totalRecovered});

                person.color = RECOVERED;
            } else {
                person.infectedDays++
            }

        }

        people.forEach(function(person2) {

            if (person.color == INFECTED 
                && person2.color == UNINFECTED
                && person.id != person2.id) {

                var deltaX = person.x - person2.x;
                var deltaY = person.y - person2.y;
                var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance <= infectionRadius) {      

                    person2.color = INFECTED;
                    totalInfected++;
                }
            }
        });
    });

    // Update positions
    people.forEach(function(person) {
    
        person.x += person.dx;
        person.y += person.dy;

        if (person.x > citySize - 1) {
             person.x = citySize - 1;
             person.dx = - person.dx;
        }
        if (person.x < 0) {
            person.x = 0;
            person.dx = - person.dx;
        }
        if (person.y > citySize - 1) {
            person.y = citySize - 1;
            person.dy = - person.dy;
        }
        if (person.y < 0) {
            person.y = 0;
            person.dy = - person.dy;
        }

    }, this);

    infectedData.push({x:days, y: totalInfected});

    chart.render();
    barChart.render();

}


