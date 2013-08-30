var margin = { top: 10, right: 10, bottom: 10, left: 60 };
var width = 960 - margin.left - margin.right;
var height = 1300 - margin.top - margin.bottom;

var svg = d3.select('.target').append('svg')
  .attr('width', 960)
  .attr('height', 1300)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// `data` is in an external script
var data = window.data || [];
console.log(data);

var totalVotes = 0;
_.each(data[0], function(d) {
  totalVotes += d.votes;
});
console.log(totalVotes);

var numberOfRounds = 6;
var numberOfCandidates = 20;
var hPadding = 4;
var vPadding = 140;
var rowHeight = 15;
var candidateWidth = width / (numberOfCandidates);

var candidatesInContention = [];

for (var i = 0; i < numberOfCandidates; i++) {
  candidatesInContention.push(true);
}

function resetCumulativeVotes() {
  var _cumulativeVotes = [];
  for (var i = 0; i < numberOfCandidates; i++) {
    _cumulativeVotes.push(0);
  }
  return _cumulativeVotes;
}

var cumulativeVotesIn = resetCumulativeVotes();
var cumulativeVotesOut = resetCumulativeVotes();

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

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  enter.append('path')
    .attr('class', 'vote-line')
    .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
    .attr('d', function(d) {
      var lineData = [];
      var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding];
      var endPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding + rowHeight];

      lineData.push(beginPoint);
      lineData.push(endPoint);

      cumulativeVotesIn[d.to] += d.votes / totalVotes;
      cumulativeVotesOut[d.from] += d.votes / totalVotes;

      return line(lineData);
    })
    .attr('transform', function(d) {
      return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
    });

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  enter.append('path')
    .attr('class', 'vote-line')
    .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
    .attr('d', function(d) {
      var lineData = [];
      var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding + rowHeight];
      var endPoint = [(d.to * candidateWidth) + x(cumulativeVotesIn[d.to]), (roundIndex + 1) * vPadding];

      var midPoint = [(beginPoint[0] + endPoint[0]) / 2, (beginPoint[1] + endPoint[1]) / 2];
      var preMidPoint = [beginPoint[0], beginPoint[1] + (vPadding / 3)];
      var postMidPoint = [endPoint[0], endPoint[1] - (vPadding / 3)];

      lineData.push(beginPoint);
      lineData.push(preMidPoint);
      lineData.push(midPoint);
      lineData.push(postMidPoint);
      lineData.push(endPoint);

      cumulativeVotesIn[d.to] += d.votes / totalVotes;
      cumulativeVotesOut[d.from] += d.votes / totalVotes;

      return line(lineData);
    })
    .attr('transform', function(d) {
      return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
    })

    if (roundIndex === numberOfRounds - 2) {
      cumulativeVotesIn = resetCumulativeVotes();
      cumulativeVotesOut = resetCumulativeVotes();

      enter.append('path')
        .attr('class', 'vote-line')
        .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
        .attr('d', function(d) {
          var lineData = [];
          var beginPoint = [(d.to * candidateWidth) + x(cumulativeVotesIn[d.to]), (roundIndex + 1) * vPadding];
          var endPoint = [(d.to * candidateWidth) + x(cumulativeVotesIn[d.to]), ((roundIndex + 1) * vPadding + rowHeight)];

          lineData.push(beginPoint);
          lineData.push(endPoint);

          cumulativeVotesIn[d.to] += d.votes / totalVotes;
          cumulativeVotesOut[d.from] += d.votes / totalVotes;

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

