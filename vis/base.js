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
var vPadding = 180;
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
    .attr('class', 'round-label round-label-round-' + roundIndex)
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
      var guideWrapper = svg.append('g')
        .attr('class', 'guide-wrapper guide-wrapper-round-' + roundIndex + ' guide-wrapper-candidate-' + candidateIndex)

      guideWrapper.append('rect')
        .attr('class', 'guide')
        .attr('x', (candidateIndex * (width / numberOfCandidates)) + (hPadding / 2))
        .attr('y', roundIndex * vPadding)
        .attr('width', (width / numberOfCandidates) - hPadding)
        .attr('height', rowHeight);

      guideWrapper.append('line')
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

  var path = enter.append('path')
    .attr('class', function(d) {
      var c = 'vote-line vote-line-round-' + roundIndex + ' vote-line-from-' + d.from + '-to-' + d.to;
      if (d.from === d.to) {
        c += ' vote-line-same';
      } else {
        c += ' vote-line-different';
      }
      return c;
    })
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
        .attr('class', function(d) { return 'vote-line vote-line-finish-round-' + roundIndex + ' vote-line-finish-candidate-' + d.to; })
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

function showRoundSame(roundIndex, callback) {
  var duration = 1500;

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  d3.selectAll('.vote-line-round-' + roundIndex + '.vote-line-same')
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

function showRoundDifferent(roundIndex, callback) {
  var duration = 1500;

  d3.selectAll('.vote-line-round-' + roundIndex + '.vote-line-different')
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
    .duration(duration)
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

var annotations = svg.append('g')
  .attr('class', 'annotations')

var a0 = annotations.append('g')
  .attr('class', 'annotation annotation-0')

a0.append('line')
  .attr('class', 'leader-line')
  .attr('x1', (hPadding / 2) + x(.5))
  .attr('x2', (hPadding / 2) + x(.5))
  .attr('y1', rowHeight + 4)
  .attr('y2', rowHeight + 18)

a0.append('text')
  .attr('x', (hPadding / 2) + x(.5) - 6)
  .attr('y', rowHeight + 30)
  .text('Threshold to win')

a0.append('text')
  .attr('x', (hPadding / 2) + x(.5) - 6)
  .attr('y', rowHeight + 44)
  .text('(50 percent plus one vote)')

d3.select('.btn-next')
  .on('click', nextStage);

var currentStage = 0;
var explanationD3 = d3.select('.explanation');

var stages = [
  function() {
    d3.selectAll('.round-label-round-0, .guide-wrapper-round-0')
      .style('display', 'block')
    d3.selectAll('.annotation-0')
      .style('display', 'block')
    showRoundChart(0)
    explanationD3.text('Voters mark their first, second and third choice candidates on their ballots. If any candidate wins a majority of first choice votes, he or she is the winner.');
  },
  function() {
    d3.selectAll('.round-label-round-1, .guide-wrapper-round-1')
      .style('display', 'block')
    showRoundSame(0);
    explanationD3.text('Since no candidate reached the threshold, we continue to Round 2. The candidate with the least votes is eliminated.');
  },
  function() {
    showRoundDifferent(0, function() {
      showRoundChart(1);
    });
    explanationD3.text('Votes for eliminated candidates are redistributed based on voters\' second or third choice votes.');
  },
  function() {
    d3.select('.vote-line-round-0.vote-line-from-1-to-3')
      .classed('vote-line-active', true);
    explanationD3.text('For example, if Joe voted first choice for Candidate B and second choice for Candidate D, his vote would have moved to Candidate D.');
  },
  function() {
    d3.select('.vote-line-round-0.vote-line-from-1-to-3')
      .classed('vote-line-active', false);

    d3.selectAll('.round-label-round-2, .guide-wrapper-round-2')
      .style('display', 'block')
    showRoundSame(1, function() {
      showRoundDifferent(1)
    })
    explanationD3.text('Still, no candidate has reached the threshold. The candidate with the least votes is eliminated again, with his or her votes redistributed.');
  },
  function() {
    showRoundFinish(1, function() {
      d3.selectAll('.guide-wrapper-round-2.guide-wrapper-candidate-2 rect,.guide-wrapper-round-2.guide-wrapper-candidate-2 line')
        .transition()
        .style('stroke', '#333')
      d3.selectAll('.vote-line-finish-candidate-2')
        .transition()
        .style('stroke-opacity', 0.7);
    })
    explanationD3.text('With this redistribution, Candidate A reached the threshold, and thus is the winner.');
  }
];

function nextStage() {
  if (currentStage + 1 < stages.length) {
    currentStage++;
    stages[currentStage]();
    checkStageButtons();
  }
}

function checkStageButtons() {
  d3.selectAll('.btn-inactive')
    .classed('btn-inactive', false);
  if (currentStage === stages.length - 1) {
    d3.select('.btn-next')
      .classed('btn-inactive', true);
  }
}

stages[currentStage]();

