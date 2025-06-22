import {
  Blockquote,
  Code,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Large,
  Lead,
  Muted,
  P,
  Small,
} from '~ui/typography';

export default function TypographyDemo() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="space-y-4">
        <H1>Typography System Demo</H1>
        <Lead>
          This page demonstrates all the typography components available in the design system. Each
          component is designed to provide consistent spacing, sizing, and styling.
        </Lead>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <H2>Headings</H2>
          <div className="space-y-2">
            <H1>Heading 1 - Main Title</H1>
            <H2>Heading 2 - Section Title</H2>
            <H3>Heading 3 - Subsection Title</H3>
            <H4>Heading 4 - Minor Section</H4>
            <H5>Heading 5 - Small Section</H5>
            <H6>Heading 6 - Smallest Heading</H6>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Text Elements</H2>
          <div className="space-y-4">
            <P>
              This is a regular paragraph with proper line height and spacing. It demonstrates the
              default text styling that should be used for body content throughout the application.
            </P>

            <Lead>
              This is a lead paragraph, typically used for introductory text or summaries. It has a
              larger font size and muted color to draw attention.
            </Lead>

            <Large>
              This is large text, useful for emphasizing important information or creating visual
              hierarchy within content.
            </Large>

            <Small>
              This is small text, perfect for captions, footnotes, or secondary information.
            </Small>

            <Muted>
              This is muted text, ideal for less important information or metadata that should be
              visually de-emphasized.
            </Muted>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Code Elements</H2>
          <div className="space-y-4">
            <P>
              Here&apos;s an example of inline code:{' '}
              <Code>const greeting = &quot;Hello, World!&quot;;</Code>
            </P>

            <P>And here&apos;s a block of code:</P>
            <pre className="rounded-lg bg-muted p-4 overflow-x-auto">
              <code className="text-sm">
                {`function greet(name: string) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));`}
              </code>
            </pre>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Blockquotes</H2>
          <Blockquote>
            &ldquo;Design is not just what it looks like and feels like. Design is how it
            works.&rdquo;
            <br />
            <Small className="mt-2 block">— Steve Jobs</Small>
          </Blockquote>
        </section>

        <section className="space-y-4">
          <H2>Typography with Custom Styling</H2>
          <div className="space-y-4">
            <H1 className="text-blue-600">Custom Colored Heading</H1>
            <P className="text-green-600 font-semibold">
              Custom styled paragraph with different color and weight.
            </P>
            <Lead className="italic">Lead text with custom italic styling applied.</Lead>
          </div>
        </section>

        <section className="space-y-4">
          <H2>Responsive Typography</H2>
          <P>
            All typography components are responsive by default. Headings scale appropriately on
            different screen sizes, and text remains readable across all devices.
          </P>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <H3>Mobile First</H3>
              <P>Typography scales from mobile to desktop seamlessly.</P>
            </div>
            <div>
              <H3>Accessible</H3>
              <P>Proper contrast ratios and readable font sizes for all users.</P>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
