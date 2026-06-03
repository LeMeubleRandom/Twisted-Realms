import { NavLink, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "../assets/css/decks.css";
import Card from "../components/Card";

function Decks({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <main></main>;
}

export default Decks;
