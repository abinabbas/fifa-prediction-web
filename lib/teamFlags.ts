export interface TeamFlag {
  code: string;
  iso: string;
  name: string;
}

export const TEAM_FLAGS: TeamFlag[] = [
  { code: "BRA", iso: "br", name: "Brazil" },
  { code: "GER", iso: "de", name: "Germany" },
  { code: "FRA", iso: "fr", name: "France" },
  { code: "ESP", iso: "es", name: "Spain" },
  { code: "POR", iso: "pt", name: "Portugal" },
  { code: "JPN", iso: "jp", name: "Japan" },
  { code: "KOR", iso: "kr", name: "South Korea" },
  { code: "MEX", iso: "mx", name: "Mexico" },
  { code: "CAN", iso: "ca", name: "Canada" },
  { code: "MAR", iso: "ma", name: "Morocco" },
  { code: "SEN", iso: "sn", name: "Senegal" },
  { code: "NGA", iso: "ng", name: "Nigeria" },
  { code: "COL", iso: "co", name: "Colombia" },
  { code: "URU", iso: "uy", name: "Uruguay" },
  { code: "CHI", iso: "cl", name: "Chile" },
  { code: "ARG", iso: "ar", name: "Argentina" },
  { code: "ENG", iso: "gb-eng", name: "England" },
  { code: "USA", iso: "us", name: "United States" },
  { code: "NED", iso: "nl", name: "Netherlands" },
  { code: "NOR", iso: "no", name: "Norway" },
  { code: "ITA", iso: "it", name: "Italy" },
  { code: "BEL", iso: "be", name: "Belgium" },
  { code: "CRO", iso: "hr", name: "Croatia" },
  { code: "SUI", iso: "ch", name: "Switzerland" },
  { code: "POL", iso: "pl", name: "Poland" },
  { code: "AUS", iso: "au", name: "Australia" },
  { code: "ECU", iso: "ec", name: "Ecuador" },
  { code: "IRN", iso: "ir", name: "Iran" },
  { code: "SAU", iso: "sa", name: "Saudi Arabia" },
  { code: "QAT", iso: "qa", name: "Qatar" },
  { code: "GHA", iso: "gh", name: "Ghana" },
  { code: "CMR", iso: "cm", name: "Cameroon" },
  { code: "TUN", iso: "tn", name: "Tunisia" },
];

export function getTeamFlagByIso(iso: string): TeamFlag | undefined {
  return TEAM_FLAGS.find((team) => team.iso === iso);
}

export function getTeamFlagByName(name: string): TeamFlag | undefined {
  const normalized = name.trim().toLowerCase();
  return TEAM_FLAGS.find(
    (team) =>
      team.name.toLowerCase() === normalized ||
      team.code.toLowerCase() === normalized
  );
}

export function getFlagImageUrl(iso: string): string {
  return `https://flagcdn.com/w40/${iso}.png`;
}
