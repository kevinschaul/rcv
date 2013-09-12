var rcvComplexity = {
  init: function() {
    var margin = { top: 0, right: 70, bottom: 20, left: 10 };
    var width = 380 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    var svg = d3.select('.target-1').append('svg')
      .attr('width', 380)
      .attr('height', 350)
        .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var data = [];
    var numberOfCandidates = 40;
    for (var i = 0; i <= numberOfCandidates; i++) {
      // Simplified version of
      // n! / (n - m)!
      // where m = 3
      var n = i * (i - 1) * (i - 2);
      data.push(n);
    }

    var x = d3.scale.linear()
      .domain([0, numberOfCandidates])
      .range([0, width]);

    var y = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .tickValues([0, 10, 20, 30, 40])
      .orient('bottom');

    var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(5)
      .tickSize(width)
      .orient('right');

    var axis = svg.append('g')
      .attr('class', 'axis')

    axis.append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    axis.append('g')
      .attr('class', 'y-axis')
      //.attr('transform', 'translate(' + width + ',0)')
      .call(yAxis);

    var line = d3.svg.line()
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });

    svg.append('path')
      .attr('class', 'line')
      .attr('d', line(data));

    svg.append('circle')
      .attr('class', 'annotation-circle')
      .attr('cx', x(35))
      .attr('cy', y(data[35]))
      .attr('r', 10)

    var annotations = svg.append('g')
      .attr('class', 'annotation annotation-graph')

    annotations.append('text')
      .attr('x', x(0) + 7)
      .attr('y', y(0) + 17)
      .text('candidates')

    annotations.append('text')
      .attr('x', x(40) + 4)
      .attr('y', y(50000) + 17)
      .text('combinations')

    annotations.append('text')
      .attr('x', x(35) - 140)
      .attr('y', y(39000) - 30)
      .text('There will be 35 candidates')

    annotations.append('text')
      .attr('x', x(35) - 140)
      .attr('y', y(39000) - 18)
      .text('on this year\'s mayoral ballot.')
  }
};

