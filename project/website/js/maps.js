
function create_map_title(){
  d3.select("body").append("div")
  .append("h1")
  .attr("class", "titles")
  .text("Evolution of genre through time");
}


function create_map(){
// legend parameters
var bar_thickness = 10;
var h_legend = 500;

// Title of maps
var map_title = d3.select("body")
.append("h1")
.attr("class", "titles")
.text("Global Colors");


var div_map = d3.select("body")
.append("div")
.attr("id", "maps")
.attr("class", "container containermap");


// Define map svg
var svg = d3.select("#maps").append("svg")
.attr("width", "70%")
.attr("height", h_legend)
.attr("y", 0)
.attr("id", "map_map");
// .attr("viewBox", "0 0 100 100");
// .attr("height", h);

// Define legend svg
var svgLegend = d3.select("#maps").append("svg")
.attr("width", "25%")
.attr("height", h_legend)
.attr("id", "map_legend")
.classed("svglegend",true);

var div_slider = d3.select("body").append("div")
.style("text-align", "center")
.attr("id","sliderContainer");

// Define slider
var slider_select = d3.select("#sliderContainer").append("input")
.attr("class", "slider")
.attr("min", 0)
.attr("max", 5)
.attr("type", "range")
.attr("id", "mapRange");
var slider = document.getElementById("mapRange");

var div_button = d3.select("body").append("div")
.style("text-align", "center")
.attr("id", "buttonContainer");

// Add button to play timelapse
var play_button = d3.select("#buttonContainer").append("input")
.attr("name", "play_button")
.attr("type", "button")
.attr("value", "Play !")
.attr("playing", 0);


// data_index for the dataset_array
var dataset_array;
var data_index = 0;

// Text to click on in order to change the map
var para = d3.select("body")
.append("p")
.attr("id", "click_map")
.text("click here or on the map to change map");

// Load first the world map
d3.json("data/topojson/world-map.json", function(error, json){
  if(error){
    console.log(error);
  }

// Load the dataset of maps filename
  d3.json("data/maps/dataset_index.json", function(error_dataset, dataset_json){
    if(error_dataset){
      console.log(error_dataset);
    }

    var bar_length = document.getElementById("map_legend").getBoundingClientRect().width/3;

// Fill the dataset vars
    dataset_array = dataset_json.data;
// Adapt length of slider
    slider.setAttribute("max", dataset_array.length - 1);

// select the global map as beginning (last index)
  dataset_select = dataset_array[dataset_array.length-1];


  console.log(svg.node().width.baseVal.value);
  ratio = 6/7;
  //  h of map
  w = svg.node().width.baseVal.value;
  h = ratio*w;

  if(h>h_legend){
    svg.attr("height", h);
    svgLegend.attr("height", h);
  }


  // Assign computed width to svg
  // svg.attr("height", h);
  // Assign computed height to svg legend
  // svgLegend.attr("height", h_legend);

  // Projection of the topojson in a plan
  var projection = d3.geoMercator()
  // .translate([w/2, h/2])
  .translate([w/3*2, h/3*2])
  .scale([190*w/1100]);

  var path = d3.geoPath().projection(projection);


  // Init svg for countries
    svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)



    // Detect click on map and display the next one
    svg.on("click", function(){
      updateMap(json);
    })
    // Detect if going out of the map -> reinit opacity
    svg.on("mouseout", function(){
      reinitOpacity(json);
    });

//  Detect click on legend and display the next map
    svgLegend.on("click", function(){
          updateMap(json);
    })
    .on("mouseout", function(){
      reinitOpacity(json);
    });

    // Detect click on paragraph and update map
    d3.selectAll("p")
    .on("click", function(){
      updateMap(json);
    });

// Detect slider change of value and update map
    slider.oninput = function() {
        updateMap(json, this.value);
    }

// Detect click on button and play movie
    play_button.on("click", function(){
      console.log(play_button.attr("playing"));
      console.log(typeof(play_button.attr("playing")));
      if(play_button.attr("playing") == 0){
        console.log("let's play");
        play_button.attr("playing", 1);
        play();

      }
    });

    updateMap(json,0);



function updateMap(json_var, index_arg = -1){

    if(index_arg == -1){
      data_index++;
      if(data_index >= dataset_array.length)
      {
        data_index = 0;
      }
      slider.value  = data_index;
      console.log("coucou");
      dataset_select = dataset_array[data_index];
    }
    else{
      dataset_select = dataset_array[index_arg];
      data_index = index_arg;
      slider.value = data_index;
    }


// set title
    map_title.text(dataset_select.title);

// Load country color data json
    d3.json("data/maps/" + dataset_select.country_json, function(error_dataset, country_data_json){
      if(error_dataset){
        console.log(error_dataset);
      }

      data = country_data_json.features;

      // Load legend
      d3.json("data/maps/" + dataset_select.legend_json, function(errorlegend, legend_data_json){
        if(errorlegend)
        {
          console.log(errorlegend);
        }
        data_legend = legend_data_json.features;

      // Check for every country if there is a value and init with #ccc
      // Find the corresponding country inside the GeoJSOn
      for(var j=0; j < json_var.features.length; j++){

        var jsonCountry = json_var.features[j].properties.name;
        var foundCountry = false;
        for(var i = 0; i < data.length; i++){
      // Grab country name
          var dataCountry = data[i].country;
        if(dataCountry == jsonCountry){
          json_var.features[j].properties.value = data[i].color;
          foundCountry = true;
          break;
        }
        // If no color, put init color
        if(!foundCountry){
          json_var.features[j].properties.value = "#ccc";
        }
      }

    }


  // Update all paths
    svg.selectAll("path")
    .data(json_var.features)
    // .enter()
    // .append("path")
    // .transition()
    // .duration(function(d,i){
    //   return 2*i;
    // })
    .attr("d", path)
    .style("fill", function(d){
      return color_value(d);
    })
    .attr("currentColor",function(d){
      return color_value(d);
    })
    .on("mouseover", function(d){
      if(this.getAttribute("selected") == 1){
      }
      else {
        if(color_value(d) != "#ccc")
        {
          changeOpacity(json_var,data_legend, color_value(d));
          this.setAttribute("selected", 1);
        }
      };
    });


    //console.log(data_legend);
    svgLegend.selectAll("rect").remove();
    var bars = svgLegend.selectAll("rect")
    .data(data_legend)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d,i){
      return i*(bar_thickness);
    })
    .attr("width", bar_length)
    .attr("height", bar_thickness)
    .style("fill", function(d){
      // console.log(d.color);
      return d.color;

    })
    .on("mouseover", function(d){
      if(this.getAttribute("selected") == 1){
        // console.log("selected");
        // reinitOpacity(json_var);
      }
      else {
        // console.log("not selected");
        changeOpacity(json_var,data_legend, d.color);
        this.setAttribute("selected", 1);
      };
    });

// Clean legend text
    svgLegend.selectAll("text").remove();
// Add text to legend

    svgLegend.selectAll("text")
    .data(data_legend)
    .enter()
    .append("text")
    .text(function(d){
      // console.log(d.tag);
      return d.tag;
    })
    .attr("class", "legend_text")
    .attr("x", bar_length + 5)
    .attr("y", function(d,i){
      return (i+1)*(bar_thickness) -1;
    })
    .classed("legend", true);
      });

});
}

function changeOpacity(json, legend, color)
{
  var lowOpacity = 0.1;

  // console.log(color);

  svg.selectAll("path")
  .data(json.features)
  .style("fill", function(d){
    // console.log(d.color);

    if(d.properties.value == color){
      return d.properties.value;
    }
    else {
      return "#ccc";
    }
  })
  .attr("currentColor",function(d){
    if(d.properties.value == color){
      return d.properties.value;
    }
    else {
      return "#ccc";
    }
  });

  svgLegend.selectAll("rect")
  .data(legend)
  .style("opacity", function(d){
    if(d.color == color){
      return 1;
    }
    else {
      return lowOpacity;
    }
  })
  .attr("selected", 0);
}

function reinitOpacity(json)
{
// Reset color in graph
  svg.selectAll("path")
  .data(json.features)
  .style("fill", function(d){
    return(color_value(d));
  })
  .attr("currentColor", function(d){
    return(color_value(d));
  });

  // Reset opacity in legend
  svgLegend.selectAll("rect")
  .style("opacity", "1")
  .attr("selected", 0);

  svg.selectAll("path")
  .attr("selected", 0);

}

function color_value(d){
  var value = d.properties.value;
  if(value){
    return value;
  }
  else{
    return "#ccc";
  }
}

function play(){
  updateMap(json,0);
  var timer_var = setInterval(myTimer, 1000);
  function myTimer(){
    updateMap(json);
    if(data_index == dataset_array.length -1){
      clearInterval(timer_var);
      play_button.attr("playing", 0);
  }
  }

}
});
});

}
