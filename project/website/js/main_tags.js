function create_main_tags_title(){
  d3.select("body").append("div")
  .append("h1")
  .attr("class", "titles")
  .text("Main tags through time");
}

function create_main_tags(){
// var period_array = ['1920', '1950', '1970', '1980', '1990', '2000'];
var period_array = [
 '1920-1950',
 '1950-1970',
 '1970-1980',
 '1980-1990',
 '1990-2000',
 '2000-2010',
 'all_time'
]

var period_order = {
  '1920-1950':0,
  '1950-1970':1,
  '1970-1980':2,
  '1980-1990':3,
  '1990-2000':4,
  '2000-2010':5,
  'all_time':6
}

// height of div :
var ratio_values = 500;
var h_graph = ratio_values + 150;
var h = ratio_values + 200;


// Create svg
var svg_main = d3.select("body")
.append("div")
.attr("class","container");

var g_graph = svg_main.append("svg")
// .attr("width", "70%")
.attr("width", "100%")
.attr("height", h)
.attr("id", "svg_main_tag_graph");

// var g_legend = svg_main.append("svg")
// .attr("width", "20%")
// .attr("height", h)
// .attr("id", "svg_main_tag_legend");

// Filenames for data
var filename = "data/stacked_plot_data.json";
var filename_color = "data/stacked_plot_legend.json";


// period index
var period_ind = 0;
// text xaxis height
var text_height = 30;



// Load data
d3.json(filename_color, function(color_error, color_json){


  if(color_error){
    console.log(color_error);
  }

// Get bounding box :
console.log(document.getElementById("svg_main_tag_graph").getBoundingClientRect().width)


  // convert to dictionary
  var color_data = color_json.features;
  var color_lookup = {}
  for(i = 0; i<color_data.length; i ++){
    tag = color_data[i].tag;
    color = color_data[i].color;
    color_lookup[tag] = color;
  }
  console.log(color_lookup);

  // Load data for stacked plot
  d3.json(filename, function(main_tag_error, main_tag_json){
    if(main_tag_error){
      console.log(main_tag_error);
    }

    // Bar properties

    data_stacked = main_tag_json.features;
    console.log("data_stacked length : " + data_stacked.length);
    // console.log(data_stacked);
    // var  svg_width = d3.select("body").select("svg").nodes()[0].width.baseVal.value;
      var svg_width = Math.floor(document.getElementById("svg_main_tag_graph").getBoundingClientRect().width);


    // console.log(d3.select("#svg_main_tag_legend").node().width.baseVal.value);
    // var legend_width = d3.select("#svg_main_tag_legend").node().width.baseVal.value;


    var bar_width = svg_width / (period_array.length+1);
    // var legend_text_height = 15;
    // var legend_square_size = legend_width / 2;

    var x = [];
    for(i = 0; i<period_array.length; i ++)
    {
      x[i] = i*(bar_width + 10) + 5;
    }
    var bottom_value = 0;

// Create graph columns
    var graph_select = g_graph.selectAll("g")
    .data(data_stacked)
    .enter()
    .append("g")
    .sort(function(a,b){
      compareStrings(a.period, b.period);
    })
    .attr("transform", function(d,i){
      // Reinit bottom value
      return  "translate(" + x[period_order[d.period]] + ",0)";
    })

// Graph x ticks
    graph_select.append("text")
    .text(function(d){
      console.log(d.period);
      return d.period;
    })
    .attr("y", h-15)
    .attr("x", 10)
    .style("font-weight", "bold")
    .style("font-size", bar_width / 100 + "em")
    .attr("class", "xaxis");

// Graph bars
    graph_select.selectAll("rect")
    .data(function(d){
      console.log(d);
      return d.period_data;})
    .enter()
    .append("rect")
    .attr("y", function(d,i){
      // console.log(d);
      if(i == 0){
        bottom_value = 0;
      }
      // bottom_value_prev = bottom_value;
      bottom_value += Math.floor(d.value*ratio_values) + 2;
      return h_graph - bottom_value;
    })
    .attr("height", function(d){
      return Math.floor(d.value*ratio_values);
    })
    .attr("width", bar_width)
    .style("fill",function(d){
      return color_lookup[d.tag];
    })

// Graph text
    graph_select.selectAll("text:not(.xaxis)")
    .data(function(d){
      return d.period_data;
    })
    .enter()
    .append("text")
    .attr("y", function(d,i){
      // console.log(d);
      if(i == 0){
        bottom_value = 0;
      }
      // bottom_value_prev = bottom_value;
      bottom_value += Math.floor(d.value*ratio_values) + 2 ;
      return h_graph - bottom_value + Math.floor(d.value*ratio_values/2);
    })
    .attr("x", 5)
    .text(function(d){
      return d.tag;
    })
    .style("fill", "#ffffff")
    .style("font-weight", "bold")
    // .style("width", 3*bar_width/4)
    .style("height", "auto")
    .style("word-wrap", "break-word")
    // .style("text-align", "center")
    .style("font-size", bar_width / 150 + "em");


// Legend
    // var legend = g_legend.selectAll("g")
    // .data(color_data)
    // .enter()
    // .append("g")
    // .attr("transform", function(d,i){
    //   return "translate(0," + i*legend_text_height + ")";
    // });
    //
    // legend.append("rect")
    // .attr("x", legend_width-legend_square_size)
    // .attr("width", legend_square_size)
    // .attr("height", legend_square_size)
    // .attr("fill", function(d){
    //   return d.color;
    // });
    //
    // legend.append("text")
    // // .attr("x", )
    // .attr("y", 10)
    // .attr("dy", "0.32em")
    // .style("font-weight", "bold")
    // .style("font-size", legend_width/200 + "em")
    // .text(function(d){
    //   return d.tag;
    // })

});
});

function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}
}
