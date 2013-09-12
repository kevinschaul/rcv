var r = rcvChart.init('.target-0', data);
var explanation = d3.select('.explanation');
var controls = d3.select('.controls');

var isTransitioning = false;

r.svg.selectAll('.round-labels .round-label, .guide-wrapper')
  .style('opacity', 0);

var stages = [
  // The first function is for setup
  // The second function is for teardown
  [
    function() {
      isTransitioning = true;
      r.drawRoundAnnotations(0);
      r.drawRoundChart(0, function() {
        isTransitioning = false;
      });
      explanation.text('Voters mark their first, second and third choice candidates on their ballots. If any candidate wins a majority of first choice votes, he or she is the winner.');
    },
    function() {
      isTransitioning = true;
      r.undrawRoundAnnotations(0);
      r.undrawRoundChart(0, function() {
        isTransitioning = false;
      });
    }
  ], [
    function() {
      isTransitioning = true;
      r.drawRoundAnnotations(1);
      r.drawRoundBetween(0, true, function() {
        isTransitioning = false;
      });
      explanation.text('Since no candidate reached the threshold, we continue to Round 2. The candidate with the least votes is eliminated.');
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 330);
    },
    function() {
      isTransitioning = true;
      r.undrawRoundAnnotations(1);
      r.undrawRoundBetween(0, true, function() {
        isTransitioning = false;
      });
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 200);
    }
  ], [
    function() {
      isTransitioning = true;
      r.svg.select('.vote-line-round-0.vote-line-from-1-to-3')
        .classed('vote-line-active', false);
      r.drawRoundBetween(0, false, function() {
        r.drawRoundChart(1, function() {
          isTransitioning = false;
        });
      });
      explanation.text('Votes for eliminated candidates are redistributed based on voters\' second or third choice votes.');
    },
    function() {
      isTransitioning = true;
      r.undrawRoundChart(1, function() {
        r.undrawRoundBetween(0, false, function() {
          isTransitioning = false;
        });
      });
    }
  ], [
    function() {
      r.svg.select('.vote-line-round-0.vote-line-from-1-to-3')
        .classed('vote-line-active', true);
      explanation.text('For example, if Joe voted first choice for Candidate B and second choice for Candidate D, his vote would have moved to Candidate D.');
    },
    function() {
      r.svg.select('.vote-line-round-0.vote-line-from-1-to-3')
        .classed('vote-line-active', false);
    }
  ], [
    function() {
      isTransitioning = true;
      r.svg.select('.vote-line-round-0.vote-line-from-1-to-3')
        .classed('vote-line-active', false);
      explanation.text('Still, no candidate has reached the threshold. The candidate with the least votes is eliminated again, with his or her votes redistributed.');
      r.drawRoundAnnotations(2);
      r.drawRoundBetween(1, true, function() {
        r.drawRoundBetween(1, false, function() {
          isTransitioning = false;
        });
      });
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 510);
    },
    function() {
      isTransitioning = true;
      r.undrawRoundAnnotations(2);
      r.undrawRoundBetween(1, false, function() {
        isTransitioning = false;
      });
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 330);
    }
  ], [
    function() {
      isTransitioning = true;
      explanation.text('With this redistribution, Candidate C reached the threshold and is the winner.');
      r.drawRoundChart(2, function() {
        r.svg.selectAll('.vote-line-chart-round-2.vote-line-from-candidate-2')
          .transition()
          .ease('linear')
          .duration(500)
          .style('stroke-opacity', 0.7);
        r.svg.select('.guide-wrapper-round-2.guide-wrapper-candidate-2 .guide')
          .transition()
          .ease('linear')
          .duration(500)
          .style('stroke', '#333')
          .each('end', function() {
            isTransitioning = false;
          });
      });
    },
    function() {
      isTransitioning = true;
      r.undrawRoundChart(2, function() {
        isTransitioning = false;
      });
      r.svg.selectAll('.vote-line-chart-round-2.vote-line-from-candidate-2')
        .style('stroke-opacity', 0.5);
      r.svg.select('.guide-wrapper-round-2.guide-wrapper-candidate-2 .guide')
        .style('stroke', '#999');
    }
  ]
];

var currentStage = 0;

var setStage = function(stage) {
  stages[stage][0]();
};

var unsetStage = function(stage) {
  stages[stage][1]();
};

var previousStage = function() {
  if (!isTransitioning) {
    if (currentStage - 1 >= 0) {
      unsetStage(currentStage);
      currentStage -= 1;
      setStage(currentStage);
    }
  }
};

var nextStage = function() {
  if (!isTransitioning) {
    if (currentStage + 1 < stages.length) {
      currentStage += 1;
      setStage(currentStage);
    }
  }
};

var btnPrevious = d3.select('.btn-previous');
var btnNext = d3.select('.btn-next');

btnPrevious.on('click', function() {
  previousStage();
});

btnNext.on('click', function() {
  nextStage();
});

setStage(0);

rcvComplexity.init();

var r1 = rcvChart20.init('.target-2', data20);
r1.drawRoundChart(0, function() {
  r1.drawRoundBetween(0, false, function() {
    r1.drawRoundChart(1, function() {
      r1.drawRoundBetween(1, false, function() {
        r1.drawRoundChart(2, function() {
          r1.drawRoundBetween(2, false, function() {
            r1.drawRoundChart(3, function() {
              r1.drawRoundBetween(3, false, function() {
                r1.drawRoundChart(4, function() {
                  r1.drawRoundBetween(4, false, function() {
                    r1.drawRoundChart(5, function() {
                      r1.drawRoundBetween(5);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

/*

(function() {

var margin = { top: 10, right: 10, bottom: 10, left: 30 };
var width = 960 - margin.left - margin.right;
var height = 1000 - margin.top - margin.bottom;

var svg = d3.select('.target-2').append('svg')
  .attr('width', 960)
  .attr('height', 1000)
    .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var data = window.data20 || [];
console.log(data);

var totalVotes = 100;
var numberOfRounds = 6;
var numberOfCandidates = 20;
var hPadding = 10;
var vPadding = 140;
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
      var endPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding + rowHeight];

      lineData.push(beginPoint);
      lineData.push(endPoint);

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
      var c = 'vote-line vote-line-between-rounds vote-line-round-' + roundIndex + ' vote-line-from-' + d.from + '-to-' + d.to;
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
          lineData.push(endPoint);

          cumulativeVotesIn[d.to] += d.votes / totalVotes;
          cumulativeVotesOut[d.from] += d.votes / totalVotes;

          return line(lineData);
        })
    }
});

})();
*/

