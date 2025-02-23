import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Types for our kanban items
interface KanbanItem {
  id: string;
  content: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
}

const KanbanBoard = () => {
  // Initial state with some example columns
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "todo",
      title: "To Do",
      items: [
        { id: "task-1", content: "First task" },
        { id: "task-2", content: "Second task" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      items: [],
    },
    {
      id: "done",
      title: "Done",
      items: [],
    },
  ]);

  const [newTaskText, setNewTaskText] = useState("");
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  // Handle drag and drop
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Create a new array of columns to modify
    const newColumns = [...columns];
    
    // Find source and destination columns
    const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = columns.findIndex(col => col.id === destination.droppableId);
    
    // Get the item being dragged
    const [removed] = newColumns[sourceColIndex].items.splice(source.index, 1);
    
    // Add the item to its new position
    newColumns[destColIndex].items.splice(destination.index, 0, removed);
    
    setColumns(newColumns);
  };

  // Add a new task to a column
  const addNewTask = (columnId: string) => {
    if (!newTaskText.trim()) return;

    const newColumns = columns.map(col => {
      if (col.id === columnId) {
        return {
          ...col,
          items: [
            ...col.items,
            {
              id: `task-${Date.now()}`,
              content: newTaskText,
            },
          ],
        };
      }
      return col;
    });

    setColumns(newColumns);
    setNewTaskText("");
    setAddingToColumn(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-8 text-2xl font-bold text-gray-800">Kanban Board</h1>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {columns.map((column) => (
              <div
                key={column.id}
                className="rounded-lg bg-gray-100 p-4 shadow-sm"
              >
                <h2 className="mb-4 text-lg font-semibold text-gray-700">
                  {column.title}
                </h2>

                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[200px]"
                    >
                      {column.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                            >
                              {item.content}
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {addingToColumn === column.id ? (
                        <div className="mt-3 space-y-2">
                          <Input
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="Enter task description..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addNewTask(column.id);
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addNewTask(column.id)}
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAddingToColumn(null);
                                setNewTaskText("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          className="mt-2 w-full justify-start"
                          onClick={() => setAddingToColumn(column.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add a card
                        </Button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;