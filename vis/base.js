rcvChart = {
  /* Options */
  margin: { top: 10, right: 10, bottom: 10, left: 30 },
  width: 960,
  height: 450,

  hPadding: 100,
  vPadding: 180,
  rowHeight: 30,

  // TODO These can be computed
  totalVotes: 77,
  numberOfRounds: 3,
  numberOfCandidates: 4,

  /* Computed */
  candidateWidth: null,
  candidatesInContention: [],
  svg: null,

  init: function(_id, _data) {
    var self = this;

    self.id = _id;
    self.data = _data;

    self.initData();
    self.initSvg();

    self.drawRoundLabels();
    self.drawChart();

    return self;
  },

  initData: function() {
    var self = this;

    self.width -= self.margin.left - self.margin.right;
    self.height -= self.margin.top - self.margin.bottom;
    self.candidateWidth = self.width / self.numberOfCandidates;

    for (var i = 0; i < self.numberOfCandidates; i++) {
      self.candidatesInContention.push(true);
    }

  },

  initSvg: function() {
    var self = this;

    self.svg = d3.select(self.id).append('svg')
      .attr('width', 960)
      .attr('height', 450)
        .append('g')
      .attr('transform',
          'translate(' + self.margin.left + ',' + self.margin.top + ')')

    self.x = d3.scale.linear()
      .domain([0, 1])
      .range([0, (self.width / self.numberOfCandidates - self.hPadding)]);

    self.line = d3.svg.line()
      .x(function(d, i) {
        return d[0];
      })
      .y(function(d, i) {
        return d[1];
      })
      .interpolate('basis');

  },

  drawRoundLabels: function() {
    var self = this;

    var roundLabels = self.svg.append('g')
      .attr('class', 'round-labels');

    _.each(_.range(0, self.numberOfRounds), function(roundIndex) {
      // Label rounds
      roundLabels.append('text')
        .attr('class', 'round-label round-label-round-' + roundIndex)
        .attr('x', -(self.margin.left) + 10)
        .attr('y', (roundIndex * self.vPadding) +
            (self.rowHeight / 2) + 5)
        .text('Round ' + (roundIndex + 1));
    });
  },

  drawChart: function() {
    var self = this;

    // For each round ...
    _.each(_.range(0, self.numberOfRounds), function(roundIndex) {

      // For each candidate ...
      _.each(_.range(0, self.numberOfCandidates), function(candidateIndex) {
        if (self.candidatesInContention[candidateIndex]) {
          var guideWrapper = self.svg.append('g')
            .attr('class', function(d) {
              var s = 'guide-wrapper guide-wrapper-round-' + roundIndex +
                ' guide-wrapper-candidate-' + candidateIndex;
              return s;
            });

          guideWrapper.append('rect')
            .attr('class', 'guide')
            .attr('x', (candidateIndex *
                (self.width / self.numberOfCandidates)) + (self.hPadding / 2))
            .attr('y', roundIndex * self.vPadding)
            .attr('width', (self.width / self.numberOfCandidates) -
                self.hPadding)
            .attr('height', self.rowHeight);

          guideWrapper.append('line')
            .attr('class', 'threshold')
            .attr('x1', (candidateIndex *
                (self.width / self.numberOfCandidates)) + (self.hPadding / 2) +
                self.x(.5))
            .attr('x2', (candidateIndex *
                (self.width / self.numberOfCandidates)) + (self.hPadding / 2) +
                self.x(.5))
            .attr('y1', roundIndex * self.vPadding)
            .attr('y2', (roundIndex * self.vPadding) + self.rowHeight);
        }
        self.candidatesInContention[candidateIndex] = _.find(
            self.data[roundIndex][1], function(d) {
          return d.to === candidateIndex;
        });

      });

      // Draw each vote line chart
      var cumulativeVotesIn = self.getFreshCumulativeVotes();
      var cumulativeVotesOut = self.getFreshCumulativeVotes();

      self.svg.append('g')
        .attr('class', 'round round-' + roundIndex)
        .selectAll('path')
        .data(data[roundIndex][0])
          .enter().append('path')
        .attr('class', function(d) {
          var s = 'vote-line vote-line-chart-round-' + roundIndex;
          if (d.original) {
            s += ' vote-line-original';
          }
          return s;
        })
        .style('stroke-width', function(d) {
          return self.x(d.votes / self.totalVotes);
        })
        .attr('transform', function(d) {
          return 'translate(' + ((self.x(d.votes / self.totalVotes) +
              self.hPadding) / 2) + ',0)';
        })
        .attr('d', function(d) {
          var lineData = [];
          var beginPoint = [(d.from * self.candidateWidth) +
              self.x(cumulativeVotesOut[d.from]),
              roundIndex * self.vPadding];
          var endPoint = [(d.from * self.candidateWidth) +
              self.x(cumulativeVotesOut[d.from]),
              roundIndex * self.vPadding + self.rowHeight];

          lineData.push(beginPoint);
          lineData.push(beginPoint);

          cumulativeVotesIn[d.to] += d.votes / self.totalVotes;
          cumulativeVotesOut[d.from] += d.votes / self.totalVotes;

          return self.line(lineData);
        })
        .on('mouseover', self.mouseover)

      // If not the last round, draw each vote line
      if (roundIndex + 1 < self.numberOfRounds) {
        var cumulativeVotesInitialIn = self.getFreshCumulativeVotes();
        var cumulativeVotesInitialOut = self.getFreshCumulativeVotes();
        var cumulativeVotesIn = self.getFreshCumulativeVotes();
        var cumulativeVotesOut = self.getFreshCumulativeVotes();

        self.svg.append('g')
          .attr('class', 'round round-' + roundIndex)
          .selectAll('path')
          .data(data[roundIndex][1])
            .enter().append('path')
          .attr('class', function(d) {
            var s = 'vote-line vote-line-between-rounds' + 
             ' vote-line-round-' + roundIndex + ' vote-line-from-' + d.from +
             '-to-' + d.to;
            if (d.from === d.to) {
              s += ' vote-line-same';
            } else {
              s += ' vote-line-different';
            }
            if (d.originalTo) {
              s += ' vote-line-original';
            }
            return s;
          })
          .style('stroke-width', function(d) {
            return self.x(d.votes / self.totalVotes);
          })
          .attr('transform', function(d) {
            return 'translate(' + ((self.x(d.votes / self.totalVotes) +
                self.hPadding) / 2) + ',0)';
          })
          .attr('d', function(d) {
            var lineData = [];
            var beginPoint = [(d.from * self.candidateWidth) +
                self.x(cumulativeVotesInitialOut[d.from]),
                roundIndex * self.vPadding + self.rowHeight];
            var endPoint = [(d.to * self.candidateWidth) +
                self.x(cumulativeVotesInitialIn[d.to]),
                (roundIndex + 1) * self.vPadding];

            var preMidPoint = [beginPoint[0], beginPoint[1] +
                (self.vPadding / 3)];
            var midPoint = [(beginPoint[0] + endPoint[0]) / 2,
                (beginPoint[1] + endPoint[1]) / 2];
            var postMidPoint = [endPoint[0],
                endPoint[1] - (self.vPadding / 3)];

            lineData.push(beginPoint);
            lineData.push(beginPoint);
            lineData.push(beginPoint);
            lineData.push(beginPoint);
            lineData.push(beginPoint);

            cumulativeVotesInitialIn[d.to] += d.votes / self.totalVotes;
            cumulativeVotesInitialOut[d.from] += d.votes / self.totalVotes;

            return self.line(lineData);
          })
          .on('mouseover', self.mouseover)
      }

    });
  },

  drawRoundChart: function(roundIndex) {
    var self = this;

    var cumulativeVotesIn = self.getFreshCumulativeVotes();
    var cumulativeVotesOut = self.getFreshCumulativeVotes();

    self.svg.selectAll('.vote-line-chart-round-' + roundIndex)
      .interrupt()
      .transition()
      .duration(500)
      .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * self.candidateWidth) +
            self.x(cumulativeVotesOut[d.from]),
            roundIndex * self.vPadding];
        var endPoint = [(d.from * self.candidateWidth) +
            self.x(cumulativeVotesOut[d.from]),
            roundIndex * self.vPadding + self.rowHeight];

        lineData.push(beginPoint);
        lineData.push(endPoint);

        cumulativeVotesIn[d.to] += d.votes / self.totalVotes;
        cumulativeVotesOut[d.from] += d.votes / self.totalVotes;

        return self.line(lineData);
      });
  },

  undrawRoundChart: function(roundIndex) {
    var self = this;

    var cumulativeVotesIn = self.getFreshCumulativeVotes();
    var cumulativeVotesOut = self.getFreshCumulativeVotes();

    self.svg.selectAll('.vote-line-chart-round-' + roundIndex)
      .interrupt()
      .transition()
      .duration(500)
      .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * self.candidateWidth) +
            self.x(cumulativeVotesOut[d.from]),
            roundIndex * self.vPadding];
        var endPoint = [(d.from * self.candidateWidth) +
            self.x(cumulativeVotesOut[d.from]),
            roundIndex * self.vPadding + self.rowHeight];

        lineData.push(beginPoint);
        lineData.push(beginPoint);

        cumulativeVotesIn[d.to] += d.votes / self.totalVotes;
        cumulativeVotesOut[d.from] += d.votes / self.totalVotes;

        return self.line(lineData);
      });
  },

  drawRoundBetween: function(roundIndex, original) {
    var self = this;

    var cumulativeVotesInitialIn = self.getFreshCumulativeVotes();
    var cumulativeVotesInitialOut = self.getFreshCumulativeVotes();
    var cumulativeVotesIn = self.getFreshCumulativeVotes();
    var cumulativeVotesOut = self.getFreshCumulativeVotes();

    var s = '.vote-line-between-rounds.vote-line-round-' + roundIndex;
    if (original) {
      s += '.vote-line-original';
    }

    self.svg.selectAll(s)
      .interrupt()
      .transition()
      .duration(2000)
      .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * self.candidateWidth) +
            self.x(cumulativeVotesInitialOut[d.from]),
            roundIndex * self.vPadding + self.rowHeight];
        var endPoint = [(d.to * self.candidateWidth) +
            self.x(cumulativeVotesInitialIn[d.to]),
            (roundIndex + 1) * self.vPadding];

        var preMidPoint = [beginPoint[0], beginPoint[1] +
            (self.vPadding / 3)];
        var midPoint = [(beginPoint[0] + endPoint[0]) / 2,
            (beginPoint[1] + endPoint[1]) / 2];
        var postMidPoint = [endPoint[0],
            endPoint[1] - (self.vPadding / 3)];

        lineData.push(beginPoint);
        lineData.push(preMidPoint);
        lineData.push(midPoint);
        lineData.push(postMidPoint);
        lineData.push(endPoint);

        cumulativeVotesInitialIn[d.to] += d.votes / self.totalVotes;
        cumulativeVotesInitialOut[d.from] += d.votes / self.totalVotes;

        return self.line(lineData);
      });
  },

  undrawRoundBetween: function(roundIndex) {
    var self = this;

    var cumulativeVotesInitialIn = self.getFreshCumulativeVotes();
    var cumulativeVotesInitialOut = self.getFreshCumulativeVotes();
    var cumulativeVotesIn = self.getFreshCumulativeVotes();
    var cumulativeVotesOut = self.getFreshCumulativeVotes();

    var s = '.vote-line-between-rounds.vote-line-round-' + roundIndex;

    self.svg.selectAll(s)
      .interrupt()
      .transition()
      .duration(2000)
      .attr('d', function(d) {
        var lineData = [];
        var beginPoint = [(d.from * self.candidateWidth) +
            self.x(cumulativeVotesInitialOut[d.from]),
            roundIndex * self.vPadding + self.rowHeight];
        var endPoint = [(d.to * self.candidateWidth) +
            self.x(cumulativeVotesInitialIn[d.to]),
            (roundIndex + 1) * self.vPadding];

        var preMidPoint = [beginPoint[0], beginPoint[1] +
            (self.vPadding / 3)];
        var midPoint = [(beginPoint[0] + endPoint[0]) / 2,
            (beginPoint[1] + endPoint[1]) / 2];
        var postMidPoint = [endPoint[0],
            endPoint[1] - (self.vPadding / 3)];

        lineData.push(beginPoint);
        lineData.push(beginPoint);
        lineData.push(beginPoint);
        lineData.push(beginPoint);
        lineData.push(beginPoint);

        cumulativeVotesInitialIn[d.to] += d.votes / self.totalVotes;
        cumulativeVotesInitialOut[d.from] += d.votes / self.totalVotes;

        return self.line(lineData);
      });
  },

  mouseover: function(d) {
    console.log(d);
  },

  getFreshCumulativeVotes: function() {
    var self = this;

    var _cumulativeVotes = [];
    for (var i = 0; i < self.numberOfCandidates; i++) {
      _cumulativeVotes.push(0);
    }
    return _cumulativeVotes;
  },

};

