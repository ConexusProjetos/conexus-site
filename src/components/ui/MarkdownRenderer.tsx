import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type Props = {
  content: string;
  className?: string;
};

const line = { borderColor: "var(--cnx-line)" } as const;
const ink = { color: "var(--cnx-ink)" } as const;

/**
 * Renders Markdown content with the Conexus light-theme prose style.
 * Works as a React Server Component (no "use client" needed).
 */
export function MarkdownRenderer({ content, className }: Props) {
  return (
    <div className={cn("conexus-prose", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-outfit text-3xl font-bold mt-10 mb-4 first:mt-0 tracking-tight" style={ink}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-outfit text-2xl font-semibold mt-9 mb-4 pb-2 border-b tracking-tight" style={{ ...ink, ...line }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-outfit text-xl font-semibold mt-7 mb-3 tracking-tight" style={ink}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="font-outfit text-lg font-semibold mt-6 mb-2" style={ink}>{children}</h4>
          ),

          p: ({ children }) => <p className="cnx-body leading-relaxed mb-5 text-base">{children}</p>,

          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="underline underline-offset-2 hover:opacity-70 transition-opacity"
              style={{ color: "var(--cnx-blue)" }}
            >
              {children}
            </a>
          ),

          ul: ({ children }) => <ul className="mb-5 space-y-2 pl-0">{children}</ul>,
          ol: ({ children }) => <ol className="mb-5 space-y-2 pl-0 list-none">{children}</ol>,
          li: ({ children }: any) => (
            <li className="flex items-start gap-3 cnx-body text-base">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cnx-teal)" }} aria-hidden="true" />
              <span className="flex-1">{children}</span>
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="pl-5 py-1 my-6 rounded-r-lg" style={{ borderLeft: "2px solid var(--cnx-teal)", background: "rgba(31, 175, 176,0.05)" }}>
              <div className="cnx-body italic leading-relaxed">{children}</div>
            </blockquote>
          ),

          code: ({ inline, className: cls, children }: any) => {
            if (inline) {
              return (
                <code className="px-1.5 py-0.5 rounded text-sm font-mono border" style={{ background: "rgba(47, 68, 159,0.07)", color: "var(--cnx-blue)", borderColor: "rgba(47, 68, 159,0.15)" }}>
                  {children}
                </code>
              );
            }
            const language = cls?.replace("language-", "") ?? "";
            return (
              <div className="my-6 rounded-xl overflow-hidden border" style={line}>
                {language && (
                  <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: "var(--cnx-bg-subtle)", ...line }}>
                    <span className="text-xs cnx-muted font-mono uppercase tracking-wider">{language}</span>
                  </div>
                )}
                <pre className="p-5 overflow-x-auto" style={{ background: "#0b1020" }}>
                  <code className="text-sm font-mono leading-relaxed" style={{ color: "#cdd5e3" }}>{children}</code>
                </pre>
              </div>
            );
          },

          img: ({ src, alt }) => (
            <figure className="my-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={alt ?? ""} className="w-full rounded-xl border" style={line} loading="lazy" />
              {alt && <figcaption className="mt-2 text-center text-xs cnx-muted">{alt}</figcaption>}
            </figure>
          ),

          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border" style={line}>
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b" style={{ background: "var(--cnx-bg-subtle)", ...line }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-xs font-semibold cnx-muted uppercase tracking-wider">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 cnx-body border-b last:border-0" style={line}>{children}</td>
          ),

          hr: () => <hr className="my-8 border-t" style={line} />,

          strong: ({ children }) => <strong className="font-semibold" style={ink}>{children}</strong>,
          em: ({ children }) => <em className="italic cnx-body">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
