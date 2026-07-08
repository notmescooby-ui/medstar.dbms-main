import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

import starLogo from "@/assets/medstar-star.png";

interface LogoProps {
  className?: string;
  showWord?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  as?: "link" | "div";
  tone?: "default" | "light";
}

const sizeMap = {
  sm: { mark: "h-6 w-6", word: "text-[13px]", tag: "text-[9px]" },
  md: { mark: "h-7 w-7", word: "text-sm", tag: "text-[10px]" },
  lg: { mark: "h-9 w-9", word: "text-lg", tag: "text-[10px]" },
  xl: { mark: "h-12 w-12", word: "text-2xl", tag: "text-[11px]" },
};

export function BrandLogo({
  className, showWord = true, size = "md", as = "link", tone = "default",
}: LogoProps) {
  const s = sizeMap[size];
  const Wrapper = ({ children }: { children: ReactNode }) =>
    as === "link" ? (
      <Link to="/" className={cn("inline-flex items-center gap-3", className)}>{children}</Link>
    ) : (
      <div className={cn("inline-flex items-center gap-3", className)}>{children}</div>
    );

  const wordColor = tone === "light" ? "text-white" : "text-foreground";
  const tagColor = tone === "light" ? "text-white/50" : "text-muted-foreground";
  const markColor = tone === "light" ? "text-[color:var(--gold)]" : "text-[color:var(--primary)]";

  return (
    <Wrapper>
      <MedstarMark className={cn(s.mark, markColor)} />
      {showWord && (
        <div className="flex flex-col leading-tight">
          <span className={cn("serif-display", s.word, wordColor)}>
            MEDSTAR
          </span>
          <span className={cn("uppercase tracking-[0.22em]", s.tag, tagColor)}>
            Hospital Operations
          </span>
        </div>
      )}
    </Wrapper>
  );
}

function MedstarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <image href={starLogo} x="0" y="0" width="32" height="32" />
    </svg>
  );
}
