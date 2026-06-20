import Link from "next/link";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-10 border-b border-beige-dark pb-2 text-xl font-semibold text-navy md:mt-12 md:text-2xl"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 text-lg font-semibold text-navy" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mt-4 text-base leading-relaxed text-navy/80 md:text-lg" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-navy/80"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mt-4 list-decimal space-y-2 pl-5 text-base leading-relaxed text-navy/80"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-navy" {...props}>
      {children}
    </strong>
  ),
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          className="font-medium text-navy-light underline-offset-2 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="font-medium text-navy-light underline-offset-2 hover:underline"
        {...props}
      >
        {children}
      </Link>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-4 border-l-4 border-navy/30 bg-beige px-4 py-3 text-base text-navy/80"
      {...props}
    >
      {children}
    </blockquote>
  ),
};
