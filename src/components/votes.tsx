import { h, Fragment, FunctionComponent } from "preact";
import { useState } from "preact/hooks";

const Voter: FunctionComponent<{ a: number; b: number }> = ({
  children,
  a,
  b,
}) => {
  const [left, setLeft] = useState(a);
  const [right, setRight] = useState(b);

  return (
    <div class="flex flex-col">
      <div class="flex gap-2 text-xl">
        <div>{left}</div>
        <div>{right}</div>
      </div>
      <div class="counter-message">{children}</div>
    </div>
  );
};

export default Voter;
