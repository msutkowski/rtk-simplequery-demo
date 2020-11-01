import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";

import { rest, setupWorker } from "msw";
import { createEntityAdapter } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import { Post } from "./app/services/posts";

// We're just going to use a simple in-memory store for both the counter and posts
// The entity adapter will handle modifications when triggered by the MSW handlers

let count = 0;

const adapter = createEntityAdapter<Post>();

let state = adapter.getInitialState();
state = adapter.setAll(state, [
  { id: 1, name: "Test one" },
  { id: 2, name: "Test two" },
]);

export const worker = setupWorker(
  ...[
    rest.put<{ amount: number }>("/increment", (req, res, ctx) => {
      const { amount } = req.body;
      count = count += amount;

      return res(ctx.json({ count }));
    }),

    rest.put<{ amount: number }>("/decrement", (req, res, ctx) => {
      const { amount } = req.body;
      count = count -= amount;

      return res(ctx.json({ count }));
    }),

    rest.get("/count", (req, res, ctx) => {
      return res(ctx.json({ count }));
    }),

    rest.get("/posts", (req, res, ctx) => {
      return res(ctx.json(Object.values(state.entities)));
    }),

    rest.get("/posts/:id", (req, res, ctx) => {
      const { id } = req.params as { id: string };

      return res(ctx.json(state.entities[id]));
    }),

    rest.put("/posts/:id", (req, res, ctx) => {
      const { id } = req.params as { id: string };
      const changes = req.body as Partial<Post>;

      state = adapter.updateOne(state, { id, changes });

      return res(ctx.json(state.entities[id]));
    }),

    rest.delete("/posts/:id", (req, res, ctx) => {
      const { id } = req.params as { id: string };

      state = adapter.removeOne(state, id);

      return res(
        ctx.json({
          id,
          success: true,
        })
      );
    }),
  ]
);

// Initialize the msw worker, wait for the service worker registration to resolve, then mount
worker.start().then(() =>
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  )
);
