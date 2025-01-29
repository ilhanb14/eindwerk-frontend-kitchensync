import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true
})

export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Function to replace Spoonacular links with local links
   * @param html 
   * @returns the local link
   */
  transform(html: string): SafeHtml {

    // Replace Spoonacular links with local links
    const modifiedHtml = html.replace(
      /href="https?:\/\/spoonacular\.com\/recipes\/(.*?)-(\d+)"/g, 
      'href="/recipe/$2" class="text-link"');
   
  return this.sanitizer.bypassSecurityTrustHtml(modifiedHtml);
  } 
}
