import {
  CalendarDays,
  Home,
  Target,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";

export const navItems = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/matches", label: "Matches", icon: CalendarDays },
  { to: "/predictions", label: "My Predictions", icon: Target },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: UserRound },
];

export default navItems;
