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
  selectedQuestionId = 0;
  message:string = "Look for messages here..."
  
  vote_values= { 
    "y": "YES", 
    "n": "NO"
  }

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

      this.voterService.login(this.loginName).subscribe(
        (result) => {
          console.log("Voter info: ", result);
          this.voter = result;
          console.log(this.voter);
          this.hideName = false;
          this.loggedIn = true;
          this.hideVoting = false;
          return result;
        },
        (err) => { console.log("Login Voter error: ", err)},
        () => {
                console.log("Login Voter: done");
                this.disableVoterQuestions();
              }
       );
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
      this.enableQuestions();
      this.selectedQuestion = 0;
      this.displayMessage("Thanks for voting!");
    }

    getVoter(id:any){
      this.voterService.getVoter(id).subscribe(
        (result) => { console.log("Voter with list of unansered questions: ", result) },
        (err) => { console.log("Get Voter error: ", err)},
          () => {console.log("Get Voter: done")}
      );
    }
    
    saveVote(vote:any){
      this.voter.questions.push(this.selectedQuestionId);
      this.voterService.saveVote(vote, this.selectedQuestion).subscribe(
        (result) => {
          this.displayMessage("Your vote for question " + result['description'] 
                                  + ": " + this.vote_values[vote] + " has been recorded.")},
          (err) => { 
              console.log("Save Vote error: ", err)
              this.displayMessage("Oops! There was a problem saving your vote.  Please try again.")},
          () => {
            console.log("Save Vote: done");
            this.disableQuestions();}
      );
      
      // TODO On Database side need to check for trying to save duplicate question
      this.saveVoter(this.voter.id, this.selectedQuestionId);
      this.hideYesNo = true;
      this.disableQuestions(); 
    }
    
    disableQuestions() {
        let options = document.getElementById("display-questions").children;
        console.log("disable selected question: ", this.selectedQuestion);
        options.item(this.selectedQuestion).setAttribute("disabled", "disabled");

        if (this.voter.questions.length >= this.questions.length) {
          this.displayMessage("All questions have been answered.  Thank you for voting.");
          this.hideVoting = true;
        }
    }

    disableVoterQuestions() {
      let options = document.getElementById("display-questions").children;
      let sel_id = 0
      this.voter.questions.forEach (question_id => {
        console.log("disable question with id: ",question_id);
        for (let i = 0; i < options.length; i++) {
          if (options[i].getAttribute('value') == question_id) {
            options[i].setAttribute("disabled", "disabled");
          }
      }});
      
      if (this.voter.questions.length >= this.questions.length) {
        this.displayMessage("All questions have been answered.  Thank you for voting.");
        this.hideVoting = true;
      }  
    }
    
    enableQuestions() {
      let options = document.getElementById("display-questions").children;
      console.log("disable selected question: ", this.selectedQuestion);
      // skip first item...placeholder
      for (let i = 1; i < options.length; i++) { 
        options.item(i).setAttribute("disabled", "");
      }    
    }

    saveVoter(voter_id, question_id){    
      this.voterService.saveVoter(voter_id, question_id).subscribe(
        (result) => {
          console.log("Save Voter results: ", result);},
        (err) => { console.log("Save Voter error: ", err)},
        () => {console.log("Save Voter: done")}
        );
    }
    
    selectQuestionChange(event: any){
      console.log("Selected Question: ", this.selectedQuestion);
      this.selectedQuestionId = event.target.value;
      this.hideYesNo = false;
      console.log("Selected Question id: ", this.selectedQuestionId);
    }
     
    startVoting() {
       if (this.questions.length == 0)
          this.getQuestions();
      this.hideQuestions = false;
      console.log("Questions list: ", this.questions);

    }
    
    getQuestions(){
      this.questions = []
      this.voterService.getQuestions().subscribe(
        (result) => {
            result.forEach (question => {
            var newQuestion = new Question();
          // newQuestion = question;
            newQuestion.id = question.id;
            newQuestion.counts_no = question.counts_no;
            newQuestion.counts_yes = question.counts_yes;
            newQuestion.description = question.description;
            this.questions.push(newQuestion);})},
        (err) => { console.log("Get Questions error: ", err)},
        () => {console.log("Get Questions: done")}
      );   
    
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
