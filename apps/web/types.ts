import { UrlObject } from "url";

export type Url = string | UrlObject;

export type GameStatusReleased = "Released";
export type GameStatusDevelopment = "Development";
export type GameStatusHold = "Hold";
export type GameStatusCancelled = "Cancelled";

export type GameStatus =
  | GameStatusReleased
  | GameStatusDevelopment
  | GameStatusHold
  | GameStatusCancelled;
