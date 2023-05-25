// Use the D3 library to read in json from url: https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(url).then(function(data) {
    console.log("Data: ", data);
    createChart(data, data.names[0]); // Pass the data to the createChart function
    displayMetadata(data.metadata[0]);
});

function createChart(data, selectedIndividual) {
    // Get the data for the selected individual
    const selectedData = data.samples.find(sample => sample.id === selectedIndividual);

    // Extract the top 10 OTUs from the selected data
    const topOTUs = selectedData.otu_ids.slice(0, 10);
    const topValues = selectedData.sample_values.slice(0, 10);
    const topLabels = selectedData.otu_labels.slice(0, 10);

    // Create the horizontal bar chart
    const trace1 = {
        x: topValues,
        y: topOTUs.map(otu => `OTU ${otu}`),
        text: topLabels,
        type: 'bar',
        orientation: 'h'
    };

    const layout1 = {
        title: `Top 10 OTUs for Individual ${selectedIndividual}`,
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
    };

    const data1 = [trace1];

    Plotly.newPlot('bar', data1, layout1);

    // Create the bubble chart
    const trace2 = {
        x: selectedData.otu_ids,
        y: selectedData.sample_values,
        text: selectedData.otu_labels,
        mode: 'markers',
        marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorscale: 'Earth'
        }
    };

    const layout2 = {
        title: 'OTU ID vs. Sample Values',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    const data2 = [trace2];

    Plotly.newPlot('bubble', data2, layout2);
}

function displayMetadata(metadata) {
    const sampleMetadata = d3.select("#sample-metadata");

    sampleMetadata.html(""); // Clear previous metadata

    // Iterate over each key-value pair in the metadata and display it
    Object.entries(metadata).forEach(([key, value]) => {
        sampleMetadata
            .append("p")
            .text(`${key}: ${value}`);
    });
}

// Add a dropdown menu to the HTML that triggers the createChart and displayMetadata functions when the selection changes
d3.json(url).then(function(data) {
    const dropdown = d3.select("#selDataset");

    dropdown
        .selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(function(d) {
            return d;
        });

    dropdown.on("change", function() {
        const selectedIndividual = this.value;
        createChart(data, selectedIndividual);
        const selectedMetadata = data.metadata.find(metadata => metadata.id === parseInt(selectedIndividual));
        displayMetadata(selectedMetadata);
    });
});
