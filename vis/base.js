var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('.target').append('svg')
  .attr('width', 960)
  .attr('height', 800)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = [
  [30, [0, 0, 0]],
  [5, [1, 0, 0]],
  [2, [1, 2, 2]],
  [2, [1, 3, 2]],
  [20, [2, 2, 2]],
  [15, [3, 3, 0]],
  [10, [3, 3, 2]]
];

console.log(data);

var numberOfRounds = 3;
var numberOfCandidates = 4;
var hPadding = 0; // TODO
var vPadding = 200;
var candidateWidth = width / (numberOfCandidates);

var cumulativeVotes = [0, 0, 0, 0];

var x = d3.scale.linear()
  .domain([0, 50])
  .range([0, width / numberOfCandidates])

var line = d3.svg.line()
  .x(function(d, i) {
    console.log(i);
    cumulativeVotes[d.candidate] += d.width;
    console.log(cumulativeVotes);
    return d.candidate * candidateWidth;
  })
  .y(function(d, i) {
    return i * vPadding;
  })

_.each(_.range(0, numberOfRounds), function(roundIndex) {
  _.each(_.range(0, numberOfCandidates), function(i) {
    svg.append('rect')
      .attr('class', 'guide')
      .attr('x', function(d) { return (i * (width / numberOfCandidates)) + (hPadding / 2); })
      .attr('y', function(d) { return roundIndex * vPadding; })
      .attr('width', (width / numberOfCandidates) - hPadding)
      .attr('height', 30);
  });
});

svg.selectAll('path')
    .data(data)
  .enter().append('path')
    .attr('class', 'vote-line')
    .style('stroke-width', function(d) { return x(d[0]); })
    .attr('d', function(d) {
      var lineData = [];
      for (var i = 0; i < d[1].length; i++) {
        lineData.push({
          width: d[0],
          candidate: d[1][i]
        });
      }
      return line(lineData);
    })

