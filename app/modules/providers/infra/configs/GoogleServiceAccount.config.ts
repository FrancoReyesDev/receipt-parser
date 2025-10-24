import { Context } from "effect";

export class GoogleServiceAccountConfig extends Context.Tag(
  "GoogleServiceAccount"
)<GoogleServiceAccountConfig, string>() {}
