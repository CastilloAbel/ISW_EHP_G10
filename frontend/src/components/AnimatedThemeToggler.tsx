import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import * as React from "react";

import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const AnimatedThemeToggler = ({
  className,
  duration = 700,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    // Verificar si el navegador soporta View Transition API
    if (!(document as any).startViewTransition) {
      // Fallback sin animación
      flushSync(() => {
        const newTheme = !isDark;

        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      });

      return;
    }

    await (document as any).startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark;

        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }, [isDark, duration]);

  return (
    <button
      ref={buttonRef}
      aria-label="Alternar tema"
      className={cn(
        "p-2 rounded-lg transition-all duration-200",
        "hover:bg-white/10 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-white/50",
        className,
      )}
      onClick={toggleTheme}
      {...props}
    >
      {isDark ? (
        <Sun className="w-6 h-6 md:w-7 md:h-7 text-yellow-300 transition-transform duration-300 rotate-0 hover:rotate-180" />
      ) : (
        <Moon className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
      <span className="sr-only">Alternar tema</span>
    </button>
  );
};
