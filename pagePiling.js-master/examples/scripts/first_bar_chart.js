$(document).ready(function () {
    var selectedYear = 2020;
    var csvFilePath = 'https://raw.githubusercontent.com/WeendyLRY/Data_For_DV_Lab/main/gdp_vs_population.csv'; 
  
    // Function to update the bar chart based on the selected year
    function updateBarChart(year, data) {
        var filteredData = data.filter(function (d) {
            return d.year === year;
        });
  
        var categories = filteredData.map(function (d) {
            return d.state;
        });
  
        var populationData = filteredData.map(function (d) {
            return d.year_population;
        });
  
        var gdpData = filteredData.map(function (d) {
            return d.year_gdp;
        });
  
        Highcharts.chart('barchartpopulationvsgdp', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Population vs GDP'
            },
            xAxis: {
                categories: categories,
                title: {
                    text: 'State'
                }
            },
            yAxis: [{
                title: {
                    text: 'Population'
                }
            }, {
                title: {
                    text: 'GDP'
                },
                opposite: true
            }],
            series: [{
                name: 'Population',
                data: populationData
            }, {
                name: 'GDP',
                data: gdpData,
                yAxis: 1
            }]
        });
  
        $('#barchartpopulationvsgdpyear').text(year);
    }
  
    // Load data from CSV
    d3.csv(csvFilePath).then(function (data) {
        // Parse CSV data
        data.forEach(function (d) {
            d.year = +d.year;
            d.year_population = +d.year_population;
            d.year_gdp = +d.year_gdp;
        });
  
        // Initial update
        updateBarChart(selectedYear, data);
  
       // Handle slider change event
  $('#gdppopulation_slider').on('input', function () {
    var newYear = +$(this).val();
    console.log('Selected Year:', newYear); // Add this line for debugging
    updateBarChart(newYear, data);
  });
  
    }).catch(function (error) {
        console.error('Error loading CSV file:', error);
    });
  });
  