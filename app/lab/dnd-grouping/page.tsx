'use client';

import { motion, useMotionValue, MotionValue } from 'motion/react';
import { useRef, useState, useCallback, useEffect } from 'react';
import React from 'react';

interface ItemState {
  id: number;
  isDragging: boolean;
  isColliding: boolean;
  shouldSnapBack: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  children: ItemState[];
  isGroupContainer: boolean;
  originalId?: number; // For tracking original identity in groups
}

export default function Page() {
  const constraintsRef = useRef(null);

  // Create motion values at component level
  const motionValue0 = useMotionValue(0);
  const motionValue1 = useMotionValue(0);
  const motionValue2 = useMotionValue(0);
  const motionValue3 = useMotionValue(0);
  const motionValue0Y = useMotionValue(0);
  const motionValue1Y = useMotionValue(0);
  const motionValue2Y = useMotionValue(0);
  const motionValue3Y = useMotionValue(0);

  const [items, setItems] = useState<ItemState[]>([]);

  // Initialize items with motion values and refs
  useEffect(() => {
    const motionValues = [
      { x: motionValue0, y: motionValue0Y },
      { x: motionValue1, y: motionValue1Y },
      { x: motionValue2, y: motionValue2Y },
      { x: motionValue3, y: motionValue3Y },
    ];

    const initialItems = Array.from({ length: 4 }).map((_, index) => ({
      id: index,
      isDragging: false,
      isColliding: false,
      shouldSnapBack: false,
      ref: React.createRef<HTMLDivElement | null>(),
      x: motionValues[index].x,
      y: motionValues[index].y,
      children: [],
      isGroupContainer: false,
      originalId: index,
    }));
    setItems(initialItems);
  }, [
    motionValue0,
    motionValue1,
    motionValue2,
    motionValue3,
    motionValue0Y,
    motionValue1Y,
    motionValue2Y,
    motionValue3Y,
  ]);

  // Collision detection function
  const checkCollisions = useCallback((draggedItem: ItemState) => {
    if (!draggedItem.ref.current) return;

    const draggedRect = draggedItem.ref.current.getBoundingClientRect();

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === draggedItem.id) {
          return item; // Don't check collision with itself
        }

        if (!item.ref.current || item.isDragging) {
          return { ...item, isColliding: false };
        }

        const itemRect = item.ref.current.getBoundingClientRect();

        // Check if rectangles overlap
        const isOverlapping = !(
          draggedRect.right < itemRect.left ||
          draggedRect.left > itemRect.right ||
          draggedRect.bottom < itemRect.top ||
          draggedRect.top > itemRect.bottom
        );

        return { ...item, isColliding: isOverlapping };
      }),
    );
  }, []);

  // Handle drag start
  const handleDragStart = (item: ItemState) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === item.id
          ? { ...i, isDragging: true, shouldSnapBack: false }
          : { ...i, isColliding: false, shouldSnapBack: false },
      ),
    );
  };

  // Find closest colliding item
  const findClosestCollidingItem = (draggedItem: ItemState): ItemState | null => {
    if (!draggedItem.ref.current) return null;

    const draggedRect = draggedItem.ref.current.getBoundingClientRect();
    const draggedCenter = {
      x: draggedRect.left + draggedRect.width / 2,
      y: draggedRect.top + draggedRect.height / 2,
    };

    let closestItem = null;
    let minDistance = Infinity;

    items.forEach((otherItem) => {
      if (otherItem.id === draggedItem.id || !otherItem.ref.current || otherItem.isDragging) {
        return;
      }

      const otherRect = otherItem.ref.current.getBoundingClientRect();

      // Check if rectangles overlap
      const isOverlapping = !(
        draggedRect.right < otherRect.left ||
        draggedRect.left > otherRect.right ||
        draggedRect.bottom < otherRect.top ||
        draggedRect.top > otherRect.bottom
      );

      if (isOverlapping) {
        const otherCenter = {
          x: otherRect.left + otherRect.width / 2,
          y: otherRect.top + otherRect.height / 2,
        };

        const distance = Math.sqrt(
          Math.pow(draggedCenter.x - otherCenter.x, 2) +
            Math.pow(draggedCenter.y - otherCenter.y, 2),
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestItem = otherItem;
        }
      }
    });

    return closestItem;
  };

  // Handle drag end
  const handleDragEnd = (item: ItemState) => {
    const closestCollidingItem = findClosestCollidingItem(item);

    if (closestCollidingItem) {
      // Group the items
      setItems((prevItems) => {
        const newItems = prevItems.filter((i) => i.id !== item.id); // Remove dragged item
        const targetItem = closestCollidingItem;

        return newItems.map((i) => {
          if (i.id === targetItem.id) {
            // Create grouped item - reset to origin
            const groupedDraggedItem = {
              ...item,
              isDragging: false,
              isColliding: false,
              shouldSnapBack: false,
            };
            // Reset position for grouped item
            groupedDraggedItem.x.set(0);
            groupedDraggedItem.y.set(0);

            return {
              ...i,
              isDragging: false,
              isColliding: false,
              shouldSnapBack: false,
              children: [...i.children, groupedDraggedItem],
              isGroupContainer: true,
            };
          }
          return {
            ...i,
            isDragging: false,
            isColliding: false,
            shouldSnapBack: false,
          };
        });
      });
    } else {
      // No collision - snap back
      setItems((prevItems) =>
        prevItems.map((i) => ({
          ...i,
          isDragging: i.id === item.id ? false : i.isDragging,
          isColliding: false,
          shouldSnapBack: i.id === item.id ? true : false,
        })),
      );
    }
  };

  // Handle drag motion
  const handleDrag = (item: ItemState) => {
    if (item.isDragging) {
      checkCollisions(item);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center font-[family-name:var(--font-open-runde)]">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-2xl font-bold">App Grouping Demo</h1>
        <p className="text-gray-600">
          Drag items onto others to create groups (like iOS/Android app folders). Items snap back if
          no collision occurs.
        </p>
      </div>

      <div ref={constraintsRef} className="grid grid-cols-2 gap-4 p-8">
        {items.map((item) => (
          <motion.div
            key={item.id}
            ref={item.ref}
            className={`relative size-16 rounded-2xl transition-colors duration-200 hover:cursor-grab active:cursor-grabbing ${
              item.isDragging
                ? 'scale-110 bg-blue-400 shadow-lg'
                : item.isColliding
                  ? 'bg-red-300 ring-2 ring-red-500'
                  : item.isGroupContainer
                    ? 'border-2 border-purple-400 bg-purple-200'
                    : 'bg-neutral-200'
            } `}
            drag
            dragConstraints={constraintsRef}
            style={{ x: item.x, y: item.y }}
            animate={item.shouldSnapBack ? { x: 0, y: 0 } : {}}
            onDragStart={() => handleDragStart(item)}
            onDragEnd={() => handleDragEnd(item)}
            onDrag={() => handleDrag(item)}
            onAnimationComplete={() => {
              if (item.shouldSnapBack) {
                setItems((prevItems) =>
                  prevItems.map((i) => (i.id === item.id ? { ...i, shouldSnapBack: false } : i)),
                );
              }
            }}
            whileDrag={{ scale: 1.1 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          >
            {/* Show grouped items */}
            {item.isGroupContainer && item.children.length > 0 && (
              <div className="absolute inset-1 grid grid-cols-2 gap-0.5">
                {/* Show the container itself as first item */}
                <div className="flex size-6 items-center justify-center rounded bg-white/80 text-xs font-bold">
                  {item.originalId !== undefined ? item.originalId + 1 : item.id + 1}
                </div>
                {/* Show grouped items */}
                {item.children.slice(0, 3).map((child) => (
                  <div
                    key={child.id}
                    className="flex size-6 items-center justify-center rounded bg-white/80 text-xs font-bold"
                  >
                    {child.originalId !== undefined ? child.originalId + 1 : child.id + 1}
                  </div>
                ))}
                {/* Show +X if more than 3 items */}
                {item.children.length > 3 && (
                  <div className="flex size-6 items-center justify-center rounded bg-white/60 text-xs font-bold">
                    +{item.children.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Show single item number when not grouped */}
            {!item.isGroupContainer && (
              <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {item.originalId !== undefined ? item.originalId + 1 : item.id + 1}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 max-w-md text-center text-sm text-gray-500">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded bg-neutral-200"></div>
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded bg-blue-400"></div>
            <span>Dragging</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded bg-red-300 ring-1 ring-red-500"></div>
            <span>Collision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded border border-purple-400 bg-purple-200"></div>
            <span>Group</span>
          </div>
        </div>
        <p className="mt-2 text-xs">
          📱 Drag items onto others to create app-like groups • Items snap back if no collision
          occurs
        </p>
      </div>
    </div>
  );
}
