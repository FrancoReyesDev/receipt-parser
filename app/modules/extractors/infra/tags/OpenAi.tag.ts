import { Context } from "effect";
import type OpenAI from "openai";

export const OpenAiTag = Context.Tag<"OpenAi">("OpenAi");
