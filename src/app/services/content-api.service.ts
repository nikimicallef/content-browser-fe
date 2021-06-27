import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Content } from 'src/app/models/content';
import { randomImageContent } from '../models/generators/content.generator';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ContentApiService {

    constructor(private http: HttpClient) {
    }

    /**
     * Retrieve content with paging params
     * 
     * @param pageSize number of items within a page
     * @param pageNumber to revtrieve
     * @returns content returned from the backend
     */
    getContent(pageSize: number, pageNumber: number): Observable<Content[]> {
        return this.http.get<Content[]>(environment.apiUrl + "?page=" + pageNumber + "&pageSize=" + pageSize)
            .pipe(
                catchError(this.handleError<Content[]>('GET All Content', []))
            );
    }

    /**
     * Retrieves content returned in descending order of votes
     * 
     * @param numberOfEntriesReturned number of entries to be returned by the backend
     * @returns content ordered by votes in descending order
     */
    getTopContent(numberOfEntriesReturned: number): Observable<Content[]> {
        return this.http.get<Content[]>(environment.apiUrl + "?orderByVotesDesc=true&pageSize=" + numberOfEntriesReturned)
            .pipe(
                catchError(this.handleError<Content[]>('GET Top Content', []))
            );
    }

    /**
     * Adds one to the number of votes of the content
     * 
     * @param contentId of the content to upvote
     * @returns updated content entity
     */
    upvoteContent(contentId: string): Observable<Content> {
        return this.http.post<Content>(environment.apiUrl + "/" + contentId + "/actions/upvote", {})
            .pipe(
                catchError(this.handleError<Content>('Upvote Content', randomImageContent()))
            );
    }

    /**
     * Decreases votes on a particular piece of content by 1
     * 
     * @param contentId of the content to downvote
     * @returns updated content entity
     */
    downvoteContent(contentId: string): Observable<Content> {
        return this.http.post<Content>(environment.apiUrl + "/" + contentId + "/actions/downvote", {})
            .pipe(
                catchError(this.handleError<Content>('Downvote Content', randomImageContent()))
            );
    }

    /**
     * If request does not return a 200, log in consoleand return an empty value
     * 
     * @param operation which failed
     * @param result to return
     * @returns observable with the requested object
     */
    private handleError<T>(operation: string, result?: T) {
        return (): Observable<T> => {

            console.error("Error when executing " + operation);

            return of(result as T);
        };
    }
}