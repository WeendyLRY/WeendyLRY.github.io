    // Load data from CSV file
    d3.csv("https://raw.githubusercontent.com/WeendyLRY/Data_For_DV_Lab/main/cpi_population_dataset.csv").then(function(data) {
       // Process the data
       const processedData = d3.stack().keys(["food_beverage", "housing_utilities"])(data);

       // Set up dimensions for the chart
       const margin = { top: 20, right: 300, bottom: 60, left: 100 };
       const chartWidth = 900 - margin.left - margin.right;
       const chartHeight = 400 - margin.top - margin.bottom;

       // Create SVG container
       const svg = d3.select("#section-7-stacked-chart")
           .append("svg")
           .attr("width", chartWidth + margin.left + margin.right)
           .attr("height", chartHeight + margin.top + margin.bottom)
           .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       // Set up scales
       const xScale = d3.scaleBand()
           .domain(data.map(d => d.state))
           .range([0, chartWidth])
           .padding(0.1);

       const yScale = d3.scaleLinear()
           .domain([0, d3.max(processedData[1], d => d[1])])
           .range([chartHeight, 0]);

       // Create bars
       svg.selectAll(".bar")
           .data(processedData)
           .enter().append("g")
           .attr("fill", (d, i) => i === 0 ? "#66c2a5" : "#fc8d62")
           .selectAll("rect")
           .data(d => d)
           .enter().append("rect")
           .attr("x", (d, i) => xScale(data[i].state))
           .attr("y", d => yScale(d[1]))
           .attr("height", d => yScale(d[0]) - yScale(d[1]))
           .attr("width", xScale.bandwidth());

       // Add axes
       svg.append("g")
           .attr("transform", "translate(0," + chartHeight + ")")
           .call(d3.axisBottom(xScale))
           .selectAll("text")
           .style("text-anchor", "end")
           .attr("transform", "rotate(-45)");

           svg.append("g")
           .call(d3.axisLeft(yScale))
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 50)  // Adjust the value to move the label up or down
           .attr("dy", "1em")
           .attr("text-anchor", "end")
           .text("CPI Values");
       

       // Add legend
       const legend = svg.append("g")
           .attr("transform", "translate(" + (chartWidth + 10) + "," + 10 + ")");

       const legendColors = ["#66c2a5", "#fc8d62"];
       const legendLabels = ["Food and Beverage", "Housing Utilities"];

       legend.selectAll("rect")
           .data(legendColors)
           .enter().append("rect")
           .attr("y", (d, i) => i * 20)
           .attr("width", 18)
           .attr("height", 18)
           .attr("fill", d => d);

       legend.selectAll("text")
           .data(legendLabels)
           .enter().append("text")
           .attr("y", (d, i) => i * 20 + 12)
           .attr("x", 25)
           .text(d => d);
   
  });
