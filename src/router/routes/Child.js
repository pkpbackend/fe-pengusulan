// ** React Imports
import { lazy } from "react"

const List = lazy(() => import("../../views/konregPool/features/list"))

const KonregPool = [
  {
    element: <List />,
    path: "/child"
  },
  {
    element: <List />,
    path: "/child-1"
  },
]

export default KonregPool
