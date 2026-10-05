import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";

import { useRef, useState, type ReactNode } from "react";

type DockItem = {
  title: string;
  icon: ReactNode;
  href: string;
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
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
}: {
  items: DockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
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
}: {
  items: DockItem[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
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
}: DockItem & {
  mouseX: MotionValue<number>;
  isMobile?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

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

  const widthTransform = useTransform(distance, sizes.width.slice(0, 3), sizes.width.slice(3));
  const heightTransform = useTransform(distance, sizes.height.slice(0, 3), sizes.height.slice(3));

  const widthTransformIcon = useTransform(distance, sizes.iconWidth.slice(0, 3), sizes.iconWidth.slice(3));
  const heightTransformIcon = useTransform(distance, sizes.iconHeight.slice(0, 3), sizes.iconHeight.slice(3));

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" >
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