var rcvChart = {
  /* Options */
  margin: { top: 10, right: 10, bottom: 10, left: 30 },
  baseWidth: 960,
  baseHeight: 450,

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

    self.width = self.baseWidth - self.margin.left - self.margin.right;
    self.height = self.baseHeight - self.margin.top - self.margin.bottom;
    self.candidateWidth = self.width / self.numberOfCandidates;

    for (var i = 0; i < self.numberOfCandidates; i++) {
      self.candidatesInContention.push(true);
    }

  },

  initSvg: function() {
    var self = this;

    self.svg = d3.select(self.id).append('svg')
      .attr('width', self.baseWidth)
      .attr('height', self.baseHeight)
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

          if (roundIndex === 0 && candidateIndex === 0) {
            guideWrapper.append('text')
              .attr('class', 'threshold-label')
              .attr('x', ((candidateIndex *
                  (self.width / self.numberOfCandidates)) + (self.hPadding / 2) +
                  self.x(.5)) + 4)
              .attr('y', (roundIndex * self.vPadding) + (self.rowHeight / 2)
                   + 4)
              .text('50%')
          }
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
        .data(self.data[roundIndex][0])
          .enter().append('path')
        .attr('class', function(d) {
          var s = 'vote-line vote-line-chart-round-' + roundIndex;
          s += ' vote-line-from-candidate-' + d.from;
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

          if (roundIndex === 0) {
            lineData.push(beginPoint);
            lineData.push(endPoint);
          } else {
            lineData.push(beginPoint);
            lineData.push(beginPoint);
          }

          cumulativeVotesIn[d.to] += d.votes / self.totalVotes;
          cumulativeVotesOut[d.from] += d.votes / self.totalVotes;

          return self.line(lineData);
        })
        .on('mouseover', self.mouseover)
        .on('mouseout', self.mouseout)

      // If not the last round, draw each vote line
      if (roundIndex + 1 < self.numberOfRounds) {
        var cumulativeVotesInitialIn = self.getFreshCumulativeVotes();
        var cumulativeVotesInitialOut = self.getFreshCumulativeVotes();
        var cumulativeVotesIn = self.getFreshCumulativeVotes();
        var cumulativeVotesOut = self.getFreshCumulativeVotes();

        self.svg.append('g')
          .attr('class', 'round round-' + roundIndex)
          .selectAll('path')
          .data(self.data[roundIndex][1])
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
          .on('mouseout', self.mouseout)
      }

    });
  },

  drawRoundChart: function(roundIndex, callback) {
    var self = this;
    var callbackCalled = false;

    var cumulativeVotesIn = self.getFreshCumulativeVotes();
    var cumulativeVotesOut = self.getFreshCumulativeVotes();

    self.svg.selectAll('.vote-line-chart-round-' + roundIndex)
      .interrupt()
      .transition()
      .ease('linear')
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
      })
      .each('end', function() {
        if (callback && !callbackCalled) {
          callback();
          callbackCalled = true;
        }
      });
  },

  undrawRoundChart: function(roundIndex, callback) {
    var self = this;
    var callbackCalled = false;

    var cumulativeVotesIn = self.getFreshCumulativeVotes();
    var cumulativeVotesOut = self.getFreshCumulativeVotes();

    self.svg.selectAll('.vote-line-chart-round-' + roundIndex)
      .interrupt()
      .transition()
      .ease('linear')
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
      })
      .each('end', function() {
        if (callback && !callbackCalled) {
          callback();
          callbackCalled = true;
        }
      });
  },

  drawRoundBetween: function(roundIndex, original, callback) {
    var self = this;
    var callbackCalled = false;

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
      .ease('linear')
      .duration(1500)
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
      })
      .each('end', function() {
        if (callback && !callbackCalled) {
          callback();
          callbackCalled = true;
        }
      });
  },

  undrawRoundBetween: function(roundIndex, original, callback) {
    var self = this;
    var callbackCalled = false;

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
      .ease('linear')
      .duration(1500)
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
      .each('end', function() {
        if (callback && !callbackCalled) {
          callback();
          callbackCalled = true;
        }
      });
  },

  drawRoundAnnotations: function(round) {
    this.svg.selectAll('.round-label-round-' + round +
        ', .guide-wrapper-round-' + round)
      .transition()
      .ease('linear')
      .duration(500)
      .style('opacity', 1);
  },

  undrawRoundAnnotations: function(round) {
    this.svg.selectAll('.round-label-round-' + round +
        ', .guide-wrapper-round-' + round)
      .transition()
      .ease('linear')
      .duration(500)
      .style('opacity', 0);
  },

  mouseover: function(d) {
    d3.select(this)
      .classed('vote-line-active', true);
  },

  mouseout: function(d) {
    d3.select(this)
      .classed('vote-line-active', false);
  },

  getFreshCumulativeVotes: function() {
    var self = this;

    var _cumulativeVotes = [];
    for (var i = 0; i < self.numberOfCandidates; i++) {
      _cumulativeVotes.push(0);
    }
    return _cumulativeVotes;
  }

};

