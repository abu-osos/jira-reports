import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatComment',
  standalone: true,
})
export class FormatCommentPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }

    let html = this.formatText(value);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private formatText(text: string): string {
    text = text.replace(/\{\{([^}]+)\}\}/g, '<code>$1</code>');
    text = text.replace(/\*([^*]+)\*/g, '<b>$1</b>');

    const lines = text.split('\n');
    let html = '';
    let inOl = false;
    let inUlLevel = 0; // 0: not in ul, 1: *, 2: **, etc.

    const closeLists = () => {
      if (inOl) {
        html += '</ol>';
        inOl = false;
      }
      while (inUlLevel > 0) {
        html += '</ul>';
        inUlLevel--;
      }
    };

    for (const line of lines) {
      if (line.trim() === '----') {
        closeLists();
        html += '<hr>';
        continue;
      }

      const h3Match = line.match(/^h3\.\s*(.*)/);
      if (h3Match) {
        closeLists();
        html += `<h3>${h3Match[1]}</h3>`;
        continue;
      }

      if (line.startsWith('#')) {
        if (inUlLevel > 0) {
            closeLists();
        }
        if (!inOl) {
          html += '<ol>';
          inOl = true;
        }
        html += `<li>${line.substring(line.startsWith('#*') || line.startsWith('# ') ? 2 : 1)}</li>`;
        continue;
      }
      
      const ulMatch = line.match(/^(\*+)\s*(.*)/);
      if (ulMatch) {
        if (inOl) {
            closeLists();
        }
        const level = ulMatch[1].length;
        const itemText = ulMatch[2];

        if (level > inUlLevel) {
          for (let i = inUlLevel; i < level; i++) {
            html += '<ul>';
          }
        } else if (level < inUlLevel) {
          for (let i = inUlLevel; i > level; i--) {
            html += '</ul>';
          }
        }
        inUlLevel = level;
        html += `<li>${itemText}</li>`;
        continue;
      }
      
      closeLists();
      html += `<p>${line}</p>`;
    }

    closeLists();

    return html;
  }
} 