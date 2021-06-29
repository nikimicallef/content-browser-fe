import { Component, OnInit } from '@angular/core';
import { Content } from 'src/app/models/content';
import { emptyContent } from './models/generators/content.generator';
import { ContentApiService } from './services/content-api.service';

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
  activeContent: Content = emptyContent();
  activeContentListIndex: number = 0;
  sendingVote = false;
  justVoted = false;
  noMoreContent = false;
  private contentItems = 15;
  private pageNumber = 0;

  constructor(private contentApiService: ContentApiService) {}

  /**
   * Load first page of all content on init
   */
  ngOnInit() {
    this.contentApiService.getContent(this.contentItems, this.pageNumber)
      .subscribe(content => { this.allContent = content; this.displayedContent = this.allContent });
  }

  /**
   * Switches from top content to all content. Since data is retrieved on init, it is not refreshed.
   */
  switchToAllContent() {
    this.showAllContent = true;
    this.displayedContent = this.allContent;
  }

  /**
   * Switches from all content to top content. If data has not been retrieved yet then it is retrieved from the backend
   */
  switchToTopContent() {
    this.displayedContent = [];
    this.showAllContent = false;
    if (this.topContent.length == 0) {
      this.contentApiService.getTopContent(10)
        .subscribe(content => {
          this.topContent = content;
          this.displayedContent = this.topContent;
        });
    } else {
      this.displayedContent = this.topContent;
    }
  }

  /**
   * Retrieves the next page of content from the backend. If no more content is retrieved set noMoreContent to true
   */
  loadMoreContent() {
    this.gettingContent = true;
    this.pageNumber += 1;
    this.contentApiService.getContent(this.contentItems, this.pageNumber)
      .subscribe(content => { 
        if(content.length > 0) {
          Array.prototype.push.apply(this.allContent, content); this.displayedContent = this.allContent; this.gettingContent = false; 
        } else {
          this.noMoreContent = true;
        }
      });
  }

  /**
   * Removes any active content on modal close in order to force stopping the video
   */
  onModalClose() {
    this.activeContent = emptyContent();
    this.justVoted = false;
  }

  /**
   * Shows the next piece of content on button click. If there is no more content loaded then the retrieve the next page from the backend. 
   * If no more content is retrieved, then set noMoreContent to true.
   */
  showNextContentAsActiveContent() {
    if (this.activeContentListIndex === this.displayedContent.length - 1) {
      this.gettingContent = true;
      this.pageNumber += 1;
      this.contentApiService.getContent(this.contentItems, this.pageNumber)
        .subscribe(content => {
          if(content.length > 0) {
            Array.prototype.push.apply(this.allContent, content);
            this.displayedContent = this.allContent;
            this.activeContentListIndex += 1;
            this.activeContent = this.displayedContent[this.activeContentListIndex];
            this.gettingContent = false;
            this.justVoted = false;
          } else {
            this.noMoreContent = true;
            this.gettingContent = false;
          }
        });
    } else {
      this.activeContentListIndex += 1;
      this.activeContent = this.displayedContent[this.activeContentListIndex];
      this.justVoted = false;
    }
  }

  /**
   * Shows previous piece of content on button click. If already on first content item, do nothing
   */
  setPreviousContentAsActiveContent() {
    if(this.activeContentListIndex > 0) {
      this.activeContentListIndex -= 1;
      this.activeContent = this.displayedContent[this.activeContentListIndex];
      this.justVoted = false;
    }
  }

  /**
   * On album image click, set the active content to the content selected along with the index of the item in the list of displayed content
   * 
   * @param c content item clicked
   * @param index index of the item in the list of displayed content
   */
  imageClick(c: Content, index: number) {
    this.activeContent = c;
    this.activeContentListIndex = index;
  }

  /**
   * Upvotes and downvotes a piece of content
   * 
   * @param content to up/downvote
   * @param upvote true = user upvoted content, false = user downvoted content
   */
  vote(content : Content, upvote: boolean) {
    this.sendingVote = true;
    if(upvote) {
      this.contentApiService.upvoteContent(content.id)
        .subscribe(newContent => {
          this.updateContentAfterVote(newContent);
        })
    } else {
      this.contentApiService.downvoteContent(content.id)
        .subscribe(newContent => {
          this.updateContentAfterVote(newContent);
        })
    }
  }

  /**
   * Refreshes the content item to contain the new number of votes
   * 
   * @param updatedContentEntity returned from the backend with the new vote number
   */
  private updateContentAfterVote(updatedContentEntity: Content) {
    this.activeContent = updatedContentEntity;
    this.displayedContent[this.activeContentListIndex] = updatedContentEntity;
    if(this.showAllContent) {
      this.allContent[this.activeContentListIndex] = updatedContentEntity;
    } else {
      this.topContent[this.activeContentListIndex] = updatedContentEntity;
    }
    this.sendingVote = false;
    this.justVoted = true;
  }

}
