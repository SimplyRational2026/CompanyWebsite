import { TEAM_MEMBERS } from "@/app/lib/fitText";

export function preloadTeamMemberImages(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  return Promise.all(
    TEAM_MEMBERS.map((member) => {
      const img = new window.Image();
      img.src = member.image;

      if (typeof img.decode === "function") {
        return img.decode().catch(() => undefined);
      }

      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }),
  ).then(() => undefined);
}
