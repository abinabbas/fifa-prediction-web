import { getTeamFlagByIso } from "@/lib/teamFlags";
import type { QuestionOptionRow } from "@/components/launchpad/QuestionFormFields";

export function toApiOptions(options: QuestionOptionRow[]) {
  return options
    .filter((option) => option.label.trim())
    .map((option) => {
      const team = option.flagIso ? getTeamFlagByIso(option.flagIso) : undefined;
      return {
        ...(option.id ? { id: option.id } : {}),
        label: option.label.trim(),
        ...(team ? { flagIso: team.iso, flagCode: team.code } : {}),
      };
    });
}
