import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FoodsContextProvider } from "./context/FoodsContext";
import Home from "./routes/Home";
import FoodDetailPage from "./routes/FoodDetailPage";
import UpdatePage from "./routes/UpdatePage";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <FoodsContextProvider>
      <AuthProvider>
        <div className="container">
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/foods/:id/update" component={UpdatePage} />
              <Route exact path="/foods/:id" component={FoodDetailPage} />
            </Switch>
          </Router>
        </div>
      </AuthProvider>
    </FoodsContextProvider>
  );
};

export default App;
