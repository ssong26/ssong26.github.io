// --- --- --- --- --- --- --- --- --- --- ---

// Initial Processing

let data_map = new Map();
let genre_key = [];
let data_max = {"Total_Number":0,"Total_Sale":0,"Best_Sale":0,"Sale_Per":0};

function PostProcessing(){
  // Group by Genre
  var GameByGenre = d3.group(raw_data,d => d.Genre);
  // Group by Publisher
  for (let [key, value] of GameByGenre) {
      genre_key.push(key);

      var ele = [];
      
      var GameByMaker = d3.group(value,d => d.Publisher);

      for (let [key_2, value_2] of GameByMaker) {
          
          var Total_Number = value_2.length;
          var Total_Sale = 0;
          var Best_Sale = 0;

            for (var i = 0; i < Total_Number; i++){
              Total_Sale = Total_Sale + parseFloat(value_2[i].Global_Sales);
              Best_Sale = Math.max(Best_Sale,parseFloat(value_2[i].Global_Sales));
            }
            var Sale_Per = Total_Sale/Total_Number;
            //
            data_max.Total_Number = Math.max(data_max.Total_Number, Total_Number);
            data_max.Total_Sale = Math.max(data_max.Total_Sale, Total_Sale);
            data_max.Best_Sale = Math.max(data_max.Best_Sale,Best_Sale);
            data_max.Sale_Per = Math.max(data_max.Sale_Per,Sale_Per);
            //

            ele.push({"Publisher":key_2,"Total_Number":Total_Number,"Total_Sale":Total_Sale,"Best_Sale":Best_Sale,"Sale_Per":Sale_Per});
      }
      data_map.set(key,ele)
  }
  // 
}

//
setTimeout(function(){
    PostProcessing();
},200);


//
x_text_dic = {"Total_Number":"The Sum of the Number of Games Sold by the given Publisher","Total_Sale":"The Sum of Global Sales by the given Publisher (in Millions)","Best_Sale":"The Highest Sale among all the game sold by the given Publisher (in Millions)","Sale_Per":"Average Sales per Game by the given Publisher (in Millions)"}
// --- --- --- --- --- --- --- --- --- --- ---

// Plot SVG image.

let svg_03 = d3.select("#graph3")
    .append("svg")
    .attr("width",width)   
    .attr("height",height)  
    .append("g")
    .attr("transform","translate("+margin.left + "," + margin.top + ")");   


let tooltip = d3.select("#graph3")  
        .append("div")
        .attr("class", "tooltip")
                .style("opacity", 0)

let x_03 = d3.scaleLinear()
    .range([0,width - margin.left - margin.right]);

let y_03 = d3.scaleBand()
    .range([0,height - margin.top - margin.bottom])

var boxWidth = (height - margin.top - margin.bottom)/12 /2;

let countRef_03 = svg_03.append("g");
let y_axis_label_03 = svg_03.append("g");

let x_axis_label_03 = svg_03.append("text")
    .attr("transform", "translate("+((width - margin.left - margin.right)/2)+","+ (height - margin.bottom - 20) + ")")     
    .style("text-anchor", "middle")
    .style("font-size", 12);

svg_03.append("text")
    .attr("transform", "translate("+(0.0)+","+ (0.0) + ")")      
    .style("text-anchor", "middle")
    .style("font-size",14)
    .text("Genre");

let y_axis_text_03 = svg_03.append("text")
    .attr("transform", "translate("+(0.0)+","+ ((height-margin.top-margin.bottom)/2) + ")")   
    .style("text-anchor", "middle");


