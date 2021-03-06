function main() {
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin,
        height = svg.attr("height") - margin;

    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "24px")
        .text("Fahrzeuge/Tag")

    var xScale = d3.scaleBand().range([0, width]).padding(0.1),
        yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append("g")
       .attr("transform", "translate(" + 100 + "," + 100 + ")");

    var regLine = d3.line()
        .x(function(d) {
            return x(d.timestamp);
        })
        .y(function(d) {
            return y(d.value);
        });




    d3.csv("month_value.csv").then( function(data) {
        xScale.domain(data.map(function(d) { return (d).timestamp }));
        yScale.domain([0, d3.max(data, function(d) { return 4500; })]);

      /*  g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("stroke", "black")
            .text("timestamp");
        */
        g.append("g")
            //.attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-75)"
            });

        g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){return d;}).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr('dy', '0em')
            .attr('text-anchor', 'end')
            .attr('stroke', 'black')
            .text('Anzahl Fahrzeuge')


       /* g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.timestamp) })
                .y(function(d) { return yScale(d.value) })
            )
*/
        g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver) // Add listener for event
            .on("mouseout", onMouseOut)
            .attr("x", function(d) { return xScale((d).timestamp); })
            .attr("y", function(d) { return yScale(d.value); })
            .attr("width", xScale.bandwidth())

           // .transition()
          //  .ease(d3.easeLinear)
         //   .duration(500)
       //     .delay(function(d,i){ return i * 50})
            .attr("height", function(d) { return height - yScale(d.value); });
    })


    // Mouseover event handler

    function onMouseOver(d, i) {
        // Get bar's xy values, ,then augment for the tooltip
        var xPos = parseFloat(d3.select(this).attr('x')) + xScale.bandwidth() / 2;
        var yPos = parseFloat(d3.select(this).attr('y')) / 2 + height / 2

        // Update Tooltip's position and value
        d3.select('#tooltip')
            .style('left', xPos + 'px')
            .style('top', yPos + 'px')
            .text("Zeitpunkt: " + i.timestamp + " Anzahl Fahrzeuge: " + i.value)


        d3.select('#tooltip').classed('hidden', false);


        d3.select(this).attr('class','highlight')
        d3.select(this)
            .transition() // I want to add animnation here
            .duration(500)
            .attr('width',function(d) {return weight - xScale(d.timestamp)})
            .attr('y', function(d){return yScale(d.value);})
            .attr('height', function(d){return height - yScale(d.value) + 10;})

    }

    // Mouseout event handler
   function onMouseOut(d, i){
        d3.select(this).attr('class','bar')
        d3.select(this)
            .transition()
            .duration(500)
            .attr('width', function(d) {return weight - xScale(d.timestamp)})
            .attr('y', function(d){return yScale(d.value);})
            .attr('height', function(d) {return height - yScale(d.value)})

        d3.select('#tooltip').classed('hidden', true);
    }
}