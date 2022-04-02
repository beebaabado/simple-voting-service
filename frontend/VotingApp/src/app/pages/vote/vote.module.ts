import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VotePage } from './vote.page';
import { VotePageRoutingModule } from './vote-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    VotePageRoutingModule
  ],
  declarations: [VotePage]
})
export class VotePageModule {}
