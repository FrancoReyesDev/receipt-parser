import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

const routeConfig: RouteConfig = [
  index("./routes/home.tsx"),
  ...prefix("extractors", [
    layout("./layouts/extractors.layout.tsx", [
      index("./routes/extractors/index.tsx"),
      route(":id", "./routes/extractors/byId/index.tsx"),
    ]),
  ]),
  route("/api/receipts", "./routes/api/receipts.ts"),
];

export default routeConfig;
