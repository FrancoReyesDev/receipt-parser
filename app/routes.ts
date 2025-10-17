import { type RouteConfig, index, route } from "@react-router/dev/routes";

const routeConfig: RouteConfig = [
  index("./routes/home.tsx"),
  route("/api/receipts", "./routes/api/receipts.ts"),
];

export default routeConfig;
