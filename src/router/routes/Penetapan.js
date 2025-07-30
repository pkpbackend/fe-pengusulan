// ** React Imports
import { lazy } from "react";

const List = lazy(() => import("../../views/penetapan/features/list"));
const Closed = lazy(() => import("../../views/closed"));
const Detail = lazy(() => import("../../views/penetapan/features/detail"));

const Penetapan = [
  {
    element: <Closed />,
    path: "/penetapan/list",
    access: ["penetapan_view"],
  },
  {
    element: <List />,
    path: "/penetapan/listx",
    access: ["penetapan_view"],
  },
  {
    element: <Detail />,
    path: "/penetapan/:id",
    access: ["penetapan_view"],
  },
];

export default Penetapan;
