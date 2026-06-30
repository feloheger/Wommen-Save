/**
 * Einstiegspunkt – leitet je nach Auth-Status weiter
 */
import { Redirect } from "expo-router";
import { useAuthStore } from "@store/authStore";

export default function Index() {
  const { user } = useAuthStore();
  return <Redirect href={user ? "/(tabs)/home" : "/(auth)/login"} />;
}