r = rcvChart.init('.target-0', data);

/*
(function() {
_.each(_.range(0, numberOfRounds), function(roundIndex) {

  enter.append('path')
    .attr('class', function(d) {
      var s = 'vote-line vote-line-chart-round-' + roundIndex;
      if (d.eliminated) {
        s += ' vote-line-eliminated';
      }
      return s;
    })
    .style('stroke-width', function(d) { return x(d.votes / totalVotes); })
    .attr('transform', function(d) {
      return 'translate(' + ((x(d.votes / totalVotes) + hPadding) / 2) + ',0)';
    })
    .attr('d', function(d) {
      var lineData = [];
      var beginPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding];
      var endPoint = [(d.from * candidateWidth) + x(cumulativeVotesOut[d.from]), roundIndex * vPadding + rowHeight];

      if (roundIndex === 0) {
        lineData.push(beginPoint);
        lineData.push(endPoint);
      } else {
        lineData.push(beginPoint);
        lineData.push(beginPoint);
      }

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
      if (d.eliminated) {
        c += ' vote-line-eliminated';
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
        .attr('class', function(d) {
          var s = 'vote-line vote-line-finish-round-' + roundIndex + ' vote-line-finish-candidate-' + d.to;
          if (d.eliminated) {
            s += ' vote-line-eliminated';
          }
          return s;
        })
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

svg.selectAll('.vote-line-between-rounds')
  .on('mouseover', function(d) {
    console.log(d);
    d3.select(this)
      .style('stroke-opacity', 0.7)
  })
  .on('mouseout', function(d) {
    d3.select(this)
      .style('stroke-opacity', 0.5)
  });

function showRoundChart(roundIndex, callback) {
  var duration = 500;

  cumulativeVotesIn = resetCumulativeVotes();
  cumulativeVotesOut = resetCumulativeVotes();

  svg.selectAll('.vote-line-chart-round-' + roundIndex)
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

  svg.selectAll('.vote-line-round-' + roundIndex + '.vote-line-same')
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

  svg.selectAll('.vote-line-round-' + roundIndex + '.vote-line-different')
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

  svg.selectAll('.vote-line-finish-round-' + roundIndex)
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
var controlsD3 = d3.select('.controls');
var explanationD3 = d3.select('.explanation');
var allowClick = true;

var stages = [
  function() {
    svg.selectAll('.round-label-round-0, .guide-wrapper-round-0')
      .style('display', 'block')

    svg.selectAll('.annotation-0')
      .style('display', 'block')

    allowClick = false;
    showRoundChart(0, function() {
      allowClick = true;
    })

    explanationD3.text('Voters mark their first, second and third choice candidates on their ballots. If any candidate wins a majority of first choice votes, he or she is the winner.');
  },
  function() {
    svg.selectAll('.round-label-round-1, .guide-wrapper-round-1')
      .style('display', 'block')

    allowClick = false;
    showRoundSame(0, function() {
      allowClick = true;
    });

    controlsD3.transition()
      .ease('linear')
      .duration(500)
      .style('top', 330);
    explanationD3.text('Since no candidate reached the threshold, we continue to Round 2. The candidate with the least votes is eliminated.');
  },
  function() {
    allowClick = false;
    showRoundDifferent(0, function() {
      showRoundChart(1, function() {
        allowClick = true;
      });
    });
    explanationD3.text('Votes for eliminated candidates are redistributed based on voters\' second or third choice votes.');
  },
  function() {
    svg.select('.vote-line-round-0.vote-line-from-1-to-3')
      .classed('vote-line-active', true);
    explanationD3.text('For example, if Joe voted first choice for Candidate B and second choice for Candidate D, his vote would have moved to Candidate D.');
  },
  function() {
    svg.select('.vote-line-round-0.vote-line-from-1-to-3')
      .classed('vote-line-active', false);

    svg.selectAll('.round-label-round-2, .guide-wrapper-round-2')
      .style('display', 'block')

    allowClick = false;
    showRoundSame(1, function() {
      showRoundDifferent(1, function() {
        allowClick = true;
      });
    })

    controlsD3.transition()
      .ease('linear')
      .duration(500)
      .style('top', 510);
    explanationD3.text('Still, no candidate has reached the threshold. The candidate with the least votes is eliminated again, with his or her votes redistributed.');
  },
  function() {
    allowClick = false;
    showRoundFinish(1, function() {
      svg.selectAll('.guide-wrapper-round-2.guide-wrapper-candidate-2 rect,.guide-wrapper-round-2.guide-wrapper-candidate-2 line')
        .transition()
        .style('stroke', '#333')
      svg.selectAll('.vote-line-finish-candidate-2')
        .transition()
        .style('stroke-opacity', 0.7);
      allowClick = true;
    })
    explanationD3.text('With this redistribution, Candidate C reached the threshold, and thus is the winner.');
  },
  function() {
    svg.selectAll('.guide-wrapper-round-2.guide-wrapper-candidate-2 rect,.guide-wrapper-round-2.guide-wrapper-candidate-2 line')
      .style('stroke', '#999')
    svg.selectAll('.vote-line-finish-candidate-2')
      .style('stroke-opacity', 0.5);

    svg.selectAll('.vote-line-chart-round-0')
      .transition()
      .style('stroke-opacity', 0.7);
    explanationD3.text('Although Candidate A earned the most first choice votes, he lost the election.');
  },
  function() {
    svg.selectAll('.vote-line-chart-round-0')
      .style('stroke-opacity', 0.5);

    svg.selectAll('.vote-line-round-1.vote-line-from-3-to-2')
      .transition()
      .style('stroke-opacity', 0.7);
    explanationD3.text('Ranked choice voting promotes positive campaigns by giving incentives to "teaming up" with other candidates. Here, Candidate C benefited greatly from voters who also liked Candidate D.');
  }
];

function nextStage() {
  if (allowClick && currentStage + 1 < stages.length) {
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

})();

(function() {
var margin = { top: 10, right: 70, bottom: 20, left: 10 };
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
console.log(data);

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

})();


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

