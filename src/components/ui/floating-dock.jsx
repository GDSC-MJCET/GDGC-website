import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex md:hidden h-10 justify-center items-center gap-0 rounded-2xl bg-transparent pb-2",
        className
      )}>
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} isMobile />
      ))}
    </motion.div>
  );
};

const FloatingDockDesktop = ({
  items,
  className
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "hidden h-12 justify-center items-center gap-0 rounded-2xl bg-transparent pb-3 md:flex ",
        className
      )}>
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  isMobile = false
}) {
  let ref = useRef(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const sizes = isMobile 
    ? {
        width: [-150, 0, 150, 30, 60, 30],
        height: [-150, 0, 150, 30, 60, 30],
        iconWidth: [-150, 0, 150, 16, 32, 16],
        iconHeight: [-150, 0, 150, 16, 32, 16]
      }
    : {
        width: [-150, 0, 150, 40, 80, 40],
        height: [-150, 0, 150, 40, 80, 40],
        iconWidth: [-150, 0, 150, 20, 40, 20],
        iconHeight: [-150, 0, 150, 20, 40, 20]
      };

  let widthTransform = useTransform(distance, sizes.width.slice(0, 3), sizes.width.slice(3));
  let heightTransform = useTransform(distance, sizes.height.slice(0, 3), sizes.height.slice(3));

  let widthTransformIcon = useTransform(distance, sizes.iconWidth.slice(0, 3), sizes.iconWidth.slice(3));
  let heightTransformIcon = useTransform(distance, sizes.iconHeight.slice(0, 3), sizes.iconHeight.slice(3));

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-transparent ">
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className={cn(
                "absolute left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 whitespace-pre text-neutral-700 dark:border-gray-900 dark:bg-transparent dark:text-white",
                isMobile ? "-top-6 text-[10px]" : "-top-8 text-xs"
              )}>
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center gap-0">
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}