var margin = { top: 10, right: 10, bottom: 10, left: 10 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('.target').append('svg')
  .attr('width', 960)
  .attr('height', 800)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = [
  {
    round: 0,
    votes: 30,
    from: 0,
    to: 0
  }, {
    round: 0,
    votes: 5,
    from: 1,
    to: 0
  }, {
    round: 0,
    votes: 5,
    from: 1,
    to: 2
  }, {
    round: 0,
    votes: 2,
    from: 1,
    to: 3
  }, {
    round: 0,
    votes: 20,
    from: 2,
    to: 2
  }, {
    round: 0,
    votes: 15,
    from: 3,
    to: 3
  }
];

console.log(data);

var numberOfRounds = 3;
var numberOfCandidates = 4;
var hPadding = 0; // TODO
var vPadding = 200;
var candidateWidth = width / (numberOfCandidates);

var cumulativeVotes = [0, 0, 0, 0];

// Draw boxes
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

var x = d3.scale.linear()
  .domain([0, 50])
  .range([0, width / numberOfCandidates])

var line = d3.svg.line()
  .x(function(d, i) {
    return d[0];
  })
  .y(function(d, i) {
    return d[1];
  })
  .interpolate('basis')

svg.selectAll('path')
    .data(data)
  .enter().append('path')
    .attr('class', 'vote-line')
    .style('stroke-width', function(d) { return x(d.votes); })
    .attr('d', function(d) {
      var lineData = [];
      var beginPoint = [d.from * candidateWidth, d.round * vPadding];
      var endPoint = [d.to * candidateWidth, (d.round + 1) * vPadding];

      var midPoint = [(beginPoint[0] + endPoint[0]) / 2, (beginPoint[1] + endPoint[1]) / 2];
      var preMidPoint = [beginPoint[0], beginPoint[1] + (vPadding / 3)];
      var postMidPoint = [endPoint[0], endPoint[1] - (vPadding / 3)];

      lineData.push(beginPoint);
      lineData.push(preMidPoint);
      lineData.push(midPoint);
      lineData.push(postMidPoint);
      lineData.push(endPoint);

      console.log(lineData);

      return line(lineData);
    })

