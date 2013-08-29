var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('.target').append('svg')
  .attr('width', 960)
  .attr('height', 500)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = [
  // Each index at this level is a round
  [
    // Each index is a candidate
    // [[number of votes, candidate index votes came from], ...]
    [[22, 0]],
    [[3, 1]],
    [[20, 2]]
  ],
  [
    [[22, 0], [2, 1]],
    [[0, 1]],
    [[20, 2], [1, 1]]
  ]
];

var numberOfCandidates = 3;
var betweenCandidates = 50;

var line = d3.svg.line()
  .x(function(d) { return d[0][1]; })
  .y(function(d) { return d[0][1]; })

console.log(data);

_.each(data, function(round, roundIndex) {

  _.each(_.range(0, numberOfCandidates), function(i) {
    svg.append('rect')
      .attr('class', 'guide')
      .attr('x', function(d) { return (i * (width / numberOfCandidates)) + (betweenCandidates / 2); })
      .attr('y', function(d) { return roundIndex * 200; })
      .attr('width', (width / numberOfCandidates) - betweenCandidates)
      .attr('height', 30);
  });

  svg.selectAll('path')
      .data(data[roundIndex])
    .enter().append('path')
      .attr('d', function(d) {
        console.log(d);
        return line(d);
      })

});

/*
svg.selectAll('path')
    .data(data)
  .enter().append('path')
    .attr('d', function(d) { console.log(d); return line(d); });
   */

