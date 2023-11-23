$(function () {
    var population_data = {};
    var population_keys = [];
    var population_years = [];
    
    var gdp_keys = []; // Define GDP-related variables
    var gdp_years = [];
    var gdp_data = {};

    var gdpPopulation_data = {};
    var gdpPopulation_years = [];

    var gdpPopulation_keys = [];

    Promise.all([
        d3.csv("https://raw.githubusercontent.com/WeendyLRY/Data_For_DV_Lab/main/population_state_final_with_key.csv"),
        d3.csv("https://raw.githubusercontent.com/WeendyLRY/Data_For_DV_Lab/main/gdp_state_modified.csv"),
        d3.csv("https://raw.githubusercontent.com/WeendyLRY/Data_For_DV_Lab/main/gdp_vs_population.csv"),
        $.getJSON("https://code.highcharts.com/mapdata/countries/my/my-all.geo.json")
    ]).then(function ([populationData, growthData, gdpPopulationData, mapData]) {

        // Extract data from population CSV
        populationData.forEach(function (row) {
            var population_state = row['hc-key'];
            var population_year = row['year'];
            var population_value = parseFloat(row['year_population']);

            if (!population_keys.includes(population_state)) {
                population_keys.push(population_state);
            }

            if (!population_years.includes(population_year)) {
                population_years.push(population_year);
            }

            if (!population_data[population_year]) {
                population_data[population_year] = [];
            }

            population_data[population_year].push({
                'hc-key': population_state.toLowerCase(),
                value: population_value
            });
        });

        // Extract data from GDP CSV (assuming this structure based on population extraction)
        growthData.forEach(function (row) {
            var gdp_state = row['hc-key'];
            var gdp_year = row['year'];
            var gdp_value = parseFloat(row['year_gdp']);

            if (!gdp_keys.includes(gdp_state)) {
                gdp_keys.push(gdp_state);
            }

            if (!gdp_years.includes(gdp_year)) {
                gdp_years.push(gdp_year);
            }

            if (!gdp_data[gdp_year]) {
                gdp_data[gdp_year] = [];
            }

            gdp_data[gdp_year].push({
                'hc-key': gdp_state.toLowerCase(),
                value: gdp_value
            });
        });

         // Extract data from GDP vs Population CSV
         gdpPopulationData.forEach(function (row) {
            var state = row['state'];
            var year = row['year'];
            var gdp_population_key = row['hc-key'];
            var population_value = parseFloat(row['year_population']);
            var gdp_value = parseFloat(row['year_gdp']);

            if (!gdpPopulation_keys.includes(gdp_population_key)) {
                gdpPopulation_keys.push(gdp_population_key);
            }

            if (!gdpPopulation_years.includes(year)) {
                gdpPopulation_years.push(year);
            }

            if (!gdpPopulation_data[year]) {
                gdpPopulation_data[year] = [];
            }

            gdpPopulation_data[year].push({
                'hc-key': gdp_population_key.toLowerCase(),
                state: state,
                Population: population_value,
                GDP: gdp_value
            });
        });

        // Sort years in ascending order
        population_years.sort();
        gdp_years.sort();
        // Sort years in ascending order
        gdpPopulation_years.sort();

        // Load the map data
        $.getJSON("https://code.highcharts.com/mapdata/countries/my/my-all.geo.json", function (mapData) {
            
            // Initiate the chart
            var population_chart = Highcharts.mapChart('containerPopulation', {
                title: {
                    text: 'Population by state'
                },
                subtitle: {
                    text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/my/my-all.js">countries/my/my-all</a>'
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                colorAxis: {
                    min: 0
                },
                series: [{
                    data: population_data[population_years[0]],
                    mapData: mapData,
                    joinBy: 'hc-key',
                    name: 'Population', // Update series name to 'Population'
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }, {
                    name: 'Separators',
                    type: 'mapline',
                    data: Highcharts.geojson(mapData, 'mapline'),
                    color: 'silver',
                    showInLegend: false,
                    enableMouseTracking: false
                }]
            });

            // Initiate the chart
            var gdp_chart = Highcharts.mapChart('containerGDP', {
                title: {
                    text: 'Growth by state'
                },
                subtitle: {
                    text: 'Source map: <a href="https://code.highcharts.com/mapdata/countries/my/my-all.js">countries/my/my-all</a>'
                },
                mapNavigation: {
                    enabled: true,
                    buttonOptions: {
                        verticalAlign: 'bottom'
                    }
                },
                colorAxis: {
                    min: 0
                },
                series: [{
                    data: gdp_data[gdp_years[0]],
                    mapData: mapData,
                    joinBy: 'hc-key',
                    name: 'Growth', // Update series name to 'Population'
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }, {
                    name: 'Separators',
                    type: 'mapline',
                    data: Highcharts.geojson(mapData, 'mapline'),
                    color: 'silver',
                    showInLegend: false,
                    enableMouseTracking: false
                }]
            });



            
            

            


            $('#population_slider').on('input change', function (e) {
                var population_selectedYear = e.target.value;
                console.log("Slider Value:", population_selectedYear);

                // Update the slider population_selectedYear
                $('#populationyear').text(population_selectedYear);

                if (population_data[population_selectedYear]) {
                    console.log("Data for the selected year exists.");

                    var population_newData = population_keys.map(function (population_key) {
                        return population_data[population_selectedYear].find(function (point) {
                            return point['hc-key'] === population_key.toLowerCase();
                        }) || { 'hc-key': population_key.toLowerCase(), value: 0 };
                    });

                    console.log("New Data:", population_newData);

                    // Update the map data and redraw the chart
                    population_chart.series[0].setData(population_newData, function () {
                        // The callback function is called after the setData operation is complete
                        // Update map data and redraw
                        population_chart.update({
                            series: [{
                                data: population_newData,
                                mapData: mapData
                            }]
                        });
                    });
                } else {
                    console.log("Data for the selected year is not available.");
                }
            });

            $('#gdp_slider').on('input change', function (e) {
                var gdp_selectedYear = e.target.value;
                console.log("Slider Value:", gdp_selectedYear);

                // Update the slider population_selectedYear
                $('#gdpyear').text(gdp_selectedYear);

                if (gdp_data[gdp_selectedYear]) {
                    console.log("Data for the selected year exists.");

                    var gdp_newData = gdp_keys.map(function (gdp_key) {
                        return gdp_data[gdp_selectedYear].find(function (point) {
                            return point['hc-key'] === gdp_key.toLowerCase();
                        }) || { 'hc-key': gdp_key.toLowerCase(), value: 0 };
                    });

                    console.log("New Data:", gdp_newData);

                    // Update the map data and redraw the chart
                    gdp_chart.series[0].setData(gdp_newData, function () {
                        // The callback function is called after the setData operation is complete
                        // Update map data and redraw
                        gdp_chart.update({
                            series: [{
                                data: gdp_newData,
                                mapData: mapData
                            }]
                        });
                    });
                } else {
                    console.log("Data for the selected year is not available.");
                }
            });

            

        });
    });
});
