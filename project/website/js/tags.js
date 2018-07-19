function create_tags_subtags_title(){
  var title_tags = d3.select("body").append("h1")
  .attr("class" , "titles")
  .text("Tags and Subtags");
}


function create_tags_subtags(){
var div_main = d3.select("body").append("div")
.attr("id", "div_main")
.attr("class", "container")

var div_tags = d3.select("#div_main").append("div")
.attr("id", "div_tags")
.attr("class", "row tags");

d3.select("#div_main").append("p");

var div_subtags = d3.select("#div_main").append("div")
.attr("id", "div_subtags")
.attr("class", "row subtags");


var filename = "data/tags/data_tags.json";

var tag_selected_bool = 0;
var tag_selected = 0;


d3.json(filename, function(errortags, tags_data){
  if(errortags){
    console.log(errortags);
  }


  div_tags.selectAll("div")
  .data(tags_data.features)
  .enter()
  .append("div")
  .attr("class", "tag")
  .text(function(d){
    return d.tag;
  })
  .sort(function(a,b){
    return compareStrings(a.tag, b.tag);
  })
  .on("click",function(d){
    tag_selected_bool = 1;
    tag_selected = d;

    div_tags.selectAll("div")
    .style("background-color", null);

    // this.setAttribute("class", "tag_selected");
    // this.style.backgroundColor = "#EA8C55";
    this.style.backgroundColor = "#87ADFF";

    div_subtags.selectAll("div").remove("*");
    for(i=0; i<d.associated.length; i++){
      var subtag = d.associated[i];
      div_subtags.append("div")
      .attr("class", "subtag")
      .text(subtag);
    };
  })
  .on("mouseover", function(d){
    div_subtags.selectAll("div").remove("*");
    for(i=0; i<d.associated.length; i++){
      var subtag = d.associated[i];
      div_subtags.append("div")
      .attr("class", "subtag")
      .text(subtag);
    };
  })
  .on("mouseout",function(){
    if(tag_selected_bool){
      div_subtags.selectAll("div").remove("*");
      for(i=0; i<tag_selected.associated.length; i++){
        var subtag = tag_selected.associated[i];
        div_subtags.append("div")
        .attr("class", "subtag")
        .text(subtag);
      };
    }
  });

  function compareStrings(a, b) {
    // Assuming you want case-insensitive comparison
    a = a.toLowerCase();
    b = b.toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
  }




});
}
