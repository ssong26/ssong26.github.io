// TODO: Set up SVG object with width, height and margin
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width",width)     // HINT: width
    .attr("height",height)     // HINT: height
    .append("g")
    .attr("transform","translate("+margin.left + "," + margin.top + ")");    // HINT: transform

// TODO: Create a linear scale for the x axis (number of occurrences)
let x = d3.scaleLinear()
    .range([0,width - margin.left - margin.right]);

// TODO: Create a scale band for the y axis (artist)
let y = d3.scaleBand()
    .range([0,height - margin.top - margin.bottom])
    .padding(0.5);  // Improves readability

// Set up reference to count SVG group

let countRef = svg.append("g");

// Set up reference to y axis label to update text in setData
let y_axis_label = svg.append("g");

// TODO: Add x-axis label
svg.append("text")
    .attr("transform", "translate("+((width - margin.left - margin.right)/2)+","+ (height - margin.top - margin.bottom) + ")")        // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .text("Global_Sales (in millions)")
    .style("font-size", 14);
//
svg.append("text")
    .attr("transform", "translate("+(-20.0)+","+ (0.0) + ")")        // HINT: Place this at the bottom middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 14)
    .text("Name");
    

// TODO: Add chart title
let title = svg.append("text")
    .attr("transform", "translate("+((width - margin.left - margin.right)/2)+","+ 0.0 + ")")        // HINT: Place this at the top middle edge of the graph
    .style("text-anchor", "middle")
    .style("font-size", 15);

function setGraph01(inp_year) {
    // TODO: Clean and strip desired amount of data for barplot
    data = cleanData(raw_data,(data_1,data_2)=>parseFloat(data_2["Global_Sales"]) - parseFloat(data_1["Global_Sales"]),numExamples,inp_year);

    // TODO: Update the y axis domains with the desired attribute
    x.domain([0,d3.max(data,function(d) { return parseFloat(d["Global_Sales"]);})]);
    y.domain(data.map(function(d) { return d["Name"];}));


    let bars = svg.selectAll("rect").data(data);

    let color = d3.scaleOrdinal()
    .domain(data.map(function(d) { return d["Name"] }))
    .range(d3.quantize(d3.interpolateHcl("#66a0e2", "#81c2c3"),numExamples));
     // 
    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill",function(d) { return color(d['Name']) })
        .transition()
        .duration(1000)
        .attr("x", x(0))
        .attr("y", function(d) { return y(d["Name"]);})               
        .attr("width", function(d) { return x(parseFloat(d["Global_Sales"]));})
        .attr("height",y.bandwidth());        


    let counts = countRef.selectAll("text").data(data);

    let x_offset = 10;
    let y_offset = 12;

    counts.enter()
        .append("text")
        .merge(counts)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(parseFloat(d["Global_Sales"])) + x_offset;})        
        .attr("y", function(d) { return y(d["Name"]) + y_offset;})        
        .style("text-anchor", "start")
        .style("font-size","12px")
        .text(function(d) { return d['Global_Sales'];}); 
    //
    let graph01_game_name = y_axis_label.selectAll("text").data(data);
    graph01_game_name.enter()
        .append("text")
        .merge(graph01_game_name)
        .transition()
        .duration(1000)
        .attr("x", function(d) { return x(0) - x_offset;})     
        .attr("y", function(d) { return y(d["Name"]) + y.bandwidth()/2;})  
        .style("text-anchor", "end")
        .style("font-size","12px")
        .text(function(d) { 
            console.log(d["Name"].length);
            if (d["Name"].length > 40){
                return d["Name"].slice(0,40) + "...";
            }
            else
            {
                return d["Name"] ;
            }
        
        });      

    //
    title.text("Top Game in Year: " + inp_year);

    bars.exit().remove();
    counts.exit().remove();
    graph01_game_name.exit().remove();
};

function cleanData(inp_data, comparator, numExamples, inp_year) {
    if (inp_year == "all"){
        return inp_data.sort(comparator).slice(0,numExamples);
    }
    else{
        return inp_data.filter(function(d){ return d.Year == inp_year}).sort(comparator).slice(0,numExamples);
    }
};

setTimeout(function(){
    setGraph01("all");
},200);