interface AuthParams {
  orgId: string;
  userId: string;
}

interface ExtractorParams extends AuthParams {
  id: string;
}

// Bloques semánticos
const org = (orgId: string) => `org:${orgId}`;
const user = (userId: string) => `user:${userId}`;
const extractor = (id: string) => `extractor:${id}`;

// Composición pura
const path = (...parts: string[]) => parts.join("/");

// Composed factories
export const kvSchema = {
  user: ({ orgId, userId }: AuthParams) => path(org(orgId), user(userId)),
  extractor: ({ orgId, userId, id }: ExtractorParams) =>
    path(org(orgId), user(userId), extractor(id)),
};
