import "@src/App.scss";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";

// ** Router Import
import { setAuthUser } from "./redux/auth";
import Router from "./router/Router";
import { getUser } from "./utility/LoginHelpers";

const App = () => {
  const dispatch = useDispatch();
  const user = getUser();
  useEffect(() => {
    if (user) {
      dispatch(setAuthUser(user));
      console.log("user", user);
      console.log("region", JSON.parse(user.user.region));
    }
  }, [dispatch, user]);

  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
