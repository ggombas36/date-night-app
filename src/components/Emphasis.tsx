import { Fragment } from "react";

/** Plan texts mark emphasis with *stars*. Render them as italics without the stars. */
export default function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? <em key={index}>{part}</em> : <Fragment key={index}>{part}</Fragment>
      )}
    </>
  );
}