let title_03 = svg_03.append("text")
    .attr("transform", "translate("+((width - margin.left - margin.right)/2)+","+ 0.0 + ")")   
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Top Publisher for Each Genre");
//
var data_map_temp = new Map();
//
sumstat = [];
//
function setGraph03(standard_name){
  //
  let color = d3.scaleOrdinal()
    .domain(genre_key)
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"),12));
  //
  // 
  x_axis_label_03.text(x_text_dic[standard_name]);
  //
  cleanData3(standard_name);
  //
  set_sumstat(standard_name);
  //
  sumstat02 = sumstat;
  //
    x_03.domain([0,data_max[standard_name]]);
    y_03.domain(genre_key).paddingInner(1).paddingOuter(.5);
    
    // rectangle for the main box
  let boxdata = svg_03.selectAll("rect").data(sumstat);
  
    boxdata.enter()
        .append("rect")
        .merge(boxdata)
        .attr("fill",function(d) { return color(d.key) })
        .transition()
        .duration(1000)
        .attr("x", function(d){return(x_03(d.value.q1))})
        .attr("y", function(d){return(y_03(d.key) - boxWidth/2)})
        .attr("height", boxWidth)
        .attr("width", function(d){return(x_03(d.value.interQuantileRange))})
        .attr("stroke", "black")
    //
    //
    let vertLines_01 = svg_03.selectAll(".MinMax_Line").data(sumstat);   
    let vertLines_02 = svg_03.selectAll(".Median_Line").data(sumstat);
    //
    y_axis_label_03.call(d3.axisLeft(y_03)).style("font-size",12)
     
    vertLines_01.enter().append("line").attr("class","MinMax_Line")
      .merge(vertLines_01)
      .transition()
      .duration(1000)
      .attr("x1", function(d){return(x_03(d.value.min))})
      .attr("x2", function(d){return(x_03(d.value.max))})
      .attr("y1", function(d){return(y_03(d.key))})
      .attr("y2", function(d){return(y_03(d.key))})
      .attr("stroke", "black")
      .style("width", 1)
  //
  // Show the median
  vertLines_02.enter().append("line").attr("class","Median_Line")
      .merge(vertLines_02)
      .transition()
      .duration(1000)
      .attr("x1", function(d){return(x_03(d.value.median)) })
      .attr("x2", function(d){return(x_03(d.value.median)) })
      .attr("y1", function(d){return(y_03(d.key)-boxWidth/2)})
      .attr("y2", function(d){return(y_03(d.key)+boxWidth/2)})
      .attr("stroke", "black")
      .style("width", 1)


//
        let color_mouse = d3.scaleOrdinal()
            .domain(genre_key)
            .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#ff5c7a"), genre_key.length));

//



// Add individual points with jitter
for (let [key, value] of data_map_temp){
  //
          let counts = countRef_03.selectAll(".text" + key).data(value);
          counts.enter()
          .append("text")
          .attr("class","text" + key)
          .merge(counts)
          .transition()
          .duration(1000)
          .attr("x", x_03(value[0][standard_name]))        // HINT: Add a small offset to the right edge of the bar, found by x(d.count)
          .attr("y", y_03(key) + boxWidth/1)        // HINT: Add a small offset to the top edge of the bar, found by y(d.artist)
          .style("text-anchor", "middle")
          .style("font-size", 13)
          //.style("fill",color(key))
          .text(value[0].Publisher);  

          //console.log(value[0].Publisher);
  //
            let mouseover = function(d) {
            let color_span = `<span style="color: ${color_mouse(key)};">`;
            let html = `${d.Publisher}<br/>
                    ${standard_name}: ${color_span}${d[standard_name]}</span>`;       // HINT: Display the song here
            // Show the tooltip and set the position relative to the event X and Y location
            //console.log(html);
            //console.log();
            tooltip.html(html)
                .style("left", `${(x_03(d[standard_name]) + margin.left)}px`)
                .style("top", `${(y_03(key) + margin.top)}px`)
                .style("box-shadow", `2px 2px 5px`)    // OPTIONAL for students
                .transition()
                .duration(200)
                .style("opacity", 0.9)
        };

        // Mouseout function to hide the tool on exit
        let mouseout = function(d) {
            // Set opacity back to 0 to hide
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.0);
        };
  //
  var point_temp = svg_03.selectAll(".indPoints" + key).data(value);
  point_temp.enter()
  .append("circle")
  .attr("class","indPoints" + key)
  //.transition().delay(function(d, i) { return(i*3) }).duration(1000)
  .merge(point_temp)
  //
      .attr("cy", function(d){return(y_03(key) - boxWidth/2 + Math.random()*boxWidth )})
    .attr("cx", function(d){return(x_03(d[standard_name]))})
    .attr("r",4)
    .style("fill", color_mouse(key))
    .attr("stroke", "black") 
    .on("mouseover", mouseover).on("mouseout", mouseout)
    //.transition().delay(function(d, i) { return(i*3) }).duration(1000);

}
//
    boxdata.exit().remove();
    vertLines_01.exit().remove();
    vertLines_02.exit().remove();
      for (let [key, value] of data_map_temp){
  svg_03
  .selectAll(".indPoints" + key)
  .data(value)
  .exit().remove();

  svg_03.selectAll(".text" + key)
  .data(value)
  .exit().remove();
}
}

//
function cleanData3(inp){
  data_map_temp.clear();
  for (let [key, value] of data_map){
      data_map_temp.set(key,value.sort((data_1,data_2)=>data_2[inp] - data_1[inp])
      .slice(0,10));
  }
}
//
function set_sumstat(inp){
  //
  sumstat = [];
  for (let [key, value] of data_map_temp) {
      var q0 = 0;
      var q1 = 0;
      var q2 = 0;
      var q3 = 0;
      var q4 = 0;
      var interQuantileRange = 0;
      var temp_list = [];
      for (var i = 0; i < value.length; i++){
          temp_list.push(value[i][inp]);
      }
      temp_list.sort((a,b)=>a-b);
      q0 = temp_list[0];
      q1 = temp_list[Math.max(Math.round(1*value.length/4) - 1,0)];
      q2 = temp_list[Math.max(Math.round(2*value.length/4) - 1,0)];
      q3 = temp_list[Math.max(Math.round(3*value.length/4) - 1,0)];
      q4 = temp_list[value.length-1];

      interQuantileRange = q3 - q1;
      sumstat.push({"key":key,"value":{"min":q0,"q1":q1,"median":q2,"q3":q3,"max":q4,"interQuantileRange":interQuantileRange}});
  }
}

setTimeout(function(){
    setGraph03("Total_Sale");

},300);