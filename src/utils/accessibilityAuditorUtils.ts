// Accessibility rules, auditing engine & WCAG standard mappings

export type A11ySeverity = 'critical' | 'serious' | 'moderate' | 'minor' | 'passed';

export type A11yCategory = 
  | 'Perceivable'
  | 'Operable'
  | 'Understandable'
  | 'Robust';

export interface A11yIssue {
  id: string;
  title: string;
  description: string;
  wcagCriterion: string;
  wcagLevel: 'A' | 'AA' | 'AAA' | 'Best Practice';
  category: A11yCategory;
  severity: A11ySeverity;
  elementSelector?: string;
  codeSnippet?: string;
  suggestedFix: string;
  elementHtml?: string;
}

export interface A11yAuditResult {
  score: number;
  grade: 'Compliant (AA)' | 'Needs Minor Remediation' | 'Non-Compliant (High Risk)';
  totalIssues: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  minorCount: number;
  passedCount: number;
  issues: A11yIssue[];
  stats: {
    totalImages: number;
    imagesWithoutAlt: number;
    totalHeadings: number;
    headingHierarchyValid: boolean;
    totalInputs: number;
    inputsWithoutLabels: number;
    totalButtons: number;
    buttonsWithoutNames: number;
    hasHtmlLang: boolean;
    htmlLangValue?: string;
    hasTitle: boolean;
    titleValue?: string;
    hasZoomTrap: boolean;
  };
}

/**
 * Safely parses untrusted HTML into an inert DOM Document using DOMParser.
 * NEVER uses innerHTML on live DOM, and NEVER executes script tags.
 */
