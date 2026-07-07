function StadiumIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 10c0-3.3 3.6-6 8-6s8 2.7 8 6v8c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-8z"
        stroke="white"
        strokeWidth="1.5"
      />
      <path d="M4 12h16M8 10v10M12 10v10M16 10v10" stroke="white" strokeWidth="1.2" />
      <path d="M9 5l1 1.5M12 4v2M15 5l-1 1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#1a2b4b" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="#1a2b4b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export { StadiumIcon, ClockIcon };
