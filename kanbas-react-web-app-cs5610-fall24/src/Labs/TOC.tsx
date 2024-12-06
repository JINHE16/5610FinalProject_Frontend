import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";

export default function TOC() {
  const { pathname } = useLocation();

  const navLinks = [
    { id: "wd-a", href: "#/Labs", label: "Labs" },
    { id: "wd-a1", href: "#/Labs/Lab1", label: "Lab 1", pathMatch: "Lab1" },
    { id: "wd-a2", href: "#/Labs/Lab2", label: "Lab 2", pathMatch: "Lab2" },
    { id: "wd-a3", href: "#/Labs/Lab3", label: "Lab 3", pathMatch: "Lab3" },
    { id: "wd-a4", href: "#/Labs/Lab4", label: "Lab 4", pathMatch: "Lab4" },
    { id: "wd-a5", href: "#/Labs/Lab5", label: "Lab 5", pathMatch: "Lab5" },
    { id: "wd-k", href: "#/Kanbas", label: "Kanbas" },
    { id: "wd-github-frontend", href: "https://github.com/JHE016/kanbas-react-web-app-cs5610-fall24/", label: "GitHub-frontend" },
    { id: "wd-github-backend", href: "https://github.com/JHE016/kanbas-node-server-app", label: "GitHub-backend" },
    { id: "wd-server-render", href: "https://kanbas-node-server-app-5a9o.onrender.com", label: "server-render" },
  ];

  return (
    <ul className="nav nav-pills">
      {navLinks.map((item) => (
        <li key={item.id} className="nav-item">
          <a
            id={item.id}
            href={item.href}
            className={`nav-link ${item.pathMatch && pathname.includes(item.pathMatch) ? "active" : ""}`}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
