import { Component, Query } from '@angular/core';
import { VotingServiceService } from '../../services/voting-service.service';
import { Voter } from '../../types/voter';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { Question } from 'src/app/types/question';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss']
})
export class LoginPage {

  loginName = "";
  voter:any;
  questions = [];
  hideName:boolean = true;
  hideQuestions:boolean = true;
  hideVoting:boolean = true;
  hideYesNo:boolean = true;
  loggedIn:boolean = false;
  selectedQuestion = 0;
  message:string = "Look for messages here..."

  constructor(
    private voterService: VotingServiceService,
    private router: Router){
        // get questions and preload the question list
        this.getQuestions();
    }

   
    
    displayMessage(message:string) {
      document.getElementById("display-message").innerHTML = message;
    }

    login(){
      console.log("logging in:" ,this.loginName);
      if (this.loginName === "") {
         this.displayMessage("Please Enter name.");
         return;
      }

      this.voterService.login(this.loginName).subscribe(result => {
          console.log("Voter info: ", result);
          this.voter = result;
          console.log(this.voter);
          this.hideName = false;
          this.loggedIn = true;
          this.hideVoting = false;
          return result;
        });
      }

    logout(){
      //reset the page
      this.loginName = ""
      this.loggedIn = false;
      this.voter = {};
      this.hideName = true;
      this.hideQuestions = true;
      this.hideVoting = true;
      this.hideYesNo = true;
      this.displayMessage("Thanks for voting!");
    }

    getVoter(id:any){
      this.voterService.getVoter(id).subscribe(result => (
          console.log("Voter with list of unansered questions: ", result)
      ));
    }
    
    saveVote(vote:any){
      this.voter.questions.push(this.selectedQuestion);
      this.voterService.saveVote(vote, this.selectedQuestion);
      this.voterService.saveVoter(this.voter.id, this.selectedQuestion);
      this.hideYesNo = true;
      this.displayMessage("Your vote has been recorded:  " + vote);

      // TODO: add selectedQueston id to voters question list.
    }
    
    saveVoter(voter_id, question_id){
      this.voterService.saveVoter(this.voter.id, question_id);
    }
    
    selectQuestionChange(id){
      console.log("Selected Question id: ", this.selectedQuestion);
      this.hideYesNo = false;
    }
     
    startVoting() {
       if (this.questions.length == 0)
          this.getQuestions();
      // this.voterService.getQuestions().forEach((question) => {
      //   var newQuestion = {}
      //   newQuestion = question;
      //   this.questions.push(newQuestion);
      // });
      this.hideQuestions = false;
      console.log("Questions list: ", this.questions);

    }
    
    getQuestions(){
      this.questions = []
      this.voterService.getQuestions().forEach((question) => {
        var newQuestion = {}
        newQuestion = question;
        this.questions.push(newQuestion);
      });
      console.log("Questions list: ", this.questions);
    }
    // just for debug
    loginNameInputChange(){
      //console.log("Login Name: ", this.loginName)
    }

    // gotoVoterPage() {
    //   this.router.navigate(['/tabs/vote']);
    // }
  
    
}
