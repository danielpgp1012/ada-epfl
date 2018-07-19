function create_top_artists_full_title(){
  var title_tags = d3.select("body").append("h1")
  .attr("class" , "titles")
  .text("Main artists by tag on the full dataset");
}

function create_top_artists_full(){

var w = 1200;
var h = 900;

// var period_array = ['1920', '1950', '1970', '1980', '1990', '2000'];
var period_array = [
 '1920 - 1950',
 '1950 - 1970',
 '1970 - 1980',
 '1980 - 1990',
 '1990 - 2000',
 '2000 - 2010'
]


var div_main = d3.select("body").append("div")
.attr("id", "div_main_top_artists_full")
.attr("class", "container")

var div_tags = d3.select("#div_main_top_artists_full").append("div")
.attr("id", "div_tags_top_artists_full")
.attr("class", "row tags");

var div_artists = d3.select("#div_main_top_artists_full").append("div")
.attr("id", "main_artists_full")
.attr("class", "row artists_full");

var period_div = [];
for( i = 0; i<period_array.length; i++){
  period_div[i] = d3.select('#main_artists_full').append("div")
  .attr("id", "p_full_"+period_array[i].substring(0,4))
  .attr("class", "column")
  .style("width", 90/period_array.length + "%")
  .append("div")
  .attr("class", "column-title")
  .append("h1")
  .text(period_array[i]);
}



var filename = "data/top_artists/top_artists_tag_period_artist.json";

var tag_selected_bool = 0;
var tag_selected = 0;


d3.json(filename, function(errortop, top_artist_data){
  if(errortop){
    console.log(errortop);
  }

  div_tags.selectAll("div")
  .data(top_artist_data.children)
  .enter()
  .append("div")
  .attr("class", "tag")
  .text(function(d){
    return d.name;
  })
  .sort(function(a,b){
    return compareStrings(a.name, b.name);
  })
  .on("click",function(d){
    tag_selected_bool = 1;
    tag_selected = d;

    div_tags.selectAll("div")
    .style("background-color", null);

    // this.style.backgroundColor = "#EA8C55";
    this.style.backgroundColor = "#87ADFF";


    cleanPeriod();
    for(i=0; i<d.children.length; i++){
      var period_name = d.children[i].name;
      period_id = "#p_full_" + period_name.substring(0,4);
      d3.select(period_id).selectAll("div:not(.column-title)")
      .data(d.children[i].children)
      .enter()
      .append("div")
      .attr("class", "top_artist")
      .text(function(d2){
        return d2.name;
      })
    };
  })
  .on("mouseover", function(d){

    cleanPeriod();
    for(i=0; i<d.children.length; i++){
      var period_name = d.children[i].name;
      period_id = "#p_full_" + period_name.substring(0,4);
      d3.select(period_id).selectAll("div:not(.column-title)")
      .data(d.children[i].children)
      .enter()
      .append("div")
      .attr("class", "top_artist")
      .text(function(d2){
        return d2.name;
      })
    };
  })
  .on("mouseout",function(){
    cleanPeriod();
    if(tag_selected_bool){
      for(i=0; i<tag_selected.children.length; i++){
        var period_name = tag_selected.children[i].name;
        period_id = "#p_full_" + period_name.substring(0,4);
        d3.select(period_id).selectAll("div:not(.column-title)")
        .data(tag_selected.children[i].children)
        .enter()
        .append("div")
        .attr("class", "top_artist")
        .text(function(d2){
          return d2.name;
        })
      };
    }
  });
});


function compareStrings(a, b) {
  // Assuming you want case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  return (a < b) ? -1 : (a > b) ? 1 : 0;
}
// Remove all artist related to period
function cleanPeriod(){
  for( i = 0; i<period_div.length; i++){
    d3.select("#p_full_"+period_array[i].substring(0,4)).selectAll("div:not(.column-title)").remove("*");;
  }

}
// get artist filename
function artist_file(artist_name){
  var result = artist_name.replace(".", "");
  result = result.replace("/", "");
  result = result.split(" ").join("_");
  return result;
}
}
