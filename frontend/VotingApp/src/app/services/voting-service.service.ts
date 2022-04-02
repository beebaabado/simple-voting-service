import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Voter } from '../types/voter';
import { Question } from '../types/question';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class VotingServiceService {

  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json');

  private httpOptions = {
    headers: this.headers
  };

  private baseApiURL = environment.apiServerUrl + "/";
  private allVotersData = [];  
  
  constructor(
    private http: HttpClient){
    console.log('VotingService Service started... ');
  }

  // request list of voters
  getVoters(): Observable<Voter[]>{
    console.log("VotingService::getVoters");

    //this.allVotersData=[];
    const voterURL = this.baseApiURL + "voters";
    console.log("HTTP CLIENT URL: ", voterURL);
    // return this.http.get(voterURL).pipe(
    //   tap(data => console.log("VotingService voters data", data)),  // interecept stream to print data 
    //   map(data=>{this.allBeersData.push(data[0]);  // if you return this line get length only which = 1
    //               return this.allBeersData;}));  // just return data

     return this.http.get<Voter[]>(voterURL).pipe(
       tap(data => console.log("VotingService voters data: ", data)),
       map(data => {return data;}));
  }

  // request one voter
  getVoter(id:any): Observable<Voter>{
    console.log("VotingService::getVoter");

    //this.allVotersData=[];
    const voterURL = this.baseApiURL + "voters/" + id;
    console.log("HTTP CLIENT URL: ", voterURL);
    return this.http.get<Voter>(voterURL).pipe(
      tap(data => console.log("VotingService voter data: ", data)),
      map(data => {return data;}));
  }

  // save Voter
  saveVoter(voter_id:any, question_id:any): Observable<Voter> {
    const voterURL = this.baseApiURL + "voters"; //+ "?id=" + voter_id + "&" + "question=" + question_id;
    const body = {id: voter_id, question: question_id};
    console.log("HTTP CLIENT URL: ", voterURL);
    return this.http.put<Voter>(voterURL, body).pipe(
      tap(data => console.log("VotingService voter update: ", data)),
      map(data => {return data;}));
  }
   
  login(voterName:String){
    
    const voterURL = this.baseApiURL + "voters";
    const body = {name: voterName};
    console.log("HTTP CLIENT URL: ",voterURL, body, this.httpOptions);
    return this.http.post(voterURL, body, this.httpOptions);
  }

  getQuestions(){
    console.log("VotingServicer::getQuestions");
    const questionURL = this.baseApiURL + "questions";
    console.log("HTTP CLIENT URL: ", questionURL);
    return this.http.get(questionURL).pipe(
       tap(data => console.log("VotingService questions data: ", data)),
       map(data => {return data;}));
  }

  getUnansweredQuestions(voter_id:any): Observable<Question[]>{
    console.log("VotingServicer::getQuestions");
    const questionURL = this.baseApiURL + "questions/" + voter_id;
    console.log("HTTP CLIENT URL: ", questionURL);
    return this.http.get<Question[]>(questionURL).pipe(
       tap(data => console.log("VotingService unanswered questions by voter data: ", data)),
       map(data => {return data;}));
  }

  saveVote(vote:any, question_id:any): Observable<Question[]>{
    console.log("VotingServicer::saveVote");
    let countPath = "";

    if (vote === 'y')
        countPath = "countYes"
    else 
        countPath = "countNo"
    const questionURL = this.baseApiURL + "questions/" + countPath + "/" + question_id;
    console.log("HTTP CLIENT URL: ", questionURL);
    return this.http.get<Question[]>(questionURL).pipe(
       tap(data => console.log("VotingService unanswered questions by voter data: ", data)),
       map(data => {return data;}));
  }

  getStats(question_id:any) {
    const questionURL = this.baseApiURL + "questions/stats/" + question_id;
    console.log("HTTP CLIENT URL: ", questionURL);
    return this.http.get(questionURL);
  }

}
