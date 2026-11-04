import { SEAL_FULL, SEAL_SMALL } from "./sealPaths";

interface MarkProps {
  className?: string;
  small?: boolean;
}

function Paths({ small }: { small?: boolean }) {
  const paths = small ? SEAL_SMALL : SEAL_FULL;
  return (
    <g fill="currentColor">
      <path fillRule="evenodd" d={paths.body} />
      <path fillRule="evenodd" d={paths.ring} />
      {paths.arm && <path d={paths.arm} />}
    </g>
  );
}

/** The logo mark as a decorative graphic. The text next to it carries the meaning. */
export function SealMark({ className, small }: MarkProps) {
  return (
    <svg viewBox="0 0 256 256" aria-hidden="true" focusable="false" className={className}>
      <Paths small={small} />
    </svg>
  );
}

interface BreakableSealProps {
  broken: boolean;
  size?: number;
}

/** The seal drawn as two halves, so a CSS transition can crack it apart. */
export function BreakableSeal({ broken, size = 72 }: BreakableSealProps) {
  return (
    <span
      className="seal"
      data-broken={broken}
      style={{ "--seal-size": `${size}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 256 256" focusable="false" className="seal__half seal__half--left">
        <Paths />
      </svg>
      <svg viewBox="0 0 256 256" focusable="false" className="seal__half seal__half--right">
        <Paths />
      </svg>
    </span>
  );
}