export function runAccessibilityAuditOnHtml(htmlString: string): A11yAuditResult {
  const issues: A11yIssue[] = [];

  // Parse using inert DOMParser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // 1. Check Document Language (WCAG 3.1.1 Level A)
  const htmlElem = doc.documentElement;
  const langAttr = htmlElem.getAttribute('lang');
  const hasHtmlLang = Boolean(langAttr && langAttr.trim().length >= 2);

  if (!hasHtmlLang) {
    issues.push({
      id: 'a11y-lang-missing',
      title: 'Missing or Empty Document Language (lang attribute)',
      description: 'The root <html> tag lacks an active language declaration, preventing screen readers from choosing the correct pronunciation and speech synthesis dictionary.',
      wcagCriterion: '3.1.1 Language of Page',
      wcagLevel: 'A',
      category: 'Understandable',
      severity: 'critical',
      suggestedFix: 'Add lang="en" (or your primary target language code) to the opening <html> element.',
      codeSnippet: '<html lang="en">\n  <head>...\n</html>'
    });
  } else {
    issues.push({
      id: 'a11y-lang-passed',
      title: `Valid Document Language Declared (lang="${langAttr}")`,
      description: `The document declares language "${langAttr}". Screen readers can appropriately synthesize phonetics.`,
      wcagCriterion: '3.1.1 Language of Page',
      wcagLevel: 'A',
      category: 'Understandable',
      severity: 'passed',
      suggestedFix: 'None required.'
    });
  }

  // 2. Check Document Title (WCAG 2.4.2 Level A)
  const titleElem = doc.querySelector('title');
  const titleText = titleElem?.textContent?.trim() || '';
  const hasTitle = Boolean(titleText.length > 0);

  if (!hasTitle) {
    issues.push({
      id: 'a11y-title-missing',
      title: 'Missing or Empty Document <title>',
      description: 'The webpage has no descriptive <title> tag. Users navigating with screen readers or switching browser tabs cannot identify the page context.',
      wcagCriterion: '2.4.2 Page Titled',
      wcagLevel: 'A',
      category: 'Operable',
      severity: 'critical',
      suggestedFix: 'Insert a descriptive <title> in the <head> specifying the page topic and organization name.',
      codeSnippet: '<head>\n  <title>Services & Solutions | SamaXon Digital</title>\n</head>'
    });
  } else {
    issues.push({
      id: 'a11y-title-passed',
      title: `Descriptive Page Title Present ("${titleText.slice(0, 40)}${titleText.length > 40 ? '...' : ''}")`,
      description: 'A valid page title is defined in document head.',
      wcagCriterion: '2.4.2 Page Titled',
      wcagLevel: 'A',
      category: 'Operable',
      severity: 'passed',
      suggestedFix: 'None required.'
    });
  }

  // 3. Check Viewport Zoom Restrictions (WCAG 1.4.4 Level AA)
  const metaViewport = doc.querySelector('meta[name="viewport"]');
  const viewportContent = metaViewport?.getAttribute('content') || '';
  const hasZoomTrap = /user-scalable\s*=\s*no/i.test(viewportContent) || /maximum-scale\s*=\s*1(\.0)?/i.test(viewportContent);

  if (hasZoomTrap) {
    issues.push({
      id: 'a11y-viewport-zoom',
      title: 'Viewport Disables User Pinch-to-Zoom',
      description: 'The meta viewport content specifies user-scalable=no or maximum-scale=1.0. This prevents low-vision users from enlarging text on mobile devices.',
      wcagCriterion: '1.4.4 Resize Text',
      wcagLevel: 'AA',
      category: 'Perceivable',
      severity: 'serious',
      suggestedFix: 'Allow users to zoom up to at least 200% without restriction.',
      codeSnippet: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    });
  }

  // 4. Image Alternative Text (WCAG 1.1.1 Level A)
  const images = Array.from(doc.querySelectorAll('img'));
  let imagesWithoutAlt = 0;

  images.forEach((img, idx) => {
    const hasAlt = img.hasAttribute('alt');
    const altVal = img.getAttribute('alt')?.trim();
    const srcVal = img.getAttribute('src') || 'image';

    if (!hasAlt) {
      imagesWithoutAlt++;
      if (imagesWithoutAlt <= 5) {
        issues.push({
          id: `a11y-img-no-alt-${idx}`,
          title: `Image Missing alt Attribute`,
          description: `An <img> element (${srcVal.slice(0, 50)}) has no alt attribute. Screen readers will read the full raw file path.`,
          wcagCriterion: '1.1.1 Non-text Content',
          wcagLevel: 'A',
          category: 'Perceivable',
          severity: 'critical',
          elementSelector: `img[src="${srcVal.slice(0, 30)}"]`,
          suggestedFix: 'Add descriptive alt text describing the image content. For purely decorative graphics, provide alt="" (empty string).',
          codeSnippet: `<img src="${srcVal}" alt="Executive team in consultation" />`
        });
      }
    } else if (altVal && (/\.(jpg|png|svg|webp|gif)$/i.test(altVal) || altVal.toLowerCase() === 'image' || altVal.toLowerCase() === 'photo')) {
      issues.push({
        id: `a11y-img-generic-alt-${idx}`,
        title: `Low-Quality Image Alt Text ("${altVal}")`,
        description: `Image alt attribute uses a generic placeholder or filename rather than meaningful description.`,
        wcagCriterion: '1.1.1 Non-text Content',
        wcagLevel: 'A',
        category: 'Perceivable',
        severity: 'moderate',
        suggestedFix: 'Replace filenames with descriptive prose summarizing the visual subject.',
        codeSnippet: `<img src="${srcVal}" alt="Modern banquet hall decorated for evening wedding" />`
      });
    }
  });

  if (images.length > 0 && imagesWithoutAlt === 0) {
    issues.push({
      id: 'a11y-img-passed',
      title: `All ${images.length} Image(s) Provide Alt Attributes`,
      description: 'Every <img> element supplies an alternative text or decorative designation.',
      wcagCriterion: '1.1.1 Non-text Content',
      wcagLevel: 'A',
      category: 'Perceivable',
      severity: 'passed',
      suggestedFix: 'None required.'
    });
  }

  // 5. Headings and Hierarchy (WCAG 1.3.1 Level A & 2.4.6 Level AA)
  const h1Elements = Array.from(doc.querySelectorAll('h1'));
  const allHeadings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  if (h1Elements.length === 0) {
    issues.push({
      id: 'a11y-heading-no-h1',
      title: 'Missing Main <h1> Heading',
      description: 'The document lacks a top-level <h1> heading. Users navigating by heading shortcuts cannot immediately ascertain the primary topic.',
      wcagCriterion: '2.4.6 Headings and Labels',
      wcagLevel: 'AA',
      category: 'Operable',
      severity: 'serious',
      suggestedFix: 'Add exactly one <h1> heading near the top of the main content container.',
      codeSnippet: '<h1>SamaXon Digital Solutions & Website Engineering</h1>'
    });
  } else if (h1Elements.length > 1) {
    issues.push({
      id: 'a11y-heading-multi-h1',
      title: `Multiple (${h1Elements.length}) <h1> Headings Detected`,
      description: 'Standard accessible document architecture requires a single primary <h1> representing the page topic, followed by <h2> and <h3> subheadings.',
      wcagCriterion: '1.3.1 Info and Relationships',
      wcagLevel: 'A',
      category: 'Perceivable',
      severity: 'moderate',
      suggestedFix: 'Demote secondary <h1> elements to <h2> or <h3> section headers.',
      codeSnippet: '<!-- Primary -->\n<h1>Main Page Topic</h1>\n<!-- Sections -->\n<h2>Core Deliverables</h2>'
    });
  }

  // Heading order check (skipping levels like H1 -> H3)
  let headingHierarchyValid = true;
  let previousLevel = 0;
  for (const h of allHeadings) {
    const level = parseInt(h.tagName.substring(1), 10);
    if (previousLevel > 0 && level > previousLevel + 1) {
      headingHierarchyValid = false;
      issues.push({
        id: `a11y-heading-skip-${previousLevel}-${level}`,
        title: `Skipped Heading Level (H${previousLevel} to H${level})`,
        description: `Heading hierarchy jumped from <h${previousLevel}> to <h${level}> without an intermediate <h${previousLevel + 1}>. This disorients screen reader navigational indexes.`,
        wcagCriterion: '1.3.1 Info and Relationships',
        wcagLevel: 'A',
        category: 'Perceivable',
        severity: 'moderate',
        suggestedFix: `Nest headings sequentially without skipping levels.`,
        codeSnippet: `<h2>Section Title</h2>\n<h3>Subsection Title</h3> <!-- Do not jump straight to <h4> -->`
      });
      break;
    }
    previousLevel = level;
  }

  // 6. Form Inputs and Accessible Labels (WCAG 1.3.1 & 3.3.2 Level A)
  const inputs = Array.from(doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select'));
  let inputsWithoutLabels = 0;

  inputs.forEach((input, idx) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const parentLabel = input.closest('label');
    const matchingLabel = id ? doc.querySelector(`label[for="${id}"]`) : null;

    const hasAccessibleName = Boolean(ariaLabel || ariaLabelledby || parentLabel || matchingLabel);

    if (!hasAccessibleName) {
      inputsWithoutLabels++;
      if (inputsWithoutLabels <= 4) {
        issues.push({
          id: `a11y-input-no-label-${idx}`,
          title: `Form Field Missing Accessible Label`,
          description: `An input element (type="${input.getAttribute('type') || 'text'}") lacks an associated <label> or aria-label attribute.`,
          wcagCriterion: '3.3.2 Labels or Instructions',
          wcagLevel: 'A',
          category: 'Understandable',
          severity: 'critical',
          suggestedFix: 'Pair the input with a visible <label for="fieldId"> or add an aria-label attribute.',
          codeSnippet: '<label for="clientEmail">Email Address</label>\n<input id="clientEmail" type="email" />'
        });
      }
    }
  });

  if (inputs.length > 0 && inputsWithoutLabels === 0) {
    issues.push({
      id: 'a11y-inputs-passed',
      title: `All ${inputs.length} Form Input(s) Have Associated Labels`,
      description: 'Form controls have explicit labels or aria-label attributes for assistive tech.',
      wcagCriterion: '3.3.2 Labels or Instructions',
      wcagLevel: 'A',
      category: 'Understandable',
      severity: 'passed',
      suggestedFix: 'None required.'
    });
  }

  // 7. Buttons and Links Accessible Names (WCAG 4.1.2 Level A)
  const buttons = Array.from(doc.querySelectorAll('button, a[role="button"]'));
  let buttonsWithoutNames = 0;

  buttons.forEach((btn, idx) => {
    const text = btn.textContent?.trim() || '';
    const ariaLabel = btn.getAttribute('aria-label');
    const ariaLabelledby = btn.getAttribute('aria-labelledby');
    const hasAccessibleName = Boolean(text.length > 0 || ariaLabel || ariaLabelledby);

    if (!hasAccessibleName) {
      buttonsWithoutNames++;
      if (buttonsWithoutNames <= 4) {
        issues.push({
          id: `a11y-btn-no-name-${idx}`,
          title: `Empty Button Without Accessible Name`,
          description: `An interactive button contains no visible text or aria-label (often an icon button). Screen readers will announce it as "button" with no purpose.`,
          wcagCriterion: '4.1.2 Name, Role, Value',
          wcagLevel: 'A',
          category: 'Robust',
          severity: 'critical',
          suggestedFix: 'Add aria-label="Action description" or visible text inside the button.',
          codeSnippet: '<button type="button" aria-label="Close navigation drawer">\n  <svg ... />\n</button>'
        });
      }
    }
  });

  // 8. Generic Link Text ("click here", "read more")
  const links = Array.from(doc.querySelectorAll('a[href]'));
  let vagueLinkCount = 0;
  links.forEach((a, idx) => {
    const linkText = a.textContent?.trim().toLowerCase() || '';
    if (['click here', 'read more', 'learn more', 'link', 'here', 'more'].includes(linkText)) {
      vagueLinkCount++;
      if (vagueLinkCount <= 3) {
        issues.push({
          id: `a11y-vague-link-${idx}`,
          title: `Non-Descriptive Link Anchor Text ("${linkText}")`,
          description: `Links like "${linkText}" provide zero standalone context when listed in a screen reader link dialog.`,
          wcagCriterion: '2.4.4 Link Purpose (In Context)',
          wcagLevel: 'A',
          category: 'Operable',
          severity: 'moderate',
          suggestedFix: 'Specify the link destination in the link text or provide an aria-label.',
          codeSnippet: `<a href="/services/web-development">Explore our web engineering services</a>`
        });
      }
    }
  });

  // Calculate score & counts
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const seriousCount = issues.filter(i => i.severity === 'serious').length;
  const moderateCount = issues.filter(i => i.severity === 'moderate').length;
  const minorCount = issues.filter(i => i.severity === 'minor').length;
  const passedCount = issues.filter(i => i.severity === 'passed').length;

  let deduction = (criticalCount * 18) + (seriousCount * 10) + (moderateCount * 5) + (minorCount * 2);
  const score = Math.max(10, Math.min(100, 100 - deduction));

  const grade = score >= 90 
    ? 'Compliant (AA)' 
    : score >= 70 
    ? 'Needs Minor Remediation' 
    : 'Non-Compliant (High Risk)';

  return {
    score,
    grade,
    totalIssues: criticalCount + seriousCount + moderateCount + minorCount,
    criticalCount,
    seriousCount,
    moderateCount,
    minorCount,
    passedCount,
    issues,
    stats: {
      totalImages: images.length,
      imagesWithoutAlt,
      totalHeadings: allHeadings.length,
      headingHierarchyValid,
      totalInputs: inputs.length,
      inputsWithoutLabels,
      totalButtons: buttons.length,
      buttonsWithoutNames,
      hasHtmlLang,
      htmlLangValue: langAttr || undefined,
      hasTitle,
      titleValue: titleText || undefined,
      hasZoomTrap
    }
  };
}
