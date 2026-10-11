import { useState } from "react";

import { getInitials } from "../../utils/initials.js";

export default function TeamCrest({ name, logo, className = "" }) {
  const [failed, setFailed] = useState(false);
  const showLogo = Boolean(logo) && !failed;

  return (
    <span
      aria-hidden="true"
      className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-16 sm:w-16 ${className}`}
    >
      {showLogo ? (
        <img
          src={logo}
          alt=""
          loading="lazy"
          className="h-full w-full object-contain p-1.5"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="font-display text-lg font-bold sm:text-2xl">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
