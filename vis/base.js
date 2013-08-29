var margin = { top: 10, right: 10, bottom: 10, left: 30 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('.target').append('svg')
  .attr('width', 960)
  .attr('height', 800)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = [
  [
    {
      votes: 30,
      from: 0,
      to: 0
    }, {
      votes: 20,
      from: 2,
      to: 2
    }, {
      votes: 15,
      from: 3,
      to: 3
    }, {
      votes: 5,
      from: 1,
      to: 0
    }, {
      votes: 5,
      from: 1,
      to: 2
    }, {
      votes: 2,
      from: 1,
      to: 3
    }
  ], [
    {
      votes: 35,
      from: 0,
      to: 0
    }, {
      votes: 25,
      from: 2,
      to: 2
    }, {
      votes: 10,
      from: 3,
      to: 0
    }, {
      votes: 7,
      from: 3,
      to: 2
    }
  ],
  []
];

console.log(data);

var totalVotes = 77;
var numberOfRounds = 3;
var numberOfCandidates = 4;
var hPadding = 100;
var vPadding = 200;
var rowHeight = 30;
var candidateWidth = width / (numberOfCandidates);

var candidatesInContention = [true, true, true, true];
var cumulativeVotes = [0, 0, 0, 0];

var x = d3.scale.linear()
  .domain([0, 1])
  .range([0, (width / numberOfCandidates - hPadding)]);

_.each(_.range(0, numberOfRounds), function(roundIndex) {
  // Label rounds
  svg.append('text')
    .attr('class', 'label')
    .attr('x', -(margin.left) + 10)
    .attr('y', (roundIndex * vPadding) + (rowHeight / 2) + 5)
    .text('Round ' + (roundIndex + 1))
});

var line = d3.svg.line()
  .x(function(d, i) {
    return d[0];
  })
  .y(function(d, i) {
    return d[1];
  })
  .interpolate('basis');

_.each(_.range(0, numberOfRounds), function(roundIndex) {

  // Draw bar chart if candidate has not yet been eliminated
  _.each(_.range(0, numberOfCandidates), function(candidateIndex) {
    if (candidatesInContention[candidateIndex]) {
      svg.append('rect')
        .attr('class', 'guide')
        .attr('x', (candidateIndex * (width / numberOfCandidates)) + (hPadding / 2))
        .attr('y', roundIndex * vPadding)
        .attr('width', (width / numberOfCandidates) - hPadding)
        .attr('height', rowHeight);

      svg.append('line')
        .attr('class', 'threshold')
        .attr('x1', (candidateIndex * (width / numberOfCandidates)) + (hPadding / 2) + x(.5))
        .attr('x2', (candidateIndex * (width / numberOfCandidates)) + (hPadding / 2) + x(.5))
        .attr('y1', roundIndex * vPadding)
        .attr('y2', (roundIndex * vPadding) + rowHeight);
    }
    candidatesInContention[candidateIndex] = _.find(data[roundIndex], function(d) {
      return d.to === candidateIndex;
    });
  });

  var enter = svg.append('g')
    .attr('class', 'round round-' + roundIndex)
    .selectAll('path')
      .data(data[roundIndex])
    .enter()

  cumulativeVotes = [0, 0, 0, 0];

  enter.append('path')
      .attr('class', 'vote-line')
      .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
      .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotes[d.from]), roundIndex * vPadding];
        var endPoint = [(d.from * candidateWidth) + x(cumulativeVotes[d.from]), roundIndex * vPadding + rowHeight];

        lineData.push(beginPoint);
        lineData.push(endPoint);

        cumulativeVotes[d.from] += d.votes / totalVotes;

        return line(lineData);
      })
      .attr('transform', function(d) {
        return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
      });

  cumulativeVotes = [0, 0, 0, 0];

  enter.append('path')
      .attr('class', 'vote-line')
      .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
      .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotes[d.from]), roundIndex * vPadding + rowHeight];
        var endPoint = [(d.to * candidateWidth) + x(cumulativeVotes[d.to]), (roundIndex + 1) * vPadding];

        var midPoint = [(beginPoint[0] + endPoint[0]) / 2, (beginPoint[1] + endPoint[1]) / 2];
        var preMidPoint = [beginPoint[0], beginPoint[1] + (vPadding / 3)];
        var postMidPoint = [endPoint[0], endPoint[1] - (vPadding / 3)];

        lineData.push(beginPoint);
        lineData.push(preMidPoint);
        lineData.push(midPoint);
        lineData.push(postMidPoint);
        lineData.push(endPoint);

        cumulativeVotes[d.from] += d.votes / totalVotes;

        return line(lineData);
      })
      .attr('transform', function(d) {
        return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
      })

    if (roundIndex === numberOfRounds - 2) {
      cumulativeVotes = [0, 0, 0, 0];

      enter.append('path')
        .attr('class', 'vote-line')
        .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
        .attr('d', function(d) {
          var lineData = [];
          var beginPoint = [(d.to * candidateWidth) + x(cumulativeVotes[d.to]), (roundIndex + 1) * vPadding];
          var endPoint = [(d.to * candidateWidth) + x(cumulativeVotes[d.to]), ((roundIndex + 1) * vPadding + rowHeight)];

          lineData.push(beginPoint);
          lineData.push(endPoint);

          cumulativeVotes[d.from] += d.votes / totalVotes;

          return line(lineData);
        })
        .attr('transform', function(d) {
          return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
        });
    }
});

d3.selectAll('.vote-line')
  .on('mouseover', function(d) {
    console.log(d);
  });

var annotations = svg.append('g')
  .attr('class', 'annotations')

annotations.append('line')
  .attr('class', 'leader-line')
  .attr('x1', (hPadding / 2) + x(.5))
  .attr('x2', (hPadding / 2) + x(.5))
  .attr('y1', rowHeight + 4)
  .attr('y2', rowHeight + 18)

annotations.append('text')
  .attr('class', 'annotation')
  .attr('x', (hPadding / 2) + x(.5) - 6)
  .attr('y', rowHeight + 30)
  .text('Threshold to win')

annotations.append('text')
  .attr('class', 'annotation')
  .attr('x', (hPadding / 2) + x(.5) - 6)
  .attr('y', rowHeight + 44)
  .text('(50 percent plus one vote)')

