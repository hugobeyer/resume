// Rich text editor toolbar functionality
(function() {
  'use strict';

  // Initialize rich text editor
  function initRichTextEditor() {
    const toolbar = document.querySelector('.rich-text-toolbar');
    if (!toolbar) return;

    const textarea = document.getElementById('post-content');
    if (!textarea) return;

    // Add click handlers to all toolbar buttons
    const buttons = toolbar.querySelectorAll('.toolbar-btn');
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const format = this.getAttribute('data-format');
        applyFormat(format, textarea);
      });
    });
  }

  // Apply formatting to selected text
  function applyFormat(format, textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);
    
    let formattedText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        newCursorPos = start + 2;
        break;

      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        newCursorPos = start + 1;
        break;

      case 'underline':
        formattedText = `<u>${selectedText || 'underlined text'}</u>`;
        newCursorPos = start + 3;
        break;

      case 'h1':
        formattedText = `\n# ${selectedText || 'Heading 1'}\n`;
        newCursorPos = start + 3;
        break;

      case 'h2':
        formattedText = `\n## ${selectedText || 'Heading 2'}\n`;
        newCursorPos = start + 4;
        break;

      case 'h3':
        formattedText = `\n### ${selectedText || 'Heading 3'}\n`;
        newCursorPos = start + 5;
        break;

      case 'ul':
        const bulletLines = (selectedText || 'List item').split('\n');
        formattedText = '\n' + bulletLines.map(line => `- ${line.trim()}`).join('\n') + '\n';
        newCursorPos = start + 3;
        break;

      case 'ol':
        const numberedLines = (selectedText || 'List item').split('\n');
        formattedText = '\n' + numberedLines.map((line, i) => `${i + 1}. ${line.trim()}`).join('\n') + '\n';
        newCursorPos = start + 4;
        break;

      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          formattedText = `[${selectedText || 'link text'}](${url})`;
          newCursorPos = start + 1;
        } else {
          return;
        }
        break;

      case 'code':
        if (selectedText.includes('\n')) {
          // Multi-line code block
          formattedText = `\n\`\`\`\n${selectedText || 'code here'}\n\`\`\`\n`;
          newCursorPos = start + 5;
        } else {
          // Inline code
          formattedText = `\`${selectedText || 'code'}\``;
          newCursorPos = start + 1;
        }
        break;

      case 'quote':
        const quoteLines = (selectedText || 'Quote text').split('\n');
        formattedText = '\n' + quoteLines.map(line => `> ${line.trim()}`).join('\n') + '\n';
        newCursorPos = start + 3;
        break;

      case 'hr':
        formattedText = '\n\n---\n\n';
        newCursorPos = start + 2;
        break;

      default:
        return;
    }

    // Update textarea content
    textarea.value = beforeText + formattedText + afterText;

    // Restore focus and set cursor position
    textarea.focus();
    if (selectedText) {
      // If there was selected text, select the formatted version
      textarea.setSelectionRange(start, start + formattedText.length);
    } else {
      // If no selection, place cursor at the beginning of the placeholder text
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }

    // Trigger input event for any listeners
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRichTextEditor);
  } else {
    initRichTextEditor();
  }

  // Export for manual initialization
  window.initRichTextEditor = initRichTextEditor;
})();

