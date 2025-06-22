import * as React from 'react';

import { cn } from '~lib/utils';

const typographyVariants = {
  h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight lg:text-xl',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight lg:text-lg',
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  blockquote: 'mt-6 border-l-4 border-border pl-6 italic',
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
} as const;

const elementMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  blockquote: 'blockquote',
  code: 'code',
  lead: 'p',
  large: 'div',
  small: 'small',
  muted: 'p',
} as const;

type TypographyVariant = keyof typeof typographyVariants;

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant = 'p', as, ...props }, ref) => {
    const Component = as || elementMap[variant];
    return (
      <Component className={cn(typographyVariants[variant], className)} ref={ref} {...props} />
    );
  },
);

Typography.displayName = 'Typography';

// Specific heading components for convenience
const H1 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h1" as="h1" className={className} ref={ref} {...props} />
  ),
);
H1.displayName = 'H1';

const H2 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h2" as="h2" className={className} ref={ref} {...props} />
  ),
);
H2.displayName = 'H2';

const H3 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h3" as="h3" className={className} ref={ref} {...props} />
  ),
);
H3.displayName = 'H3';

const H4 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h4" as="h4" className={className} ref={ref} {...props} />
  ),
);
H4.displayName = 'H4';

const H5 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h5" as="h5" className={className} ref={ref} {...props} />
  ),
);
H5.displayName = 'H5';

const H6 = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="h6" as="h6" className={className} ref={ref} {...props} />
  ),
);
H6.displayName = 'H6';

const P = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="p" as="p" className={className} ref={ref} {...props} />
  ),
);
P.displayName = 'P';

const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <Typography variant="blockquote" as="blockquote" className={className} ref={ref} {...props} />
));
Blockquote.displayName = 'Blockquote';

const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="code" as="code" className={className} ref={ref} {...props} />
  ),
);
Code.displayName = 'Code';

const Lead = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="lead" as="p" className={className} ref={ref} {...props} />
  ),
);
Lead.displayName = 'Lead';

const Large = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="large" as="div" className={className} ref={ref} {...props} />
  ),
);
Large.displayName = 'Large';

const Small = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="small" as="small" className={className} ref={ref} {...props} />
  ),
);
Small.displayName = 'Small';

const Muted = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <Typography variant="muted" as="p" className={className} ref={ref} {...props} />
  ),
);
Muted.displayName = 'Muted';

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  Blockquote,
  Code,
  Lead,
  Large,
  Small,
  Muted,
  typographyVariants,
};
