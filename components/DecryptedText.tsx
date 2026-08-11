"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";

interface DecryptedTextProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  speed?: number;
  maxIterations?: number;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover" | "inViewHover" | "click";
  clickMode?: "once" | "toggle";
}

function parseTextToChars(
  text: string,
  useOriginalCharsOnly: boolean,
  characters: string,
) {
  return useOriginalCharsOnly
    ? Array.from(new Set(text.split("")).values()).filter(
        (char) => char !== " ",
      )
    : characters.split("");
}

function getRevealOrder(length: number, direction: "start" | "end" | "center") {
  const order: number[] = [];
  if (length <= 0) return order;
  if (direction === "start") {
    for (let i = 0; i < length; i++) order.push(i);
    return order;
  }
  if (direction === "end") {
    for (let i = length - 1; i >= 0; i--) order.push(i);
    return order;
  }

  const middle = Math.floor(length / 2);
  let offset = 0;
  while (order.length < length) {
    if (offset % 2 === 0) {
      const idx = middle + offset / 2;
      if (idx >= 0 && idx < length) order.push(idx);
    } else {
      const idx = middle - Math.ceil(offset / 2);
      if (idx >= 0 && idx < length) order.push(idx);
    }
    offset++;
  }
  return order;
}

function getRandomChar(availableChars: string[]) {
  return availableChars[Math.floor(Math.random() * availableChars.length)];
}

function buildScrambledText(
  text: string,
  revealed: Set<number>,
  availableChars: string[],
) {
  return text
    .split("")
    .map((char, index) => {
      if (char === " ") return " ";
      return revealed.has(index) ? char : getRandomChar(availableChars);
    })
    .join("");
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  encryptedClassName = "",
  parentClassName = "",
  animateOn = "hover",
  clickMode = "once",
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(
    new Set(),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== "click");
  const [direction, setDirection] = useState<"forward" | "reverse">("forward");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const availableChars = useMemo(
    () => parseTextToChars(text, useOriginalCharsOnly, characters),
    [text, useOriginalCharsOnly, characters],
  );
  const orderRef = useRef<number[]>([]);
  const pointerRef = useRef(0);

  const encryptInstantly = useCallback(() => {
    setRevealedIndices(new Set());
    setDisplayText(buildScrambledText(text, new Set(), availableChars));
    setIsDecrypted(false);
  }, [text, availableChars]);

  const fillAllIndices = useCallback(() => {
    const filled = new Set<number>();
    for (let i = 0; i < text.length; i++) filled.add(i);
    return filled;
  }, [text.length]);

  const triggerDecrypt = useCallback(() => {
    orderRef.current = getRevealOrder(text.length, revealDirection);
    pointerRef.current = 0;
    setRevealedIndices(new Set());
    setDirection("forward");
    setIsAnimating(true);
  }, [text.length, revealDirection]);

  const triggerReverse = useCallback(() => {
    orderRef.current = getRevealOrder(text.length, revealDirection).reverse();
    pointerRef.current = 0;
    setRevealedIndices(fillAllIndices());
    setIsAnimating(true);
    setDirection("reverse");
  }, [text.length, revealDirection, fillAllIndices]);

  const resetToPlainText = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsAnimating(false);
    setRevealedIndices(new Set());
    setDisplayText(text);
    setIsDecrypted(true);
    setDirection("forward");
  }, [text]);

  useEffect(() => {
    if (!isAnimating) return;

    let currentIteration = 0;

    intervalRef.current = setInterval(() => {
      setRevealedIndices((prevRevealed) => {
        if (direction === "forward") {
          if (prevRevealed.size >= text.length) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsAnimating(false);
            setIsDecrypted(true);
            setDisplayText(text);
            return prevRevealed;
          }

          const nextIndex =
            orderRef.current[pointerRef.current] ?? prevRevealed.size;
          const nextRevealed = new Set(prevRevealed);
          nextRevealed.add(nextIndex);
          pointerRef.current += 1;
          setDisplayText(
            buildScrambledText(text, nextRevealed, availableChars),
          );
          return nextRevealed;
        }

        const currentRevealed = new Set(prevRevealed);
        if (currentRevealed.size === 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsAnimating(false);
          setIsDecrypted(false);
          setDisplayText(buildScrambledText(text, new Set(), availableChars));
          return currentRevealed;
        }
        const removeIndex =
          orderRef.current[pointerRef.current] ??
          Array.from(currentRevealed)[0];
        currentRevealed.delete(removeIndex);
        pointerRef.current += 1;
        setDisplayText(
          buildScrambledText(text, currentRevealed, availableChars),
        );
        return currentRevealed;
      });

      currentIteration += 1;
      if (currentIteration >= maxIterations && direction === "forward") {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsAnimating(false);
        setIsDecrypted(true);
        setDisplayText(text);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAnimating, text, speed, maxIterations, availableChars, direction]);

  useEffect(() => {
    if (animateOn === "click") {
      encryptInstantly();
    } else {
      setDisplayText(text);
      setIsDecrypted(true);
    }
  }, [animateOn, text, encryptInstantly]);

  const handleClick = () => {
    if (animateOn !== "click") return;
    if (clickMode === "once") {
      if (isDecrypted) return;
      triggerDecrypt();
    } else {
      if (isDecrypted) {
        triggerReverse();
      } else {
        triggerDecrypt();
      }
    }
  };

  const handleMouseEnter = () => {
    if (animateOn === "hover" || animateOn === "inViewHover") {
      if (!isAnimating) triggerDecrypt();
    }
  };

  const handleMouseLeave = () => {
    if (animateOn === "hover" || animateOn === "inViewHover") {
      resetToPlainText();
    }
  };

  const animateProps =
    animateOn === "hover" || animateOn === "inViewHover"
      ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
      : animateOn === "click"
        ? { onClick: handleClick }
        : {};

  return (
    <span
      ref={null}
      className={`inline-block whitespace-pre-wrap ${parentClassName}`.trim()}
      {...animateProps}
      {...props}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {displayText.split("").map((char, index) => {
          const revealed =
            revealedIndices.has(index) || (!isAnimating && isDecrypted);
          const charClass = revealed
            ? className
            : encryptedClassName || className;
          return (
            <span key={index} className={charClass}>
              {char}
            </span>
          );
        })}
      </span>
    </span>
  );
}
