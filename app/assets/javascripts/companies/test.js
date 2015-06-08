$(document).ready( function(){
  console.log("Works!")


  // Chart dimensions.
  var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5},
      width = 960 - margin.right,
      height = 500;


  // Create the SVG container and set the origin.
  var svg = d3.select("#charts").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // rendering data in json
  d3.json("/companies", function(company_data){
    d3.json("/patents", function(patnum_all_years){
      console.log(company_data);
      // Various accessors that specify the four dimensions of data to visualize.
      function x(d) { return d.employees };
      function y(d) { return d.engineers };
      function radius(d) { return d.engineers };
      function color(d) { return d.region };
      function key(d) { return d.name };

      //Scale of radius
      var radiusScale = d3.scale.sqrt().domain(d3.extent(company_data, function(d){ return d.engineers_num})).range([10, 40]),
        colorScale = d3.scale.category20();

      // Various scales. These domains make assumptions of data, naturally.
      var xScale = d3.scale.linear().domain(d3.extent(company_data, function(d){ return d.employees_num})).range([0, width]),
        yScale = d3.scale.linear().domain(d3.extent(patnum_all_years, function(d){ return d.patent_num})).range([height, 0])

      // The x & y axes.
      var xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")).tickSize(1),
        yAxis = d3.svg.axis().scale(yScale).orient("left").tickSize(1);  

      var test = [
        {name: 1, x: 30000, can: 300},
        {name: 2, x: 40000, can: 400},
        {name: 3, x: 5000, can: 100}
      ]

      // Add a dot per nation. Initialize the data at 2002, and set the colors.
      var dot = svg.append("g")
          .attr("class", "dots")
        .selectAll(".dot")       
          .data(interpolateData()) //picking up because it shows 5 dots but can't put two sets of data because they will overwrite each other. 
        .enter().append("circle")
          .attr("class", "dot")
          .style("fill", function(d) { return colorScale(color(d)); })
          .call(position)
          //shows name of company upon hover over
          .on('mouseover', function(d) {
            d3.select(this.parentElement).select('title').style('opacity', 1)
          });
          // .sort(order);

      // Add a title to each dot.
      dot.append("title")
        .text(function(d) { return d.name });

      function positionTest(dot) {
        dot .attr("cx", function(d) {
          return xScale(d.engineers)
        })
      }

      // Positions the dots based on data.
      function position(dot) {
        dot .attr("cx", d.engineer_num 
          function(d) { 
          // console.log("cx is " + xScale(x(d)) );
          // return xScale(x(d)); 
          return d.engineers_num;
        } )
        .attr("cy", function(d) { return yScale(d.employees_num) })
        .attr("r", 10
          // function(d) {
          // console.log( radiusScale(radius(d)) );
          // return radiusScale(radius(d)); 
        // }
        );
      };      

      //database data in d3 form 
      function interpolateData() {
        return company_data.map(function(d){
          return( {
            name: d.name,
            region: d.country,
            industry: d.industry,
            employees_num: d.employees_num, 
            engineers_num: d.engineers_num
          })
        })
      };

      // console.log(interpolateData())

      function interpolateData2() {
        return company_data.map(function(d){
          return( {
            full_name: d.company_full_name,
            patents: d.patent_num,
            year: d.year
          })
        })
      };

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

      // // Add the year label; the value is set on transition.
      // var label = svg.append("text")
      //   .attr("class", "year label")
      //   .attr("text-anchor", "end")
      //   .attr("y", height - 24)
      //   .attr("x", width)
      //   .text(2002);

      // // Add an overlay for the year label.
      // var box = label.node().getBBox();

      // var overlay = svg.append("rect")
      //       .attr("class", "overlay")
      //       .attr("x", box.x)
      //       .attr("y", box.y)
      //       .attr("width", box.width)
      //       .attr("height", box.height)
      //       .on("mouseover", enableInteraction);

      // // Start a transition that interpolates the data based on year.
      // svg.transition()
      //     .duration(30000)
      //     .ease("linear")
      //     .tween("year", tweenYear)
      //     .each("end", enableInteraction);
      
      // // After the transition finishes, you can mouseover to change the year.
      // function enableInteraction() {
      //   var yearScale = d3.scale.linear()
      //       .domain([2002, 2014])
      //       .range([box.x + 10, box.x + box.width - 10])
      //       .clamp(true);

      //   // Cancel the current transition, if any.
      //   svg.transition().duration(0);

      //   overlay
      //       .on("mouseover", mouseover)
      //       .on("mouseout", mouseout)
      //       .on("mousemove", mousemove)
      //       .on("touchmove", mousemove);

      //   function mouseover() {
      //     label.classed("active", true);
      //   }

      //   function mouseout() {
      //     label.classed("active", false);
      //   }

      //   function mousemove() {
      //     displayYear(yearScale.invert(d3.mouse(this)[0]));
      //   }
      // };

      // // Tweens the entire chart by first tweening the year, and then the data.
      // // For the interpolated data, the dots and label are redrawn.
      // function tweenYear() {
      //   var year = d3.interpolateNumber(2002, 2014);
      //   return function(t) { displayYear(year(t)); };
      // }

      // // Updates the display to show the specified year.
      // function displayYear(year) {
      //   dot.data(interpolateData(year), key).call(position);
      //   label.text(Math.round(year));
      // }
    });

  //closing companies.json
  });

//closing all
});
