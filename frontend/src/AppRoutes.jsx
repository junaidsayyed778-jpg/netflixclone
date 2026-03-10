import React from "react";
import { createBrowserRouter, Navigate } from 'react-router-dom';

import './App.scss';
import Header from './components/Header';
import HomeBanner from "./components/HomeBanner";
import Login from "./components/Login";
import Banner from "./components/Banner";
import List from "./components/List";
import Protected from "./components/Protected";
import Register from "./components/Register";
import Watchlist from "./components/watchlist";

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
    path: "/index.html",
    element: <Navigate to="/" />
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
    path: "/watchlist",
    element:(
          <Protected>
        <>
         
          <Watchlist />
        </>
      </Protected>
    )
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
   {
    path: "*",
    element: <Navigate to="/" />
  }
]);
