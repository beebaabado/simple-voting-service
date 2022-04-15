import { Component } from '@angular/core';
import { VotingServiceService } from '../../services/voting-service.service';
import { Router } from '@angular/router';
import { Stats } from 'src/app/types/stats';
import { Question } from 'src/app/types/question';

@Component({
  selector: 'app-vote',
  templateUrl: 'vote.page.html',
  styleUrls: ['vote.page.scss']
})
export class VotePage {

  questions = [];
  selectedQuestion = 0; 
  selectedQuestionId = 0;
  stats:Stats;

  constructor(
    private voterService: VotingServiceService,
    private router: Router){
        this.getQuestions();
    }

    getQuestionStats(){
      this.stats = new Stats();
      this.voterService.getStats(this.selectedQuestion).subscribe(
        (result) => {
          this.stats.counts_no = result.counts_no;
          this.stats.counts_yes = result.counts_yes;
          this.stats.percent_no = result.percent_no;
          this.stats.percent_yes = result.percent_yes;
          this.stats.total_votes = result.total_votes;
          this.stats.id = result.id;
          console.log("Stat info for question: ",  this.stats);
      },
       (err) => { console.log("Get question stats error: ", err)},
       () => { 
          console.log("Get question stats: done")
          //console.log("Stats: ",this.stats);
          this.displayStats();}
      );
      
    }
    
    getQuestions(){
      this.questions = []
      this.voterService.getQuestions().subscribe(result => {
          result.forEach (question => {
          var newQuestion = new Question();
        // newQuestion = question;
          newQuestion.id = question.id;
          newQuestion.counts_no = question.counts_no;
          newQuestion.counts_yes = question.counts_yes;
          newQuestion.description = question.description;
          this.questions.push(newQuestion);

        })
      });
      console.log("Questions list: ", this.questions);
      //this.buildQuestionList();
    }
  
    selectQuestionChange(event: any){
      console.log("Selected Question: ", this.selectedQuestion);
      this.selectedQuestionId = event.target.value;
      console.log("Selected Question id: ", this.selectedQuestionId);
    }

    gotoVoterPage() {
      this.router.navigate(['/tabs/vote']);
    }
    
    displayStats(){
      var statsList = document.getElementById("display-stats");
      console.log("display stats: ", Object.keys(this.stats));
      statsList.innerHTML = '';
      console.log("UGH: ", this.stats.counts_no);
      Object.keys(this.stats).forEach( (key) => {
        console.log("key: ", key)
         if (key != "id") {
          var  li = document.createElement("li");
          li.innerHTML = key + ": " + this.stats[key]; 
          statsList.appendChild(li);
         }
      })
    }

  }