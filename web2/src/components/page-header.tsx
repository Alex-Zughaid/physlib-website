import type { ReactNode } from "react";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  id?: string;
};

export function PageHeader({ title, description, className = "", id }: Props) {
  return (
    <header id={id} className={`border-t border-border pt-10 mb-6 scroll-mt-24 ${className}`}>
      <h2
        className="text-2xl font-medium text-foreground"
        style={{ letterSpacing: "-0.04em" }}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm text-muted leading-relaxed" style={{ letterSpacing: "-0.01em" }}>
          {description}
        </p>
      )}
    </header>
  );
}
