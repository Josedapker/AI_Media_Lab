import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableMedia } from './DraggableMedia';
import { useMediaStore } from '../store/mediaStore';
import type { GeneratedMedia } from '../types';

interface SortableGalleryProps {
  items: GeneratedMedia[];
}

export function SortableGallery({ items }: SortableGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const { reorderMedia } = useMediaStore();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      reorderMedia(active.id, over.id);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <DraggableMedia key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}