import { Context } from "effect";
import type OpenAI from "openai";

export class OpenAIClient extends Context.Tag("OpenAIClient")<
  OpenAIClient,
  OpenAI
>() {}
