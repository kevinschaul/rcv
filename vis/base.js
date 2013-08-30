var margin = { top: 10, right: 10, bottom: 10, left: 30 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svg = d3.select('.target').append('svg')
  .attr('width', 960)
  .attr('height', 800)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = window.data || [];
console.log(data);

var totalVotes = 77;
var numberOfRounds = 3;
var numberOfCandidates = 4;
var hPadding = 100;
var vPadding = 200;
var rowHeight = 30;
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
    .attr('class', 'vote-line vote-line-chart-round-' + roundIndex)
    .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
    .attr('transform', function(d) {
      return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
    })
    .attr('d', function(d) {
      var lineData = [];
      var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding];

      lineData.push(beginPoint);
      lineData.push(beginPoint);

      cumulativeVotesIn[d.to] += d.votes / totalVotes;
      cumulativeVotesOut[d.from] += d.votes / totalVotes;

      return line(lineData);
    });

  cumulativeVotesInitialIn = resetCumulativeVotes();
  cumulativeVotesInitialOut = resetCumulativeVotes();
  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  enter.append('path')
    .attr('class', function(d) { return 'vote-line vote-line-round-' + roundIndex; })
    .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
    .attr('transform', function(d) {
      return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
    })
    .attr('d', function(d) {
      var lineData = [];
      var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotesInitialOut[d.from]), roundIndex * vPadding + rowHeight];
      var preMidPoint = [beginPoint[0], beginPoint[1] + (vPadding / 3)];

      lineData.push(beginPoint);
      lineData.push(beginPoint);
      lineData.push(beginPoint);
      lineData.push(beginPoint);
      lineData.push(beginPoint);

      cumulativeVotesInitialIn[d.to] += d.votes / totalVotes;
      cumulativeVotesInitialOut[d.from] += d.votes / totalVotes;

      return line(lineData);
    })

    if (roundIndex === numberOfRounds - 2) {
      cumulativeVotesIn = resetCumulativeVotes();
      cumulativeVotesOut = resetCumulativeVotes();

      enter.append('path')
        .attr('class', 'vote-line vote-line-finish-round-' + roundIndex)
        .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
        .attr('transform', function(d) {
          return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
        })
        .attr('d', function(d) {
          var lineData = [];
          var beginPoint = [(d.to * candidateWidth) + x(cumulativeVotesIn[d.to]), (roundIndex + 1) * vPadding];
          var endPoint = [(d.to * candidateWidth) + x(cumulativeVotesIn[d.to]), ((roundIndex + 1) * vPadding + rowHeight)];

          lineData.push(beginPoint);
          lineData.push(beginPoint);

          cumulativeVotesIn[d.to] += d.votes / totalVotes;
          cumulativeVotesOut[d.from] += d.votes / totalVotes;

          return line(lineData);
        })
    }
});

d3.selectAll('.vote-line')
  .on('mouseover', function(d) {
    console.log(d);
    d3.select(this)
      .style('stroke', '#022505')
  })
  .on('mouseout', function(d) {
    d3.select(this)
      .style('stroke', '#58794F')
  });

function showRoundChart(roundIndex, callback) {
  var duration = 500;

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  d3.selectAll('.vote-line-chart-round-' + roundIndex)
  .transition()
    .ease('linear')
    .duration(duration)
    .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding];
        var endPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding + rowHeight];

        lineData.push(beginPoint);
        lineData.push(endPoint);

        cumulativeVotesIn[d.to] += d.votes / totalVotes;
        cumulativeVotesOut[d.from] += d.votes / totalVotes;

        return line(lineData);
      });

  if (callback) window.setTimeout(callback, duration);
}

function showRound(roundIndex, callback) {
  var duration = 1500;

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  d3.selectAll('.vote-line-round-' + roundIndex)
  .transition()
    .ease('linear')
    .duration(duration)
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

  if (callback) window.setTimeout(callback, duration);
}

function showRoundFinish(roundIndex, callback) {
  var duration = 500;

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  d3.selectAll('.vote-line-finish-round-' + roundIndex)
    .transition()
    .duration(500)
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

  if (callback) window.setTimeout(callback, duration);
}

showRoundChart(0, function() {
  showRound(0, function() {
    showRoundChart(1, function() {
      showRound(1, function() {
        showRoundFinish(1);
      });
    });
  });
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

