d3.json('./static/data/samples.json').then(function(data) {
    console.log(data);
});


function buildMetadata(sample) {
    d3.json("./static/data/samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
      PANEL.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    //   buildGauge(result.wfreq);
    });
  }

function optionChanged(newsample) {
    buildMetadata(newsample);
    charts(newsample);
}

function init() {
    var dropDown = d3.select("#selDataset")
    d3.json("./static/data/samples.json").then((data) => {
        var names = data.names;
            names.forEach((name) => {
                dropDown.append("option").text(name).property("value", name);
            });
        var initialValue = names[0];
        buildMetadata(initialValue);
        charts(initialValue);
    })
}

init();


function charts(sample) {
    d3.json("./static/data/samples.json").then((data) => {
        var samples = data.samples;
        var sampleArray = samples.filter(samplesObj => samplesObj.id==sample);
        console.log(sampleArray);
        var results = sampleArray[0];
        var otu_ids = results.otu_ids;
        var otu_labels = results.otu_labels;
        var sample_values = results.sample_values;

        var trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: 'markers',
            marker: {
              size: sample_values,
              color: otu_ids,
              color_scale: "Rainbow",
            }
          };
          
          var data = [trace1];
          
          var layout = {
            title: 'Bacteria Cultures per Sample',
            showlegend: false
            // height: 600,
            // width: 600
          };
          
          Plotly.newPlot('bubble', data, layout);




          var bardata = [
            {
              x: otu_ids.slice(0, 10),
              y: sample_values.slice(0, 10),
              text: otu_labels.slice(0, 10),
              type: 'bar',
              orientation: "h"
            }
          ];
          
          Plotly.newPlot('bar', bardata);
    })
}