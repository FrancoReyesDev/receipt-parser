import { Context } from "effect";

export class KVNamespaceTag extends Context.Tag("KVNamespace")<
  KVNamespaceTag,
  KVNamespace
>() {}
