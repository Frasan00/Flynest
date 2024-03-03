import { logError } from "../Logger";
import { ApiRouteType } from "./Server/ServerTypes";

export function validatePath(str: string): string {
  if (!str.startsWith("/")) {
    str = `/${str}`;
  }

  if (!str.endsWith("/")) {
    str = `${str}/`;
  }

  return str.replace(/\/+/g, "/");
}

export function checkDuplicateTopic(
  topic: string,
  inputRoutes: ApiRouteType,
): void {
  const routes = Object.keys(inputRoutes);
  if (routes.includes(topic)) {
    logError(new Error("Duplicate route"), `Route ${topic} already exists`);
    process.exit(1);
  }

  return;
}
