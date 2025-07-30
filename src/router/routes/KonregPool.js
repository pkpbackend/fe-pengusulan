// ** React Imports
import { lazy } from "react";

const List = lazy(() => import("../../views/konregPool/features/list"));
const Closed = lazy(() => import("../../views/closed"));
const Detail = lazy(() => import("../../views/konregPool/features/detail"));

const KonregPool = [
  {
    element: <Closed />,
    path: "/konregpool/list",
    access: ["konreg_view"],
  },
  {
    element: <List />,
    path: "/konregpool/listx",
    access: ["konreg_view"],
  },
  {
    element: <Detail />,
    path: "/konregpool/:id",
    access: ["konreg_view"],
  },
];

export default KonregPool;
