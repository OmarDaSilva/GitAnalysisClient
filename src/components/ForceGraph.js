import * as d3 from "d3"
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/force-directed-graph
export default function ForceGraph({
    nodes, // an iterable of node objects (typically [{id}, …])
    links // an iterable of link objects (typically [{source, target}, …])
  }, {
    nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
    nodeColour = d => d.colour,
    nodeName = d => d.name, // given d in nodes, returns a colour identifier
    nodeGroup, // given d in nodes, returns an (ordinal) value for color
    nodeGroups, // an array of ordinal values representing the node groups
    nodeTitle, // given d in nodes, a title string
    nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
    nodeStroke = "#fff", // node stroke color
    nodeStrokeWidth = 3, // node stroke width, in pixels
    nodeStrokeOpacity = 2, // node stroke opacity
    nodeRadius = 15, // node radius, in pixels
    nodeStrength,
    linkSource = ({source}) => source, // given d in links, returns a node identifier string
    linkTarget = ({target}) => target, // given d in links, returns a node identifier string
    linkStroke = "#999", // link stroke color
    linkStrokeOpacity = 0.6, // link stroke opacity
    linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
    linkStrokeLinecap = "round", // link stroke linecap
    linkStrength,
    colors = d3.schemeTableau10, // an array of color strings, for the node groups
    width = 1000, // outer width, in pixels
    height = 600, // outer height, in pixels
    invalidation // when this promise resolves, stop the simulation
  } = {}) {
    // Compute values.
    const N = d3.map(nodes, nodeId).map(intern);
    const NN = d3.map(nodes, nodeName).map(intern);
    const NC = d3.map(nodes, nodeColour).map(intern);
    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    if (nodeTitle === undefined) nodeTitle = (_, i) => NN[i];
    const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
    const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
    const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);
  
    // Replace the input nodes and links with mutable objects for the simulation.
    nodes = d3.map(nodes, (_, i) => ({id: N[i], colour: NC[i], name: NN[i], fixed: false}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));
  
    // Compute default domains.
    if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);
  
    // Construct the scales.
    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    
    /*
      Define node colors:
      Dark blue - Directories
      Light blue - files
      Grey - contributors
    */ 
    // const colourScale = d3.scaleOrdinal()
    // .domain(['darkblue', 'lightblue', 'grey', 'red'])
    // .range(['#0529f5', '#059df5', '#505457', '#FF0000'])

    const colourScale = d3.scaleOrdinal()
    .domain([
        'Orange', 'LimeGreen', 'HotPink', 'BlueViolet', 
        'Aqua', 'Gold', 'Chocolate', 'GreenYellow', 'OrangeRed', 
        'MediumOrchid', 'Black', 'Red', 'DarkBlue', 'Grey'
    ])
    .range([
      '#FFA500', '#32CD32', '#FF69B4', '#8A2BE2', '#00FFFF', 
      '#FFD700', '#D2691E', '#ADFF2F', '#FF4500', '#BA55D3',
      '#000000', '#FF0000', '#00008B', '#808080'
    ]);
  
    // Construct the forces.

    const forceNode = d3.forceManyBody().strength(-150);
    const forceLink = d3.forceLink(links).id(({index: i}) => N[i]).distance(100);
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);
    
    const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: 100%; height: intrinsic;");

    svg.property("currentScale", 1);

    
      const simulation = d3.forceSimulation(nodes)
          .force("link", forceLink)
          .force("charge", forceNode)
          .force("center",  d3.forceCenter())
          // .alphaDecay(0.05) // Increase alpha decay (default is 0.0228)
          .velocityDecay(0.5)
          .on("tick", ticked);

    const g = svg.append("g")

    
    const link =  g.append("g")
        .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
        .attr("stroke-linecap", linkStrokeLinecap)
      .selectAll("line")
      .data(links)
      .join("line");
  
    const node = g.append("g")
        // .attr("fill", d => colourScale(d.colour))
        .attr("stroke", nodeStroke)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-width", nodeStrokeWidth)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("r", d => d.name === "root" ? 30 : d.colour === "DarkBlue" ? 25 : nodeRadius)
        .attr("fill", d => colourScale(d.colour))
        .call(drag(simulation));
  


    const zoom = d3.zoom()
    .scaleExtent([0.1, 10]) // This determines the min and max zoom scale
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
        svg.property("currentScale", event.transform.k);
    });

    svg.call(zoom);


      
    if (W) link.attr("stroke-width", ({index: i}) => W[i]);
    if (L) link.attr("stroke", ({index: i}) => L[i]);
    // if (G) node.attr("fill", ({index: i}) => color(G[i])); // This assigns the node group colours
    if (T) node.append("title").text(({index: i}) => T[i]);
    if (invalidation != null) invalidation.then(() => simulation.stop());

    let targetNodeName, targetNodeElement, originalRadius, originalColor;

    window.addEventListener("scrollToNode", (event) => {
      targetNodeName = event.detail.nodeName;
      targetNodeElement = node.filter(d => d.name === targetNodeName);
      originalRadius = targetNodeElement.attr("r");
      originalColor = targetNodeElement.attr("fill");
    
      highlightNode(targetNodeElement);
    
      const targetZoomLevel = 2;
    
      svg.transition()
        .duration(1000)
        .call(zoom.scaleTo, targetZoomLevel)
        .on("end", () => {
          scrollToTargetNode();
        });
    });
    

    function scrollToTargetNode() {
      if (targetNodeName) {
        const targetNode = nodes.find(d => d.name === targetNodeName);
        const targetX = targetNode.x;
        const targetY = targetNode.y;
    
        svg.transition()
          .duration(1000)
          .call(
            zoom.transform,
            d3.zoomIdentity.translate(
              targetX,
              targetY
            )
          )
          .on("end", () => {
            resetNodeAppearance(targetNodeElement, originalRadius, originalColor);
            targetNodeName = null;
          });
      }
    }
    
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

    function highlightNode(node) {
      node
        .attr("r", d => d.name === "root" ? 30 : d.colour === "DarkBlue" ? 25 : nodeRadius * 1.5)
        .attr("stroke-width", nodeStrokeWidth * 2);
    }
    
    function resetNodeAppearance(nodeElement, originalRadius, originalColor) {
      setTimeout(() => {
        nodeElement
          .attr("r", originalRadius) // Reset the size of the node
          .attr("fill", originalColor) // Reset the color of the node
          .attr("stroke-width", nodeStrokeWidth)
      }, 3000); // Duration in milliseconds before resetting the appearance
    }
  
    function intern(value) {
      return value !== null && typeof value === "object" ? value.valueOf() : value;
    }
  
    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
  
    function drag(simulation) {    
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.5).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        if (d.fixed) {
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        } else {
            event.subject.fx = null;
            event.subject.fy = null;
        }
    }
      
      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    node.on("click", (event, d) => {
      d.fixed = !d.fixed; // Toggle the fixed attribute
      if (d.fixed) {
          d.fx = d.x;
          d.fy = d.y;
      } else {
          d.fx = null;
          d.fy = null;
      }
  });
  
    return Object.assign(svg.node(), {scales: {color}});
  }

  