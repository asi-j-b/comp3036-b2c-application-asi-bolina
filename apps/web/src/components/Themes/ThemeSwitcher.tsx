"use client";

import { Button } from "@repo/ui/button";
import { useEffect, useState } from "react";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const htmlTheme = document.documentElement.getAttribute("data-theme");
    if (htmlTheme === "dark") {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.cookie = `theme=${nextTheme}; path=/`;
  };

  return (
    <Button onClick={toggleTheme}>
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
