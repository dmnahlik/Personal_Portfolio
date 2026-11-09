"use client";

import { useEffect, useRef, useState } from "react";

/** "Copy email" button with a polite status message for screen readers. */
export default function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied to clipboard.");
    } catch {
      setStatus(email); // clipboard blocked: show the address so it can be copied manually
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 3000);
  }

  return (
    <>
      <button className="btn btn--ghost" type="button" onClick={copy}>
        Copy email
      </button>
      <span className="copy-status" role="status" aria-live="polite">
        {status}
      </span>
    </>
  );
}
