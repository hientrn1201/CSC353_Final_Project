import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { FoodsContextProvider } from "./context/FoodsContext";
import Home from "./routes/Home";
import FoodDetailPage from "./routes/FoodDetailPage";
import { AuthProvider } from "./context/AuthContext";
import { Auth } from "./routes/Auth";

const App = () => {
  return (
    <FoodsContextProvider>
      <AuthProvider>
        <div className="container">
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/foods/:id" component={FoodDetailPage} />
              <Route exact path="/auth" component={Auth} />
            </Switch>
          </Router>
        </div>
      </AuthProvider>
    </FoodsContextProvider>
  );
};

export default App;
