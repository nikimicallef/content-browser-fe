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
  content: Content[] = []
  private url = 'http://localhost:8080/content'

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getContent()
    .subscribe(content => this.content = content);
  }

  getContent(): Observable<Content[]> {
    return this.http.get<Content[]>(this.url)
      .pipe(
        catchError(this.handleError<Content[]>('getContent', []))
      );
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
