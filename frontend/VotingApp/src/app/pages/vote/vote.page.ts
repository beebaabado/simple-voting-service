import { Component } from '@angular/core';
import { VotingServiceService } from '../../services/voting-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote',
  templateUrl: 'vote.page.html',
  styleUrls: ['vote.page.scss']
})
export class VotePage {

  questions = [];
  selectedQuestion = 1; 
  stats = [];

  constructor(
    private voterService: VotingServiceService,
    private router: Router){
        this.getQuestions();
    }

    getQuestionStats(){
      this.stats = [];
      this.voterService.getStats(this.selectedQuestion).subscribe(result => {
          console.log("Stat info for question: ", result);
          let stat = result;
          this.stats.push(stat);
      })
      console.log("Stats: ", this.stats)
      this.displayStats();
    }
    
    getQuestions(){
      this.questions = []
      this.voterService.getQuestions().forEach((question) => {
        var newQuestion = {}
        newQuestion = question;
        this.questions.push(newQuestion);
      });
      console.log("Questions list: ", this.questions);
      this.buildQuestionList();
    }
  
    selectQuestionChange(){
      console.log("Selected Question id: ", this.selectedQuestion);
    }

    gotoVoterPage() {
      this.router.navigate(['/tabs/vote']);
    }

    // issues with data binding!! so just build list here
    // 
    buildQuestionList() {

      var selectList = document.getElementById("questions");
      console.log(selectList);
        this.questions.forEach( question => {
          var option = document.createElement("option");
          option.value = question.id;
          option.innerHTML = question.description;
          selectList.appendChild(option);
        }) 
      }
    
    displayStats(){
      var statsList = document.getElementById("display-stats");
      Object.keys(this.stats).forEach((stat, index) => { 
        console.log(`${index}: ${stat}`);
      })
    }
  }