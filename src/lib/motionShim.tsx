import React, { createElement, forwardRef, Fragment, useState } from "react";

type AnyProps = Record<string, any>;

const MOTION_PROP_KEYS = new Set([
  "animate",
  "initial",
  "exit",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "viewport",
  "layout",
  "layoutId",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragTransition",
  "dragSnapToOrigin",
  "dragControls",
  "dragPropagation",
  "onUpdate",
  "onAnimationStart",
  "onAnimationComplete",
  "onLayoutAnimationStart",
  "onLayoutAnimationComplete",
  "custom",
  "inherit",
  "transformTemplate",
  "style",
]);

const sanitizeStyle = (style: AnyProps | undefined) => {
  if (!style || typeof style !== "object") return style;
  const cleaned = { ...style };
  delete cleaned.rotateX;
  delete cleaned.rotateY;
  delete cleaned.x;
  delete cleaned.y;
  delete cleaned.scale;
  delete cleaned.opacity;
  delete cleaned.rotate;
  return cleaned;
};

const stripMotionProps = (props: AnyProps) => {
  const cleaned: AnyProps = { ...props };
  for (const key of MOTION_PROP_KEYS) {
    if (key in cleaned) delete cleaned[key];
  }
  if (props.style) cleaned.style = sanitizeStyle(props.style);
  return cleaned;
};

const createMotionComponent = (tag: string) =>
  forwardRef<HTMLElement, AnyProps>(function MotionComponent({ children, ...props }, ref) {
    return createElement(tag, { ref, ...stripMotionProps(props) }, children);
  });

const componentCache = new Map<string, ReturnType<typeof createMotionComponent>>();

export const motion = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      if (!componentCache.has(prop)) {
        componentCache.set(prop, createMotionComponent(prop));
      }
      return componentCache.get(prop);
    },
  }
) as Record<string, ReturnType<typeof createMotionComponent>>;

export const AnimatePresence = ({ children }: { children?: React.ReactNode }) => <Fragment>{children}</Fragment>;

export const useMotionValue = <T,>(initial: T) => {
  const [value, setValue] = useState(initial);
  return {
    get: () => value,
    set: setValue,
  };
};

export const useTransform = () => 0 as any;
