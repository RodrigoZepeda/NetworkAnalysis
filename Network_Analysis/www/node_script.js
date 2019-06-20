//SEE
//https://gist.github.com/steveharoz/8c3e2524079a8c440df60c1ab72b5d03#file-code-js
//Variables
var circlefact = 10;
var strength   = 1000;
var outercolor = "#00003f";

Shiny.addCustomMessageHandler('force', function(myforce) {
    strength = myforce;
    updateAll();
});

Shiny.addCustomMessageHandler('scale', function(myscale) {
    circlefact = myscale;
    updateAll();
});


// set the dimensions and margins of the graph
var margin  = {top: 10, right: 10, bottom: 10, left: 10};
var padding = {top: 30, right: 30, bottom: 30, left: 30};

var innerWidth   = outerWidth  - margin.left  - margin.right,
    innerHeight  = outerHeight - margin.top   - margin.bottom,
    width        = innerWidth  - padding.left - padding.right,
    height       = innerHeight - padding.top  - padding.bottom;

//Creation of canvas
var svg = d3.select('#my_dataviz').append('svg')
                .attr('width', "100%")
                .attr('height', "100%")
                .attr("fill", outercolor);

//Tooltip for nodes
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Tooltip for lines
var div2 = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Function for zooming
var inner = svg.append('g')
            .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')');

svg.call(d3.zoom().on("zoom", function () {
  inner.attr("transform", d3.event.transform)
}))


// force simulator
var simulation = d3.forceSimulation();

// set up the simulation and event to update locations after each tick
function initializeSimulation() {
  simulation.nodes(graph.nodes);
  initializeForces();
  simulation.on("tick", ticked);
}

// add forces to the simulation
function initializeForces() {
    // add forces and associate each with a name
    simulation
        .force("link", d3.forceLink())
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    // apply properties to each of the forces
    updateForces();
}

// apply new force properties
function updateForces() {

    simulation.force("charge")
        .strength(-1*strength);
    simulation.force("link")
        .id(function(d) {return d.id;});

    simulation.alpha(1).restart();
}

// generate the svg objects and force simulation
function initializeDisplay() {

  link = inner.append("g")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return (d.colabs); })
      .style("stroke", "white")
      .on("mouseover", function(d) {
            div2.transition()
                .duration(200)
                .style("opacity", .9);
            div2.html("<b>Conexión</b>" + "<br/>" + d.sourcename + "<br/>" + d.targetname + "<br/><i>" + d.colabs + " publicaciones</i>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", "white");
            })
      .on("mouseout", function(d) {
          div2.transition()
              .duration(500)
              .style("opacity", 0);
            });

  node = inner.append("g")
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
            div	.html("<b>" + d.name + "</b>"+ "<br/>"  + "<i>" + d.depto + "</i>" + "<br/>" + "Publicaciones " + d.pubs)
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
}


d3.json("data1.json", function(error, _graph) {
  if (error) throw error;
  graph = _graph;
  initializeDisplay();
  initializeSimulation();

  simulation.force("link")
      .links(graph.links);
});

// update the display positions after each simulation tick
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

// update the display based on the forces (but not positions)
function updateDisplay() {
    node.attr("r", function(d) {return  circlefact*Math.log(d.pubs + 2)})
}


// convenience function to update everything (run after UI input)
function updateAll() {
    updateForces();
    updateDisplay();
}

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
