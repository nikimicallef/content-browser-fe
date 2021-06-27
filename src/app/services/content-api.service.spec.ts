import { ContentApiService } from "./content-api.service";
import { of, defer } from 'rxjs';
import { randomContentList, randomImageContent } from "../models/generators/content.generator";
import { Content } from "../models/content";
import { HttpErrorResponse } from "@angular/common/http"
import { environment } from './../../environments/environment';

describe('ContentApiService', () => {
    let httpClientSpy: { get: jasmine.Spy, post: jasmine.Spy };
    let service: ContentApiService;

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
        service = new ContentApiService(httpClientSpy as any);
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    describe('GET /content', () => {
        it('should return expected content (HttpClient called once)', (done: DoneFn) => {
            const expectedResponse: Content[] = randomContentList();
            const contentItems = 10;
            const pageNumber = 1;

            httpClientSpy.get.and.returnValue(of(expectedResponse));

            service.getContent(contentItems, pageNumber).subscribe(
                content => {
                    expect(content).toEqual(expectedResponse, 'Content response is not as expected');
                    done();
                },
                done.fail
            );
            expect(httpClientSpy.get.calls.count()).toBe(1, 'Only one call is expected');
            expect(httpClientSpy.get.calls.allArgs()[0][0]).toBe(environment.apiUrl + "?page=" + pageNumber + "&pageSize=" + contentItems);
        });

        it('should return an error when the server returns a 404', (done: DoneFn) => {
            const errorResponse = new HttpErrorResponse({
                error: '404 error', status: 404, statusText: 'Not Found'
            });
            const contentItems = 10;
            const pageNumber = 1;

            httpClientSpy.get.and.returnValue(defer(() => Promise.reject(errorResponse)));

            service.getContent(contentItems, pageNumber).subscribe(
                content => {
                    expect(content).toEqual([]);
                    done()
                }
            );
        });
    });

    describe('GET top /content', () => {
        it('should return expected content (HttpClient called once)', (done: DoneFn) => {
            const expectedResponse: Content[] = randomContentList();
            const numberOfEntriesReturned = 2;

            httpClientSpy.get.and.returnValue(of(expectedResponse));

            service.getTopContent(numberOfEntriesReturned).subscribe(
                content => {
                    expect(content).toEqual(expectedResponse, 'Content response is not as expected');
                    done();
                },
                done.fail
            );
            expect(httpClientSpy.get.calls.count()).toBe(1, 'Only one call is expected');
            expect(httpClientSpy.get.calls.allArgs()[0][0]).toBe(environment.apiUrl + "?orderByVotesDesc=true&pageSize=" + numberOfEntriesReturned);
        });

        it('should return an error when the server returns a 404', (done: DoneFn) => {
            const errorResponse = new HttpErrorResponse({
                error: '404 error', status: 404, statusText: 'Not Found'
            });
            const numberOfEntriesReturned = 2;

            httpClientSpy.get.and.returnValue(defer(() => Promise.reject(errorResponse)));

            service.getTopContent(numberOfEntriesReturned).subscribe(
                content => {
                    expect(content).toEqual([]);
                    done()
                }
            );
        });
    });

    describe('POST /actions/upvote', () => {
        it('should return expected content (HttpClient called once)', (done: DoneFn) => {
            const expectedResponse: Content = randomImageContent();
            const contentId = expectedResponse.id;

            httpClientSpy.post.and.returnValue(of(expectedResponse));

            service.upvoteContent(contentId).subscribe(
                content => {
                    expect(content).toEqual(expectedResponse, 'Content response is not as expected');
                    done();
                },
                done.fail
            );
            expect(httpClientSpy.post.calls.count()).toBe(1, 'Only one call is expected');
            expect(httpClientSpy.post.calls.allArgs()[0][0]).toBe(environment.apiUrl + "/" + contentId + "/actions/upvote");
        });

        it('should return an error when the server returns a 404', (done: DoneFn) => {
            const errorResponse = new HttpErrorResponse({
                error: '404 error', status: 404, statusText: 'Not Found'
            });
            const expectedResponse: Content = randomImageContent();
            const contentId = expectedResponse.id;

            httpClientSpy.post.and.returnValue(defer(() => Promise.reject(errorResponse)));

            service.upvoteContent(contentId).subscribe(
                content => {
                    expect(content).toEqual(randomImageContent());
                    done()
                }
            );
        });
    });

    describe('POST /actions/downvote', () => {
        it('should return expected content (HttpClient called once)', (done: DoneFn) => {
            const expectedResponse: Content = randomImageContent();
            const contentId = expectedResponse.id;

            httpClientSpy.post.and.returnValue(of(expectedResponse));

            service.downvoteContent(contentId).subscribe(
                content => {
                    expect(content).toEqual(expectedResponse, 'Content response is not as expected');
                    done();
                },
                done.fail
            );
            expect(httpClientSpy.post.calls.count()).toBe(1, 'Only one call is expected');
            expect(httpClientSpy.post.calls.allArgs()[0][0]).toBe(environment.apiUrl + "/" + contentId + "/actions/downvote");
        });

        it('should return an error when the server returns a 404', (done: DoneFn) => {
            const errorResponse = new HttpErrorResponse({
                error: '404 error', status: 404, statusText: 'Not Found'
            });
            const expectedResponse: Content = randomImageContent();
            const contentId = expectedResponse.id;

            httpClientSpy.post.and.returnValue(defer(() => Promise.reject(errorResponse)));
        
            service.upvoteContent(contentId).subscribe(
                content => {
                    expect(content).toEqual(randomImageContent());
                    done()
                }
            );
        });
    });
});