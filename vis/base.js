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
      explanation.html('If any candidate wins a majority of first choice votes, he or she is the winner. Candidate A came close, but did not reach the threshold.');
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
      $('html, body').animate({
        scrollTop: $('#view1').offset().top
      }, 1000);
      r.drawRoundAnnotations(1);
      r.drawRoundBetween(0, true, function() {
        d3.select('.candidate-1')
          .classed('candidate-eliminated', true);
        isTransitioning = false;
      });
      explanation.html('Since no candidate won a majority, we continue to Round 2. The candidate with the fewest votes is eliminated.');
      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', '380px');
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
        .style('top', '200px');
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
      explanation.html('Votes for eliminated candidates are redistributed based on voters&rsquo; second or third choice votes.');
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
      explanation.html('For example, if a voter selected Candidate B as her first choice and Candidate D as her second, her vote would have moved to Candidate D.');
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
      explanation.html('Still, no candidate has reached the threshold. The candidate with the least votes is eliminated again, with his or her votes redistributed.');
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
        .style('top', '560px');
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
        .style('top', '380px');
    }
  ], [
    function() {
      isTransitioning = true;
      explanation.html('With this redistribution, Candidate C reached the threshold and is the winner.');
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

      $('html, body').animate({
        scrollTop: $('#view1').offset().top
      }, 1000);

      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', '110px');
      explanation.html('Ranked-choice voting is relatively simple with only four candidates. Let&rsquo;s see what happens with 20.')
    },
    function() {
      isTransitioning = true;
      d3.select('.chart20')
        .transition()
        .duration(1000)
          .style('opacity', 0)
          .each('end', function() {
            d3.select('.chart')
              .style('display', 'none')

            d3.select('.chart')
              .style('display', 'block')
              .transition()
              .duration(1000)
                .style('opacity', 1)
                .each('end', function() {
                  isTransitioning = false;
                })
          })

      controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', '560px');
    }
  ], [
    function() {
     explanation.html('')
     isTransitioning = true;
     controls
        .transition()
        .ease('linear')
        .duration(1000)
        .style('top', '570px');

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
                            isTransitioning = false;
                            explanation.html('There will be 35 candidates on this year&rsquo;s Minneapolis mayoral ballot, meaning the results will likely be even more complex.')
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
    },
    function() {
      isTransitioning = true;
      d3.selectAll('.candidates20 .candidate-eliminated')
        .classed('candidate-eliminated', false);
      r1.undrawRoundChart(5, function() {
         r1.undrawRoundAnnotations(5)
         r1.undrawRoundBetween(4, false, function() {
           r1.undrawRoundAnnotations(4)
           r1.undrawRoundChart(4, function() {
             r1.undrawRoundBetween(3, false, function() {
               r1.undrawRoundAnnotations(3)
               r1.undrawRoundChart(3, function() {
                 r1.undrawRoundBetween(2, false, function() {
                   r1.undrawRoundAnnotations(2)
                   r1.undrawRoundChart(2, function() {
                     r1.undrawRoundBetween(1, false, function() {
                       r1.undrawRoundAnnotations(1)
                       r1.undrawRoundChart(1, function() {
                         r1.undrawRoundBetween(0, false, function() {
                           r1.undrawRoundChart(0, function() {
                             isTransitioning = false;
                           })
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
  if (currentStage === stages.length - 1) {
    btnNext.classed('btn-inactive', true)
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

  if (currentStage === 0) {
    btnPrevious.classed('btn-inactive', true)
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

document.onkeyup = function(e) {
  if (e && e.keyCode) {
    switch (e.keyCode) {
      case 37:
        previousStage();
        break;
      case 39:
        nextStage();
        break;
    }
  }
}

d3.selectAll('.navRule').on('click', function() {
  var view = d3.select(this).attr('data-view');
  $('html, body').animate({
    scrollTop: $('#view' + view).offset().top
  }, 1000);
});
setStage(0);

