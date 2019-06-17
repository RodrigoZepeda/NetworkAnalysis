//Variables
var circlefact = 5;
var strength = -200;

// set the dimensions and margins of the graph
var outercolor = "blue";
var innercolor = "red";

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var padding = {top: 30, right: 30, bottom: 30, left: 30};

var innerWidth   = outerWidth  - margin.left  - margin.right,
    innerHeight  = outerHeight - margin.top   - margin.bottom,
    width        = innerWidth  - padding.left - padding.right,
    height       = innerHeight - padding.top  - padding.bottom,
    background   = false;

//Creation of canvas
var svg = d3.select('#my_dataviz').append('svg')
                .attr('width', outerWidth)
                .attr('height', outerHeight)
                .attr("fill", outercolor)

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var inner = svg.append('g')
            .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');


function zoomed() {
  inner.attr("transform", d3.event.transform);
}

inner.append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");


svg.call(d3.zoom().on("zoom", function () {
  inner.attr("transform", d3.event.transform)
}))


var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(strength))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("data.json", function(error, graph) {
  if (error) throw error;

  var link = inner.append("g")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return (d.colabs); })
      .style("stroke", "#999");

  var node = inner.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", function(d) {return  circlefact*Math.log(d.pubs + 2)})
      .style("fill", function(d) {return d.color})
      .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html("<b>" + d.name + "</b>"+ "<br/>"  + "<i>" + d.depto + "</i>" + "<br/>" + "Pubs " + d.pubs)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", d.color);
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        })
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.name; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }
});


function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
