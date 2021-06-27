import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Content } from 'src/content';
import { catchError } from 'rxjs/operators';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  allContent: Content[] = []
  topContent: Content[] = []
  displayedContent: Content[] = []
  showAllContent = true;
  gettingContent = false;
  activeContent: Content = { id: "", mediaType: "IMAGE", source: "", title: "", contentUrl: "", previewUrl: "", votes: 0, description: "", length: 0, aspectRatio: "", topic: "" };
  activeContentListIndex: number = 0;
  sendingVote = false;
  justVoted = false;
  private contentItems = 15;
  private pageNumber = 0;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getContent(this.contentItems, this.pageNumber)
      .subscribe(content => { this.allContent = content; this.displayedContent = this.allContent });
  }

  // HTTP Requests

  getContent(contentItems: number, pageNumber: number): Observable<Content[]> {
    return this.http.get<Content[]>(environment.apiUrl + "?page=" + pageNumber + "&pageSize=" + contentItems)
      .pipe(
        catchError(this.handleError<Content[]>('GET All Content'))
      );
  }

  getTopContent(): Observable<Content[]> {
    return this.http.get<Content[]>(environment.apiUrl + "?orderByVotesDesc=true&pageSize=10")
      .pipe(
        catchError(this.handleError<Content[]>('GET Top Content'))
      );
  }

  upvoteContent(contentId : string): Observable<Content> {
    return this.http.post<Content>(environment.apiUrl + "/" + contentId + "/actions/upvote", {})
      .pipe(
        catchError(this.handleError<Content>('Upvote Content'))
      );
  }

  downvoteContent(contentId : string): Observable<Content> {
    return this.http.post<Content>(environment.apiUrl + "/" + contentId + "/actions/downvote", {})
      .pipe(
        catchError(this.handleError<Content>('Downvote Content'))
      );
  }

  private handleError<T>(operation: string) {
    return (error: any): Observable<T> => {

      console.error("Error when executing " + operation); 

      return of({} as T);
    };
  }

  // FE Methods

  switchToAllContent() {
    this.showAllContent = true;
    this.displayedContent = this.allContent;
  }

  switchToTopContent() {
    this.displayedContent = [];
    this.showAllContent = false;
    if (this.topContent.length == 0) {
      this.getTopContent()
        .subscribe(content => {
          this.topContent = content;
          this.displayedContent = this.topContent;
        });
    } else {
      this.displayedContent = this.topContent;
    }
  }

  loadMoreContent() {
    this.gettingContent = true;
    this.pageNumber += 1;
    this.getContent(this.contentItems, this.pageNumber)
      .subscribe(content => { Array.prototype.push.apply(this.allContent, content); this.displayedContent = this.allContent; this.gettingContent = false; });
  }

  onModalClose() {
    this.activeContent = { id: "", mediaType: "", source: "", title: "", contentUrl: "", previewUrl: "", votes: 0, description: "", length: 0, aspectRatio: "", topic: "" };
  }

  incrementActiveImage() {
    if (this.activeContentListIndex === this.displayedContent.length - 1) {
      this.gettingContent = true;
      this.pageNumber += 1;
      this.getContent(this.contentItems, this.pageNumber)
        .subscribe(content => {
          Array.prototype.push.apply(this.allContent, content);
          this.displayedContent = this.allContent;
          this.activeContentListIndex += 1;
          this.activeContent = this.displayedContent[this.activeContentListIndex];
          this.gettingContent = false;
          this.justVoted = false;
        });
    } else {
      this.activeContentListIndex += 1;
      this.activeContent = this.displayedContent[this.activeContentListIndex];
      this.justVoted = false;
    }
  }

  decrementActiveImage() {
    if(this.activeContentListIndex > 0) {
      this.activeContentListIndex -= 1;
      this.activeContent = this.displayedContent[this.activeContentListIndex];
      this.justVoted = false;
    }
  }

  imageClick(c: Content, index: number) {
    this.activeContent = c;
    this.activeContentListIndex = index;
  }

  vote(content : Content, upvote: boolean) {
    this.sendingVote = true;
    if(upvote) {
      this.upvoteContent(content.id)
        .subscribe(newContent => {
          this.updateContentAfterVote(newContent);
        })
    } else {
      this.downvoteContent(content.id)
        .subscribe(newContent => {
          this.updateContentAfterVote(newContent);
        })
    }
  }

  private updateContentAfterVote(newContent: Content) {
    this.activeContent = newContent;
    this.displayedContent[this.activeContentListIndex] = newContent;
    if(this.showAllContent) {
      this.allContent[this.activeContentListIndex] = newContent;
    } else {
      this.topContent[this.activeContentListIndex] = newContent;
    }
    this.sendingVote = false;
    this.justVoted = true;
  }

}
