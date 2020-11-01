import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import { Switch, Route, Link } from "react-router-dom";
import { PostsList } from "./features/posts/PostsList";
import { Post } from "./features/posts/Post";

function App() {
  return (
    <div className="App">
      <div>
        <Link to="posts">Posts</Link> | <Link to="/">Counter</Link>
      </div>
      <div>
        <Switch>
          <Route exact path="/" component={Counter} />
          <Route exact path="/posts" component={PostsList} />
          <Route exact path="/posts/:id" component={Post} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
