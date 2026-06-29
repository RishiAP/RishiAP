"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

interface SortableTableProps<T extends { id: string }> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  children: React.ReactNode;
}

export function SortableTable<T extends { id: string }>({
  items,
  onReorder,
  children,
}: SortableTableProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex);
      onReorder(reorderedItems);
    }
  };

  return (
    <DndContext id="dnd-sortable" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

interface SortableTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  id: string;
  children: React.ReactNode;
}

export function SortableTableRow({ id, children, className, ...props }: SortableTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: isDragging ? "relative" : "static",
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${className || ""} ${isDragging ? "opacity-50 bg-muted" : ""}`}
      {...props}
    >
      <TableCell className="w-[40px] px-2 text-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 mx-auto" />
      </TableCell>
      {children}
    </TableRow>
  );
}
