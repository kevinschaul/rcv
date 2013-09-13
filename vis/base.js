var r = rcvChart.init('.target-0', data);
var r1 = rcvChart20.init('.target-2', data20);
r1.svg.selectAll('.round-label, .guide-wrapper').style('opacity', 0);
rcvComplexity.init();

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
        d3.select('.candidate-1')
          .classed('candidate-eliminated', true);
        isTransitioning = false;
      });
      explanation.text('Since no candidate reached the threshold, we continue to Round 2. The candidate with the least votes is eliminated.');
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 350);
    },
    function() {
      isTransitioning = true;
      r.undrawRoundAnnotations(1);
      r.undrawRoundBetween(0, true, function() {
        d3.select('.candidate-1')
          .classed('candidate-eliminated', false);
        isTransitioning = false;
      });
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 170);
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
        d3.select('.candidate-3')
          .classed('candidate-eliminated', true);
        r.drawRoundBetween(1, false, function() {
          isTransitioning = false;
        });
      });
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 530);
    },
    function() {
      isTransitioning = true;
      r.undrawRoundAnnotations(2);
      r.undrawRoundBetween(1, false, function() {
        d3.select('.candidate-3')
          .classed('candidate-eliminated', false);
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
        d3.select('.candidate-0')
          .classed('candidate-eliminated', true);
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
        d3.select('.candidate-0')
          .classed('candidate-eliminated', false);
        isTransitioning = false;
      });
      r.svg.selectAll('.vote-line-chart-round-2.vote-line-from-candidate-2')
        .style('stroke-opacity', 0.5);
      r.svg.select('.guide-wrapper-round-2.guide-wrapper-candidate-2 .guide')
        .style('stroke', '#999');
    }
  ], [
    function() {
      isTransitioning = true;
      d3.select('.chart')
        .transition()
        .duration(1000)
          .style('opacity', 0)
          .each('end', function() {
            d3.select('.chart')
              .style('display', 'none')

            d3.select('.chart20')
              .style('display', 'block')
              .transition()
              .duration(1000)
                .style('opacity', 1)
                .each('end', function() {
                  isTransitioning = false;
                })

            r1.svg.selectAll('.round-label-round-0, .guide-wrapper-round-0')
              .transition()
              .style('opacity', 1)
          })

      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 80);
      explanation.text('Ranked choice voting is relatively simple with only four candidates. Let\'s see what happens with 20.')
    },
    function() {
      // TODO
    }
  ], [
    function() {
     isTransitioning = true;
     r1.drawRoundChart(0, function() {
        r1.drawRoundAnnotations(1)
        d3.selectAll('.candidate-20-4, .candidate-20-6, .candidate-20-7, .candidate-20-10, .candidate-20-13, .candidate-20-15, .candidate-20-18, .candidate-20-19')
          .classed('candidate-eliminated', true);
        r1.drawRoundBetween(0, false, function() {
          r1.drawRoundAnnotations(2)
          r1.drawRoundChart(1, function() {
            d3.selectAll('.candidate-20-8, .candidate-20-11, .candidate-20-14, .candidate-20-20')
              .classed('candidate-eliminated', true);
            r1.drawRoundBetween(1, false, function() {
              r1.drawRoundAnnotations(3)
              r1.drawRoundChart(2, function() {
                d3.selectAll('.candidate-20-1, .candidate-20-16')
                  .classed('candidate-eliminated', true);
                r1.drawRoundBetween(2, false, function() {
                  r1.drawRoundAnnotations(4)
                  r1.drawRoundChart(3, function() {
                    d3.selectAll('.candidate-20-3, .candidate-20-5, .candidate-20-12')
                      .classed('candidate-eliminated', true);
                    r1.drawRoundBetween(3, false, function() {
                      r1.drawRoundAnnotations(5)
                      r1.drawRoundChart(4, function() {
                        d3.selectAll('.candidate-20-9')
                          .classed('candidate-eliminated', true);
                        r1.drawRoundBetween(4, false, function() {
                          r1.drawRoundAnnotations(6)
                          r1.drawRoundChart(5, function() {
                            d3.selectAll('.candidate-20-2')
                              .classed('candidate-eliminated', true);
                            r1.drawRoundBetween(5, function() {
                              isTransitioning = false;
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
      });
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 570);
    },
    function() {
      r1 = rcvChart20.init();
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', 80);
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

var btnPrevious = d3.select('.btn-previous');
var btnNext = d3.select('.btn-next');

var previousStage = function() {
  d3.select('.btn-inactive')
    .classed('btn-inactive', false)

  if (!isTransitioning) {
    if (currentStage - 1 >= 0) {
      unsetStage(currentStage);
      currentStage -= 1;
      setStage(currentStage);
    }
  }

  if (currentStage === 0) {
    btnPrevious.classed('btn-inactive', true)
  }
};

var nextStage = function() {
  d3.select('.btn-inactive')
    .classed('btn-inactive', false)

  if (!isTransitioning) {
    if (currentStage + 1 < stages.length) {
      currentStage += 1;
      setStage(currentStage);
    }
  }

  if (currentStage === stages.length - 1) {
    btnNext.classed('btn-inactive', true)
  }
};

btnPrevious.on('click', function() {
  previousStage();
});

btnNext.on('click', function() {
  nextStage();
});

setStage(0);

