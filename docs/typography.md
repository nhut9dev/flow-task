# Typography System

This document describes the typography system used throughout the application.

## Overview

The typography system provides consistent, accessible, and responsive text styling across the application. It includes predefined components for headings, paragraphs, and other text elements.

## Components

### Headings

Use heading components for titles and section headers:

```tsx
import { H1, H2, H3, H4, H5, H6 } from '~ui/typography';

<H1>Main Title</H1>
<H2>Section Title</H2>
<H3>Subsection Title</H3>
<H4>Minor Section</H4>
<H5>Small Section</H5>
<H6>Smallest Heading</H6>
```

### Text Elements

Use these components for different types of text content:

```tsx
import { P, Lead, Large, Small, Muted } from '~ui/typography';

<P>Regular paragraph text</P>
<Lead>Lead paragraph for introductions</Lead>
<Large>Large text for emphasis</Large>
<Small>Small text for captions</Small>
<Muted>Muted text for secondary info</Muted>
```

### Code Elements

For code snippets and technical content:

```tsx
import { Code, Blockquote } from '~ui/typography';

<P>Inline code: <Code>const example = "value";</Code></P>

<Blockquote>
  &ldquo;This is a blockquote for quotes and citations.&rdquo;
</Blockquote>
```

## Font Sizes

The typography system uses a responsive scale:

- **H1**: `text-4xl` (mobile) → `text-5xl` (desktop)
- **H2**: `text-3xl` (mobile) → `text-4xl` (desktop)
- **H3**: `text-2xl` (mobile) → `text-3xl` (desktop)
- **H4**: `text-xl` (mobile) → `text-2xl` (desktop)
- **H5**: `text-lg` (mobile) → `text-xl` (desktop)
- **H6**: `text-base` (mobile) → `text-lg` (desktop)
- **P**: `text-base`
- **Lead**: `text-xl`
- **Large**: `text-lg`
- **Small**: `text-sm`
- **Muted**: `text-sm`

## Font Weights

- **Headings**: `font-bold` (H1) or `font-semibold` (H2-H6)
- **Paragraphs**: `font-normal`
- **Lead**: `font-normal`
- **Large**: `font-semibold`
- **Small**: `font-medium`
- **Muted**: `font-normal`

## Line Heights

- **Headings**: `tracking-tight` for better readability
- **Paragraphs**: `leading-7` for comfortable reading
- **Small text**: `leading-none` for compact display

## Customization

All typography components accept standard HTML attributes and can be customized with additional CSS classes:

```tsx
<H1 className="text-blue-600">Custom colored heading</H1>
<P className="font-semibold text-green-600">Custom styled paragraph</P>
<Lead className="italic">Italic lead text</Lead>
```

## Accessibility

The typography system is designed with accessibility in mind:

- Proper heading hierarchy (H1 → H6)
- Adequate contrast ratios
- Readable font sizes
- Appropriate line heights
- Semantic HTML elements

## Usage Guidelines

1. **Use semantic headings**: Always use the appropriate heading level for your content hierarchy
2. **Maintain consistency**: Use the provided components rather than custom styling
3. **Consider context**: Choose the right text component for your content type
4. **Test responsiveness**: Ensure text remains readable on all screen sizes
5. **Follow hierarchy**: Use headings to create clear content structure

## Demo

Visit `/typography-demo` to see all typography components in action with examples of their usage.

## CSS Classes

The typography system also provides utility classes in the global CSS:

- `.text-balance` - Text wrapping for better balance
- `.text-pretty` - Pretty text wrapping
- Font weight utilities: `.font-thin` through `.font-black`
- Line height utilities: `.leading-none` through `.leading-loose`
- Letter spacing utilities: `.tracking-tighter` through `.tracking-widest`
