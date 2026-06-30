/**
 * Hilfsfunktionen zur Formatierung
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export const avatarColors = ["#7C5CFC", "#B79CFF", "#FF4D6A", "#34C77B", "#FFB020"];

export const getAvatarColor = (seed: string): string => {
  const index = seed.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
};
