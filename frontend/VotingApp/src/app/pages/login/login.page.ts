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
  loggedIn:boolean = false;
  selectedQuestion: any;
  message:string = "Look for messages here..."

  constructor(
    private voterService: VotingServiceService,
    private router: Router){
    }

    login(){
      console.log("logging in:" ,this.loginName);
      if (this.loginName === "") {
         document.getElementById("message").innerHTML = "Please enter name.</p>";
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
    }

    getVoter(id:any){
      this.voterService.getVoter(id).subscribe(result => (
          console.log("Voter with list of unansered questions: ", result)
      ));
    }
    
    saveVote(vote:any){
      this.voter.questions.push(this.selectedQuestion);
      this.voterService.saveVote(vote, this.selectedQuestion);

    }
    
    saveVoter(voter_id, question_id){
      
      this.voterService.saveVoter(this.voter.id, question_id);
    }
    
    selectQuestionChange(){
      console.log("Selected Question id: ", this.selectedQuestion);
    }
     
    startVoting() {
      let questions = this.voterService.getQuestions();
      if (questions != null)
        questions.forEach((question) => {
          this.questions.push({id:question["id"], description: question["description"]});
        })
      this.hideQuestions = false;
    }
    
    // just for debug
    loginNameInputChange(){
      //console.log("Login Name: ", this.loginName)
    }

    // gotoVoterPage() {
    //   this.router.navigate(['/tabs/vote']);
    // }
  
    
}
