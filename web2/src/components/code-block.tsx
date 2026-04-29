import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import lean from "@/lib/lean-lang";

hljs.registerLanguage("lean", lean);
hljs.registerLanguage("bash", bash);

type Props = {
  code: string;
  language?: "lean" | "bash";
};

export function CodeBlock({ code, language = "lean" }: Props) {
  const highlighted = hljs.highlight(code.trim(), { language });
  return (
    <pre className="rounded-lg overflow-x-auto text-sm leading-relaxed">
      <code
        className={`hljs language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlighted.value }}
      />
    </pre>
  );
}
