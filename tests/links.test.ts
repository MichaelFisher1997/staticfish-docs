import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import { globSync } from 'glob';
import fs from 'fs';
import path from 'path';
import { Window } from 'happy-dom';

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

// Build the site once before running tests
beforeAll(() => {
  console.log('Building Astro site...');
  execSync('bun run build', { stdio: 'inherit' });
  console.log('Build complete.');
});

// Get all HTML files from the build output
describe('Static Site Link Checker', () => {
  it('should have valid titles and links in all HTML files', () => {
    const htmlFiles = globSync('**/*.html', { cwd: distDir });
    expect(htmlFiles.length, 'No HTML files found in dist directory. Build might have failed.').toBeGreaterThan(0);

    for (const htmlFile of htmlFiles) {
      const window = new Window();
      const document = window.document;
      const fileContent = fs.readFileSync(path.join(distDir, htmlFile), 'utf-8');
      document.body.innerHTML = fileContent;

      // Check for title
      const title = document.querySelector('title');
      expect(title, `File ${htmlFile} is missing a title`).not.toBeNull();
      expect(title?.textContent, `File ${htmlFile} has an empty title`).not.toBe('');

      // Check for content
      const mainContent = document.querySelector('main');
      expect(mainContent, `File ${htmlFile} is missing a <main> tag.`).not.toBeNull();
      expect(mainContent?.textContent?.trim(), `File ${htmlFile} has no visible content.`).not.toBe('');

      const links = Array.from(document.querySelectorAll('a'));

      for (const link of links) {
        const href = link.getAttribute('href');

        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
          continue;
        }

        let targetPath;
        if (href.startsWith('/')) {
          targetPath = path.join(distDir, href);
        } else {
          targetPath = path.resolve(path.dirname(path.join(distDir, htmlFile)), href);
        }

        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
          // Link is valid
        } else if (fs.existsSync(path.join(targetPath, 'index.html'))) {
          // Link is valid
        } else {
          const expectedPath = href.endsWith('/') ? path.join(targetPath, 'index.html') : targetPath;
          expect(fs.existsSync(expectedPath), `Broken link in ${htmlFile}: href="${href}" points to non-existent file ${expectedPath}`).toBe(true);
        }
      }
    }
  });
});
