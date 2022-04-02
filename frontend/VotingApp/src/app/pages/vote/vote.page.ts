import { Component } from '@angular/core';
import { VotingServiceService } from '../../services/voting-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vote',
  templateUrl: 'vote.page.html',
  styleUrls: ['vote.page.scss']
})
export class VotePage {

  private questions = [];

  constructor(
    private voterService: VotingServiceService,
    private router: Router){
        this.getQuestions();
    }


    getQuestions(){
      this.voterService.getQuestions().subscribe(result => (
          console.log("Voter info: ", result)
      ));
    }

    gotoVoterPage() {
      this.router.navigate(['/tabs/vote']);
    }
}
