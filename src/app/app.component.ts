import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Content } from 'src/content';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'RBMH Content Browser';
  allContent: Content[] = []
  topContent: Content[] = []
  displayedContent: Content[] = []
  showAllContent = true;
  gettingMoreContent = false;
  activeContent: Content = { id: "", mediaType: "IMAGE", source: "", title: "", contentUrl: "", previewUrl: "", votes: 0, description: "", length: 0, aspectRatio: "", topic: "" };
  activeContentListIndex: number = 0;
  private contentItems = 15;
  private pageNumber = 0;
  private url = 'http://localhost:8080/content'

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getContent(this.contentItems, this.pageNumber)
      .subscribe(content => { this.allContent = content; this.displayedContent = this.allContent });
  }

  switchToAllContent() {
    this.showAllContent = true;
    this.displayedContent = this.allContent;
  }

  getContent(contentItems: number, pageNumber: number): Observable<Content[]> {
    return this.http.get<Content[]>(this.url + "?page=" + pageNumber + "&pageSize=" + contentItems)
      .pipe(
        catchError(this.handleError<Content[]>('getContent', []))
      );
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
      // this.topContent = []
      // REFRESH functionality
    }
  }

  getTopContent(): Observable<Content[]> {
    return this.http.get<Content[]>(this.url + "?orderByVotesDesc=true&pageSize=10")
      .pipe(
        catchError(this.handleError<Content[]>('getContent', []))
      );
  }

  loadMoreContent() {
    this.gettingMoreContent = true;
    this.pageNumber += 1;
    this.getContent(this.contentItems, this.pageNumber)
      .subscribe(content => { Array.prototype.push.apply(this.allContent, content); this.displayedContent = this.allContent; this.gettingMoreContent = false; });
  }

  onModalClose() {
    this.activeContent = { id: "", mediaType: "", source: "", title: "", contentUrl: "", previewUrl: "", votes: 0, description: "", length: 0, aspectRatio: "", topic: "" };
  }

  incrementActiveImage() {
    if (this.activeContentListIndex === this.displayedContent.length - 1) {
      this.gettingMoreContent = true;
      this.pageNumber += 1;
      this.getContent(this.contentItems, this.pageNumber)
        .subscribe(content => {
          Array.prototype.push.apply(this.allContent, content);
          this.displayedContent = this.allContent;
          this.activeContentListIndex += 1;
          this.activeContent = this.displayedContent[this.activeContentListIndex];
          this.gettingMoreContent = false;
        });
    } else {
      this.activeContentListIndex += 1;
      this.activeContent = this.displayedContent[this.activeContentListIndex];
    }
  }

  decrementActiveImage() {
    if(this.activeContentListIndex > 0) {
      this.activeContentListIndex -= 1;
      this.activeContent = this.displayedContent[this.activeContentListIndex];
    }
  }

  imageClick(c: Content, index: number) {
    this.activeContent = c;
    this.activeContentListIndex = index;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
