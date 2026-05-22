import ReactMarkdown from "react-markdown";
import "./Markdown.css";

const components = {
  p: (props) => <p className="markdown-p" {...props} />,
  strong: (props) => <strong className="markdown-strong" {...props} />,
  em: (props) => <em className="markdown-em" {...props} />,
  ul: (props) => (
    <ul className="markdown-ul" {...props} />
  ),
  ol: (props) => (
    <ol className="markdown-ol" {...props} />
  ),
  li: (props) => <li className="markdown-li" {...props} />,
  h1: (props) => (
    <h3 className="markdown-h" {...props} />
  ),
  h2: (props) => (
    <h3 className="markdown-h" {...props} />
  ),
  h3: (props) => (
    <h3 className="markdown-h" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="markdown-blockquote"
      {...props}
    />
  ),
  code: ({ inline, ...props }) =>
    inline ? (
      <code
        className="markdown-code-inline"
        style={{ background: "var(--chip-bg)" }}
        {...props}
      />
    ) : (
      <code
        className="markdown-code-block"
        style={{ background: "var(--chip-bg)" }}
        {...props}
      />
    ),
  a: ({ href, ...rest }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="markdown-a"
      {...rest}
    />
  ),
  hr: () => <hr className="markdown-hr divider" />,
};

export default function Markdown({ children, className = "" }) {
  return (
    <div className={className}>
      <ReactMarkdown components={components}>{children || ""}</ReactMarkdown>
    </div>
  );
}
