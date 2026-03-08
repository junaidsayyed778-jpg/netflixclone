import React from "react";
import './App.scss';
import Header from './components/Header';
import HomeBanner from "./components/HomeBanner";
import Login from "./components/Login";
import Banner from "./components/Banner";
import List from "./components/List";
import { createBrowserRouter } from 'react-router-dom';
import Protected from "./components/Protected";
import Register from "./components/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <>
          <Header />
          <HomeBanner />
        </>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Header />
        <Login />
      </>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <Header />
        <Register />
      </>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <>
          <Header />
          <Banner />
          <List title="Netflix Originals" param="originals" />
          <List title="Trending Now" param="trending" />
          <List title="Now Playing" param="now_playing" />
          <List title="Popular" param="popular" />
          <List title="Top Rated" param="top_rated" />
          <List title="Upcoming" param="upcoming" />
        </>
      </Protected>
    ),
  },
]);
