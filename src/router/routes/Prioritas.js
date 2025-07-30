// ** React Imports
import { lazy } from "react";

const List = lazy(() => import("../../views/prioritas/features/list"));

const PrioritasRoutes = [
  {
    element: <List />,
    path: "/prioritas/list",
    access: ["prioritas_view"],
  },
];

export default PrioritasRoutes;
