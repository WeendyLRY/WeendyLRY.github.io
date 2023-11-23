 // Load data from CSV
 d3.csv("https://raw.githubusercontent.com/WeendyLRY/Data_For_DV_Lab/main/cpi_population_dataset.csv").then(function(data) {
    // Function to update the line chart based on the selected state
    function updateLineChart() {
        // Get selected state from the dropdown
        const selectedState = document.getElementById("stateSelectorPopulation").value;

        // Filter data for the selected state
        const filteredData = data.filter(d => d.state === selectedState);

        // Update the chart with filtered data
        updateChart(filteredData);
    }

    // Initial chart setup
    updateLineChart();

    // Function to update the chart based on the provided data
    function updateChart(data) {
        // Extract unique years
        const years = [...new Set(data.map(d => d.year))];

        // Set up dimensions and margins
        const margin = { top: 20, right: 190, bottom: 30, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3.select("#section-7-line-chart")
            .html("")  // Clear previous content
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Create scales
        const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(+d.population, +d.food_beverage, +d.housing_utilities))])
            .range([height, 0]);

        // Create line functions
        const populationLine = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(+d.population));

        const foodLine = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(+d.food_beverage));

        const housingLine = d3.line()
            .x(d => xScale(d.year) + xScale.bandwidth() / 2)
            .y(d => yScale(+d.housing_utilities));

        // Draw lines
        svg.append("path")
            .data([data])
            .attr("d", populationLine)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 2);

        svg.append("path")
            .data([data])
            .attr("d", foodLine)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2);

        svg.append("path")
            .data([data])
            .attr("d", housingLine)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2);

        // Add axes
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Add labels
        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.top + 20)
            .text("Year");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 20)
            .attr("x", -margin.top)
            .text("Values");

        // Add legend
        svg.append("text")
            .attr("x", width - 30)
            .attr("y", 10)
            .text("Population")
            .attr("fill", "blue");

        svg.append("text")
            .attr("x", width - 30)
            .attr("y", 30)
            .text("Food & Beverage")
            .attr("fill", "green");

        svg.append("text")
            .attr("x", width - 30)
            .attr("y", 50)
            .text("Housing Utilities")
            .attr("fill", "red");
    }

    // Expose the updateLineChart function to the global scope
    window.updateLineChart = updateLineChart;
});