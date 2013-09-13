<?php readfile('http://www.startribune.com/templates/vh?vid=223669441&sosp=/politics'); ?>

<div class="graphic">

  <div class="introHed">How ranked choice voting works</div>

  </div>

  <div class="introbox">

    <div class="sampleBallot" style="margin-top:-30px;"><img src="http://stmedia.startribune.com/images/ballots.png" alt="" width="448" height="296"></div>

    <div class="labelHed">Vote for multiple candidates</div>
    <div class="globber">Voters mark their first, second and third choice of candidates on the ballot.</div>

    <div class="labelHed">An immediate majority wins . . .</div>
    <div class="globber">If any candidate receives a majority of first-choice votes, he or she is declared the winner. </div>

    <div class="labelHed">. . . otherwise elimination rounds begin</div>
    <div class="globber">The candidate with the fewest votes is eliminated, with his or her votes redistributed based on voters' second and third choices.</div>
    <div class="globber">This process continues until a candidate reaches more than 50 percent of the votes, or until only one candidate remains.</div>
    <div class="globber">A walkthrough of the process is below.</div>

    <div class="clear"></div>
  </div>

  <div class="navRule"><span aria-hidden="true" class="icon-arrow-down"></span></div>

  <div id="view1">
    <div class="labelHed">Votes transfer between candidates</div>
    <div class="chart-wrapper">

      <div class="chart">
        <div class="candidates">
          <div class="candidate candidate-0">
            <img src="vote_person1.png" alt="" />
            <div class="candidate-name">
              Mayoral Candidate A
            </div>
          </div>
          <div class="candidate candidate-1">
            <img src="vote_person2.png" alt="" />
            <div class="candidate-name">
              Mayoral Candidate B
            </div>
          </div>
          <div class="candidate candidate-2">
            <img src="vote_person3.png" alt="" />
            <div class="candidate-name">
              Mayoral Candidate C
            </div>
          </div>
          <div class="candidate candidate-3">
            <img src="vote_person4.png" alt="" />
            <div class="candidate-name">
              Mayoral Candidate D
            </div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="target-0"></div>
      </div>

      <div class="chart20">
        <div class="candidates candidates20">
          <div class="candidate candidate-20-1">
            <img src="vote_person1.png" alt="" />
          </div>
          <div class="candidate candidate-20-2">
            <img src="vote_person2.png" alt="" />
          </div>
          <div class="candidate candidate-20-3">
            <img src="vote_person3.png" alt="" />
          </div>
          <div class="candidate candidate-20-4">
            <img src="vote_person1.png" alt="" />
          </div>
          <div class="candidate candidate-20-5">
            <img src="vote_person4.png" alt="" />
          </div>
          <div class="candidate candidate-20-6">
            <img src="vote_person1.png" alt="" />
          </div>
          <div class="candidate candidate-20-7">
            <img src="vote_person2.png" alt="" />
          </div>
          <div class="candidate candidate-20-8">
            <img src="vote_person4.png" alt="" />
          </div>
          <div class="candidate candidate-20-9">
            <img src="vote_person4.png" alt="" />
          </div>
          <div class="candidate candidate-20-10">
            <img src="vote_person1.png" alt="" />
          </div>
          <div class="candidate candidate-20-11">
            <img src="vote_person3.png" alt="" />
          </div>
          <div class="candidate candidate-20-12">
            <img src="vote_person1.png" alt="" />
          </div>
          <div class="candidate candidate-20-13">
            <img src="vote_person3.png" alt="" />
          </div>
          <div class="candidate candidate-20-14">
            <img src="vote_person2.png" alt="" />
          </div>
          <div class="candidate candidate-20-15">
            <img src="vote_person4.png" alt="" />
          </div>
          <div class="candidate candidate-20-16">
            <img src="vote_person3.png" alt="" />
          </div>
          <div class="candidate candidate-20-17">
            <img src="vote_person1.png" alt="" />
          </div>
          <div class="candidate candidate-20-18">
            <img src="vote_person4.png" alt="" />
          </div>
          <div class="candidate candidate-20-19">
            <img src="vote_person2.png" alt="" />
          </div>
          <div class="candidate candidate-20-20">
            <img src="vote_person2.png" alt="" />
          </div>
          <div class="clear"></div>
        </div>
        <div class="target-2"></div>
      </div>

      <div class="controls">
        <div class="btn btn-previous btn-inactive no-select">Previous</div>
        <div class="btn btn-next no-select">Next</div>
        <div class="explanation"></div>
        <div class="clear"></div>
      </div>
    </div>
  </div>


<div class="navRule"><span aria-hidden="true" class="icon-arrow-down"></span></div>

  <div class="labelHed">Tallying votes is no easy task</div>
  <div class="globber">
    If no candidate wins a majority of votes in the first round, nearly all votes must be tallied before the redistribution calculations can begin.
  </div>
  <div class="col1">
    <p>
      To correctly determine how to redistribute votes from eliminated candidates, one must know the order of rankings on each ballot.
      With a small field of candidates, this is not very difficult. But the possible combinations of ballot rankings increases exponentially with more candidates.
    </p>
    <p>
      In the 2013 Minneapolis mayoral election, there will be 35 candidates on the ballot. Without considering a single write-in, this means there are 39,270 possible rankings.
    </p>
    <p>
      If no candidate wins an outright majority in this year's mayoral election, we may not know the result for a week or longer.
    </p>
  </div>
  <div class="col2">
    <div class="target-1"></div>
  </div>
  <div class="clear"></div>

</div>
<img class="header" src="footer.png" alt="footer" />

<script src="lib/d3.v3.js" type="text/javascript" charset="utf-8"></script>
<script src="lib/underscore-min.js" type="text/javascript" charset="utf-8"></script>
<script src="lib/jquery-1.4.4.min.js" type="text/javascript" charset="utf-8"></script>
<script src="data.js" type="text/javascript" charset="utf-8"></script>
<script src="data20.js" type="text/javascript" charset="utf-8"></script>
<script src="rcvChart.js" type="text/javascript" charset="utf-8"></script>
<script src="rcvComplexity.js" type="text/javascript" charset="utf-8"></script>
<script src="rcvChart20.js" type="text/javascript" charset="utf-8"></script>
<script src="base.js" type="text/javascript" charset="utf-8"></script>

<?php readfile('http://www.startribune.com/templates/vf?vid=223669441&sosp=/politics'); ?>

