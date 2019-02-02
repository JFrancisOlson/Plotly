function buildMetadata(sample) {
    //  console.log(sample);
  // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample
    var url =`/metadata/${sample}`;
    d3.json(url).then(function(response) {
   
    //console.log("______________________");  
    //console.log(data);

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("sample-metadata").html("");
    

    // var myObj = {"AGE":34.0,"BBTYPE":"I","ETHNICITY":"Caucasian/Midleastern","GENDER":"F","LOCATION":"Chicago/IL","WFREQ":1.0,"sample":941}
    var myObj = response;
      a = myObj.AGE;
      document.getElementById("AGE").innerHTML = "AGE :      " + a;
      b = myObj.BBTYPE;
      document.getElementById("BBTYPE").innerHTML = "BBTYPE :   " + b;
      c = myObj.ETHNICITY;
      document.getElementById("ETHNICITY").innerHTML = "ETHNICITY : " + c;
      d = myObj.GENDER;
      document.getElementById("GENDER").innerHTML = "GENDER :   " + d;
      e = myObj.LOCATION;
      document.getElementById("LOCATION").innerHTML = "LOCATION : " + e;
      // f = myObj.WFREQ;
      // document.getElementById("WFREQ").innerHTML = "WFREQ :    " + f;
      g = myObj.sample;
      document.getElementById("sample").innerHTML = "sample :    " + g;

// BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ); choose the wfreq data and set as var level
var level = myObj.WFREQ;

// Trig to calc meter point with 15.5 scaling factor to match dial gauge to value
var degrees = 180 - 15.5*level,
     radius = .65;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

//  sweep
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 18, color:'850000'},
    showlegend: false,
    name: 'scrubs',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['8-9', '7-8', '6-7', '5-6',
            '4-5', '3-4', '2-3','1-2','0-1',''],
  textinfo: 'text',
  textposition:'inside',      
  marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4','2-3','1-2','0-1', ''],
  hoverinfo: 'label',
  hole: .75,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Wash Frequency</b> <br> Scrubs Per Week',
  height: 300,
  width: 400,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
    });
  }


   
    

function buildCharts(sample) {
      // console.log(sample);
  // @TODO: Use `d3.json` to fetch the sample data for the plots
/* data route */
     var url = `/samples/${sample}`;
       d3.json(url).then(function(response) {

      console.log(response);
       
       var myObj1 = response;

    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      mode: 'markers',
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        opacity: 1,
        size: response.sample_values,
      }
    };
    
    var data = [trace1];
    
    var layout = {
      title: 'Marker Size and Color',
      showlegend: false,
      
    };
    
    Plotly.newPlot('bubble', data, layout, {showSendToCloud:true});
    
//  }
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var data = [{
      values: response.sample_values,
      labels: response.otu_ids,
      type: 'pie'
    }];
    
    Plotly.newPlot('pie', data, {}, {showSendToCloud:true});
   
 
//  buildPlot(); (edited) 
});

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
