import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function ClientOnlyPortal({ children }) {
  const ref = useRef();
  const [mounted, setMounted] = useState(false);

  const selector = "#__next";

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current) : null;
}
export default ClientOnlyPortal;
