
//
//
region_list = ["NA_Sales","EU_Sales","JP_Sales","Other_Sales","Global_Sales"];
//
data02_map = new Map();
data03_map = new Map();

setTimeout(function(){
  cleanData02();

// The svg
var svg02 = d3.select("#graph2").append("svg").attr("width",width).attr("height",height)    .append("g")
    .attr("transform","translate("+margin.left/4 + "," + margin.top + ")");    // HINT: transform
//
let tooltip = d3.select("#graph2")     // HINT: div id for div containing scatterplot
        .append("div")
        .attr("class", "tooltip")
                .style("opacity", 0)
// Map and projection
var projection = d3.geoMercator()
    .center([0,0])                // GPS of location to zoom on
    .scale(100.0)                       // This is like the zoom
    //.translate([ -width/2, -height/2 ])

//
let mouseover02 = function(d) {
let color_span = `<span style="color: "#bf3caf";">`;
let html = `Region: ${region_dic[d.name]}<br/></span>Polular Genre: ${data03_map.get(d.name).max_kind}<br/></span>Sales of all genre: ${data03_map.get(d.name).sum_value}<br/></span>Sales of the Polular genre: ${data03_map.get(d.name).max_value}<br/></span>`;       // HINT: Display the song here
// Show the tooltip and set the position relative to the event X and Y location
//console.log(html);
//console.log();
tooltip.html(html)
    .style("left",`100px`)
    .style("top", `100px`)
    .style("box-shadow", `2px 2px 5px`)    // OPTIONAL for students
    .transition()
    .duration(1000)
    .style("opacity", 0.9)
};

// Mouseout function to hide the tool on exit
let mouseout02 = function(d) {
// Set opacity back to 0 to hide
tooltip.transition()
    .duration(200)
    .style("opacity", 0.4);
};


// Create data for circles:
var markers = [
  {lat: 51.5074, long: -0.1278, name:"EU_Sales"}, // London
  {lat: 38.9072, long: -77.0369, name:"NA_Sales"}, // Washington
  {lat: 35.6804, long: 139.7690 , name:"JP_Sales"}, // Japan
  {lat: -18.7669, long: 75.8691, name:"Other_Sales"}, // Russia
  //  {lat: 0, long: -180, name:"Global_Sales"}
  ];
var region_dic = {
    "EU_Sales":"Europe",
    "NA_Sales":"North America",
    "JP_Sales":"Japan",
    "Other_Sales":"Other Regions"
}
//
var size_all = d3.scaleLinear().domain([0,Math.sqrt(data03_map.get("Global_Sales").sum_value)]).range([0, 60])  // Size in pixel
    svg02
      .selectAll("OuterCircle")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size_all(Math.sqrt(data03_map.get(d.name).sum_value))})
        .attr("stroke", "#1a1a1a")
        .attr("fill", "#ffffff")
        //.attr("stroke-width", 3)
        .attr("fill-opacity", .4) 

//
//var size02 = d3.scaleLinear().domain([0,1]).range([0.1, 100])  // Size in pixel
var color02 = d3.scaleOrdinal().domain(genre_key).range(["#6e40aa","#bf3caf","#fe4b83","#ff7847","#e2b72f","#aff05b","#52f667","#1ddfa3","#23abd8","#4c6edb","#6e40aa","#1a1a1a"]);
// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then (function(data){
    // Filter data
    //data.features = data.features.filter( function(d){return d.properties.name=="France"} )

    // Draw the map
    svg02.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
          .attr("fill", "#b8b8b8")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "black")
        .style("opacity", .3)
// Add Text

});
    // Add circles:
    svg02
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r", function(d){ return size_all(Math.sqrt(data03_map.get(d.name).max_value))})
        .style("fill", function(d){ return color02(data03_map.get(d.name).max_kind) })
        .attr("stroke", "#69b3a2")
        //.attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover02).on("mouseout", mouseout02);
    // Add Context:
    svg02
      .selectAll("region_label")
      .data(markers)
      .enter()
      .append("text")
      .attr("x", function(d){ return projection([d.long, d.lat])[0] })     
        .attr("y", function(d){ return projection([d.long, d.lat])[1] - size_all(Math.sqrt(data03_map.get(d.name).sum_value)) - 5 })  
        .style("text-anchor", "middle")
        .style("font-size","12px")
        .text(function(d) {return region_dic[d.name] + ": " + data03_map.get(d.name).max_kind;
        })

},300);

function cleanData02(){
     sale_max = 0;
     data02_map.clear();
     data03_map.clear();

    //var GameByGenre = d3.groups(raw_data,d => d.Genre);
    for (let i = 0; i < region_list.length; i++){
      var temp = d3.rollup(raw_data, v => d3.sum(v, d => d[region_list[i]]), d => d.Genre)
      data02_map.set(region_list[i],temp);
      //
      let sum_value = 0;
      let max_value = 0;
      let max_kind = "";
      for (let j = 0; j < genre_key.length; j++){
          sum_value = sum_value + temp.get(genre_key[j]);
          if (max_value <= temp.get(genre_key[j])){
              max_value = temp.get(genre_key[j])
              max_kind = genre_key[j]
          }
      }
      data03_map.set(region_list[i],{"sum_value":sum_value,"max_value":max_value,"max_kind":max_kind,"ratio":max_value/sum_value})
    }
    console.log(data02_map);
    console.log(data03_map);
    //
}

