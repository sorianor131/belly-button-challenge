// Read in samples data from the URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json'

// Initialize the dashboard
function init() {

    // Use D3 to select dropdown
    let dropdown = d3.select("#selDataset");

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(data)

        // Create an array of the ID names
        let IDnames = data.names;

        // Iterate through the names array and append each to the dropdown menu
        IDnames.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });

        // Assign the first name to build plots
        let name = IDnames[0];

        // Call function to create visuals
        panel(name);
        barchart(name);
        bubble(name);
        gauge(name);
    });
}

// Make the demographic info panel
function panel(selectedValue) {

    d3.json(url).then((data) => {

        // Create an array of the metadata objects
        let metadata = data.metadata;
        
        // Filter data where id = selected value
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
      
        // Assign the first object to obj variable
        let obj = filteredData[0]
        
        // Use .html("") to clear any existing metadata
        d3.select("#sample-metadata").html("");
  
        // Use Object.entries() to return key-value pairs
        // Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        let results = Object.entries(obj);

        // Iterate through the entries array
        // Add a h5 child element for each key-value pair
        results.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });

        // Log the entries Array
        console.log(results);
    });
  }
  

// Make the bar chart
function barchart(selectedValue) {
    d3.json(url).then((data) => {

        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
        
        // Trace the data to create bar chart
        let trace = [{
            // Slice the top 10 otus
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }];
        
        Plotly.newPlot("bar", trace);
    });
}
  
// Make the bubble chart
// Reference: https://plotly.com/javascript/bubble-charts/
// https://plotly.com/javascript/colorscales/
function bubble(selectedValue) {
    d3.json(url).then((data) => {

        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
        
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Earth"
            }
        }];
    
        // Add title to x-axis
        let layout = {
            xaxis: {title: "OTU ID"}
        };
    
        Plotly.newPlot("bubble", trace, layout);
    });
}

// Make the gauge chart 
function gauge(selectedValue) {
    d3.json(url).then((data) => {

        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0]

        let trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: obj.wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
            type: "indicator", 
            mode: "gauge+number",
            gauge: {
                axis: {range: [0, 10]}, 
                bar: {color: "rgb(50,205,50)"},
                steps: [
                    { range: [0, 1], color: "rgba(255, 255, 255, 0)" },
                    { range: [1, 2], color: "rgba(232, 226, 202, .5)" },
                    { range: [2, 3], color: "rgba(210, 206, 145, .5)" },
                    { range: [3, 4], color: "rgba(202, 209, 95, .5)" },
                    { range: [4, 5], color: "rgba(184, 205, 68, .5)" },
                    { range: [5, 6], color: "rgba(170, 202, 42, .5)" },
                    { range: [6, 7], color: "rgba(142, 178, 35 , .5)" },
                    { range: [7, 8], color: "rgba(110, 154, 22, .5)" },
                    { range: [8, 9], color: "rgba(50, 143, 10, 0.5)" },
                    { range: [9, 10], color: "rgba(14, 127, 0, .5)" }
                ]
            }
        }];

        let layout = {
                width: 500,
                height: 500,
        }

         Plotly.newPlot("gauge", trace, layout);
    });
}

// Update visuals based on selection
function optionChanged(selectedValue) {
    panel(selectedValue);
    barchart(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();
