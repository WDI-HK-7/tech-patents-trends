$(document).ready(function(){
  console.log("Works!")

  // Various accessors that specify the four dimensions of data to visualize.
  function x(d) { return d.employees };
  function y(d) { return d.patents };
  function radius(d) { return d.engineers };
  function color(d) { return d.region };

  // Chart dimensions.
  var margin = {top: 45.5, right:40.5, bottom: 30.5, left: 42.5},
      width = 960 - margin.right,
      height = 500;

  //Scale of radius
  var radiusScale = d3.scale.sqrt().domain([10, 22520]).range([5, 30]),
    colorScale = d3.scale.category10();

  // Various scales. These domains make assumptions of data, naturally.
  var xScale = d3.scale.linear().domain([40, 130000]).range([0, width]),
    yScale = d3.scale.linear().domain([0, 2100]).range([height, 0]);

  // The x & y axes.
  var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")).tickSize(1),
    yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(12, d3.format(",d")).tickSize(1);  

  // Create the SVG container and set the origin.
  var svg = d3.select("#charts").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add the x-axis.
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the y-axis.
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  // Add an x-axis label.
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height - 6)
    .text("total number of employees");

  // Add a y-axis label.
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("total number of patent per year");

  //on hover over on the bar, the year increases by increment from 2002 to 2014; 
  var year = 2014

  var dot;

  // $('#submit').click(function(){
  //   // $('#charts').html('');
  //   // $('g').remove();
  //   $('circle').remove();
  //   $('text').remove();
  //   var year = $('#year').val();
  //   console.log(year);
  //   // rendering data in json
  //   d3.json("/companies?year=" + year, function(company_data){
  //     // console.log(company_data);
  //     dot_and_axes(company_data);

  //     //closing companies.json
  //   });
  //   $('#year').val('');
  // });
  
  d3.json("/companies?year=" + year, function(company_data){
      // console.log(company_data);
      createDot(company_data);

      //closing companies.json
  });
  //function that gets called upon every time the year variable changes
  function createDot(yearly_company_data){
    // console.log(yearly_company_data);
    svg.selectAll("circle").remove();

    // Add a dot per nation. Initialize the data at 2002, and set the colors.
    dot = svg.append("g")
        .attr("class", "dots")
      .selectAll(".dot")       
        .data(interpolateData(yearly_company_data)) //picking up because it shows 5 dots but can't put two sets of data because they will overwrite each other. 
      .enter().append("circle")
        .attr("class", "dot")
        .style("fill", function(d) { return colorScale(color(d)); })
        .call(position)
        //shows name of company upon hover over
        .on('mouseover', function(d) {
          d3.select(this.parentElement).select('title').style('opacity', 1)
        });

    // Add a title to each dot.
    dot.append("title")
      .text(function(d) { return d.name });

  };

  //plot the dots based on position of the data and radius according to engineers_num
  function position(dot) {
    dot.attr("cx", function(d) {
      // console.log (x(d));
      return xScale(x(d));
    })
    .attr("cy", function(d) {
      // console.log(y(d));
      return yScale(y(d));
    })
    .attr("r", function(d) {
      // console.log(radiusScale(radius(d)));
      return radiusScale(radius(d));
    });
  };    
  
  animation();

  function animation () {
    // Add the year label; the value is set on transition.
    var label = svg.append("text")
      .attr("class", "year label")
      .attr("text-anchor", "end")
      .attr("y", height - 24)
      .attr("x", width) // picked up from global variable width 
      .text(2002);

    // Add an overlay for the year label.
    var box = label.node().getBBox();

    var overlay = svg.append("rect")
          .attr("class", "overlay")
          .attr("x", box.x)
          .attr("y", box.y)
          .attr("width", box.width)
          .attr("height", box.height)
          .on("mouseover", enableInteraction);
          // console.log(box.x, box.width);

    // Start a transition that interpolates the data based on year.
    svg.transition()
        .duration(30000)
        .ease("linear")
        .tween("year", tweenYear)
        .each("end", enableInteraction);
    
    // After the transition finishes, you can mouseover to change the year.
    function enableInteraction() {
      var yearScale = d3.scale.linear()
          .domain([2002, 2014])
          .range([box.x + 420, box.x + 20])
          .clamp(true);
          console.log("box works");
    
      // Cancel the current transition, if any.
      svg.transition().duration(0);

      overlay
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .on("mousemove", mousemove)
          .on("touchmove", mousemove);

      function mouseover() {
        label.classed("active", true);
      };

      function mouseout() {
        label.classed("active", false);
      };

      //unseen changing what label year changes 
      function mousemove() {
        // d3.interpolateNumber(2012, 2014);
        var rounded_year = d3.round( yearScale.invert(d3.mouse(this)[0]) )
        // (this) refers to .attr(rect), .class(overlay)
        //d3.mouse(countainer) => returns the [x,y] coordinates as an array 
        //.invert() => returns the input domain x for the corresponding value in the output range y. 
        console.log(rounded_year);
        label.text(rounded_year); 
        displayYear(rounded_year);
      };
    };

    // Tweens the entire chart by first tweening the year, and then the data.
    // For the interpolated data, the dots and label are redrawn.
    function tweenYear() {
      var year = d3.interpolateRound(2012, 2014); //target the year => works but runs 1800+ times from 2012-2014
      // return function(t) {console.log(year(t))};
      // return displayYear(year); //send year to displayYear function 
    //   };
    }

    // Updates the display to show the specified year.
    function displayYear(year) {
      // console.log("/companies?year=" + year)
      d3.json("/companies?year=" + year, function(company_data){
        console.log(company_data);
        dot.data(interpolateData(company_data)).call(position)
      });
      console.log(year);
      label.text(year);  
    }
  };


  //database data in d3 form 
  function interpolateData(yearly_company_data) {
    // console.log(yearly_company_data);
    return yearly_company_data.map(function(d){
      return ({
        name: d.name,
        region: d.country,
        industry: d.industry,
        employees: d.employees_num, 
        engineers: d.engineers_num,
        patents:d.patent_num,
        year: d.year   
      });
    });
  };

//closing all
});
