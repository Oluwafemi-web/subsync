import { redirect } from "next/navigation";
import {
  DEFAULT_AUTH_ROUTE,
  DEFAULT_PROTECTED_ROUTE,
} from "@/lib/auth/routes";
import { isAuthenticated } from "@/lib/auth/session";

export default async function Home() {
  if (!(await isAuthenticated())) {
    redirect(DEFAULT_AUTH_ROUTE);
  }

  redirect(DEFAULT_PROTECTED_ROUTE);
}
