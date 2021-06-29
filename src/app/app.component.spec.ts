import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { emptyContent, randomContentList, randomImageContent, randomVideoContent } from './models/generators/content.generator';
import { ContentApiService } from './services/content-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Content } from 'src/app/models/content';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let contentApiServiceSpy: ContentApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        ContentApiService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    jasmine.getEnv().allowRespy(true);

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    contentApiServiceSpy = TestBed.inject(ContentApiService);

    spyOn(contentApiServiceSpy, 'getContent').and.returnValue(
      of(randomContentList())
    );
    spyOn(contentApiServiceSpy, 'getTopContent').and.returnValue(
      of(randomContentList())
    );
    spyOn(contentApiServiceSpy, 'upvoteContent').and.returnValue(
      of(randomImageContent())
    );
    spyOn(contentApiServiceSpy, 'downvoteContent').and.returnValue(
      of(randomImageContent())
    );
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should populate all content and displayed content', () => {
      app.ngOnInit();
  
      expect(app.allContent).toEqual(randomContentList());
      expect(app.displayedContent).toEqual(randomContentList());
      expect(contentApiServiceSpy.getContent).toHaveBeenCalledTimes(1);
    });
  });

  describe('switchToAllContent', () => {
    it('should set displayed content to equal all content', () => {
      app.topContent = [randomVideoContent()];
      app.allContent = [randomImageContent()];
      app.showAllContent = false;
  
      app.switchToAllContent();
  
      expect(app.showAllContent).toBe(true);
      expect(app.displayedContent).toEqual([randomImageContent()]);
    });
  });

  describe('switchToTopContent', () => {
    it('should set top content without hitting API if top content is already loaded', () => {
      app.topContent = [randomVideoContent()];
      app.allContent = [randomImageContent()];
      app.showAllContent = true;
  
      app.switchToTopContent();
  
      expect(app.showAllContent).toBe(false);
      expect(app.displayedContent).toEqual([randomVideoContent()]);
      expect(contentApiServiceSpy.getTopContent).toHaveBeenCalledTimes(0);
    });
  
    it('should set top content without hitting API if top content is already loaded', () => {
      app.topContent = [];
      app.allContent = [randomImageContent()];
      app.showAllContent = true;
  
      app.switchToTopContent();
  
      expect(app.showAllContent).toBe(false);
      expect(app.topContent).toEqual(randomContentList());
      expect(app.displayedContent).toEqual(randomContentList());
      expect(contentApiServiceSpy.getTopContent).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadMoreContent', () => {
    it('should add content to all content and displayed content when data is received', () => {
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
  
      app.loadMoreContent();
  
      expect(app.allContent.length).toEqual(4);
      expect(app.displayedContent.length).toEqual(4);
      expect(contentApiServiceSpy.getContent).toHaveBeenCalledOnceWith(15, 1);
    });

    it('should set no more content true when no more content is received from BE', () => {
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();

      spyOn(contentApiServiceSpy, 'getContent').and.returnValue(
        of([])
      );
  
      app.loadMoreContent();
  
      expect(app.allContent.length).toEqual(2);
      expect(app.displayedContent.length).toEqual(2);
      expect(app.noMoreContent).toBe(true);
      expect(contentApiServiceSpy.getContent).toHaveBeenCalledOnceWith(15, 1);
    });
  });

  describe('onModalClose', () => {
    it('should remove active content', () => {
      app.activeContent = randomImageContent();
      app.justVoted = true;
  
      app.onModalClose();
  
      expect(app.activeContent).toEqual(emptyContent());
      expect(app.justVoted).toBe(false);
    });
  });

  describe('showNextContentAsActiveContent', () => {
    it('should set next item as active content if more exist in displayed content', () => {
      app.activeContentListIndex = 0;
      app.displayedContent = randomContentList();
  
      app.showNextContentAsActiveContent();
  
      expect(app.activeContentListIndex).toBe(1);
      expect(app.activeContent).toEqual(randomContentList()[1]);
      expect(app.justVoted).toBe(false);
    });
  
    it('should set no more content to true if no content is received from BE', () => {
      app.activeContentListIndex = 1;
      app.displayedContent = randomContentList();
  
      spyOn(contentApiServiceSpy, 'getContent').and.returnValue(
        of([])
      );
  
      app.showNextContentAsActiveContent();
  
      expect(app.noMoreContent).toBe(true);
      expect(contentApiServiceSpy.getContent).toHaveBeenCalledOnceWith(15, 1);
    });
  
    it('should add content to all content and displayed content when data is retrieved from BE', () => {
      app.activeContentListIndex = 1;
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
      app.justVoted = true;
  
      app.showNextContentAsActiveContent();
  
      expect(app.allContent.length).toBe(4);
      expect(app.displayedContent.length).toBe(4);
      expect(app.activeContentListIndex).toBe(2);
      expect(app.activeContent).toEqual(app.displayedContent[2])
      expect(app.noMoreContent).toBe(false);
      expect(app.justVoted).toBe(false);
      expect(contentApiServiceSpy.getContent).toHaveBeenCalledOnceWith(15, 1);
    });
  });

  describe('setPreviousContentAsActiveContent', () => {
    it('should do nothing if viewing first image', () => {
      app.activeContentListIndex = 0;
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
      app.activeContent = randomContentList()[0];
      app.justVoted = true;
  
      app.setPreviousContentAsActiveContent();
  
      expect(app.activeContentListIndex).toBe(0);
      expect(app.activeContent).toEqual(randomContentList()[0]);
      expect(app.justVoted).toBe(true);
    });
  
    it('should set to previous content if not viewing first image', () => {
      app.activeContentListIndex = 1;
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
      app.activeContent = randomContentList()[1];
      app.justVoted = true;
  
      app.setPreviousContentAsActiveContent();
  
      expect(app.activeContentListIndex).toBe(0);
      expect(app.activeContent).toEqual(randomContentList()[0]);
      expect(app.justVoted).toBe(false);
    });
  });

  describe('imageClick', () => {
    it('should set active image and index on imageClick', () => {
      const imageClickIndex = 1;
      
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
  
      app.imageClick(randomContentList()[imageClickIndex], imageClickIndex);
  
      expect(app.activeContent).toEqual(randomContentList()[imageClickIndex]);
      expect(app.activeContentListIndex).toBe(imageClickIndex);
    });
  });

  describe('vote', () => {
    it('content updated on upvote when show all content is true', () => {
      const upvotedEntityId = 0;
      const upvotedEntity: Content = randomContentList()[upvotedEntityId];
      upvotedEntity.votes = upvotedEntity.votes + 1;
      
      app.showAllContent = true;
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
      app.activeContent = randomContentList()[upvotedEntityId];

      spyOn(contentApiServiceSpy, 'upvoteContent').and.returnValue(
        of(upvotedEntity)
      );

      app.vote(randomContentList()[upvotedEntityId], true);

      expect(app.activeContent).toEqual(upvotedEntity);
      expect(app.displayedContent[upvotedEntityId]).toEqual(upvotedEntity);
      expect(app.allContent[upvotedEntityId]).toEqual(upvotedEntity);
      expect(contentApiServiceSpy.upvoteContent).toHaveBeenCalledTimes(1);
      expect(contentApiServiceSpy.downvoteContent).toHaveBeenCalledTimes(0);
    });

    it('content updated on upvote when show all content is false', () => {
      const upvotedEntityId = 0;
      const upvotedEntity: Content = randomContentList()[upvotedEntityId];
      upvotedEntity.votes = upvotedEntity.votes + 1;
      
      app.showAllContent = false;
      app.topContent = randomContentList();
      app.displayedContent = randomContentList();
      app.activeContent = randomContentList()[upvotedEntityId];

      spyOn(contentApiServiceSpy, 'upvoteContent').and.returnValue(
        of(upvotedEntity)
      );

      app.vote(randomContentList()[upvotedEntityId], true);

      expect(app.activeContent).toEqual(upvotedEntity);
      expect(app.displayedContent[upvotedEntityId]).toEqual(upvotedEntity);
      expect(app.topContent[upvotedEntityId]).toEqual(upvotedEntity);
      expect(contentApiServiceSpy.upvoteContent).toHaveBeenCalledTimes(1);
      expect(contentApiServiceSpy.downvoteContent).toHaveBeenCalledTimes(0);
    });

    it('content updated on downvote when show all content is true', () => {
      const downvotedEntityId = 0;
      const downvotedEntity: Content = randomContentList()[downvotedEntityId];
      downvotedEntity.votes = downvotedEntity.votes + 1;
      
      app.showAllContent = true;
      app.allContent = randomContentList();
      app.displayedContent = randomContentList();
      app.activeContent = randomContentList()[downvotedEntityId];

      spyOn(contentApiServiceSpy, 'downvoteContent').and.returnValue(
        of(downvotedEntity)
      );

      app.vote(randomContentList()[downvotedEntityId], false);

      expect(app.activeContent).toEqual(downvotedEntity);
      expect(app.displayedContent[downvotedEntityId]).toEqual(downvotedEntity);
      expect(app.allContent[downvotedEntityId]).toEqual(downvotedEntity);
      expect(contentApiServiceSpy.upvoteContent).toHaveBeenCalledTimes(0);
      expect(contentApiServiceSpy.downvoteContent).toHaveBeenCalledTimes(1);
    });

    it('content updated on downvote when show all content is false', () => {
      const downvotedEntityId = 0;
      const downvotedEntity: Content = randomContentList()[downvotedEntityId];
      downvotedEntity.votes = downvotedEntity.votes + 1;
      
      app.showAllContent = false;
      app.topContent = randomContentList();
      app.displayedContent = randomContentList();
      app.activeContent = randomContentList()[downvotedEntityId];

      spyOn(contentApiServiceSpy, 'downvoteContent').and.returnValue(
        of(downvotedEntity)
      );

      app.vote(randomContentList()[downvotedEntityId], false);

      expect(app.activeContent).toEqual(downvotedEntity);
      expect(app.displayedContent[downvotedEntityId]).toEqual(downvotedEntity);
      expect(app.topContent[downvotedEntityId]).toEqual(downvotedEntity);
      expect(contentApiServiceSpy.upvoteContent).toHaveBeenCalledTimes(0);
      expect(contentApiServiceSpy.downvoteContent).toHaveBeenCalledTimes(1);
    });
  });
});
