# Flow - Kanban Board Application

A modern, production-ready Kanban board application built with React 18+, TypeScript, and Context API.

## Features

- **Three Fixed Columns**: To Do, In Progress, and Done
- **Drag & Drop**: Reorder tasks within columns or move between columns
- **Bidirectional Movement**: Move tasks forward and backward through columns
- **Task Details Modal**: Click any task to view full information, edit, or delete
- **Inline Create**: + Create button in each column (no separate form)
- **Task Reordering**: Drag tasks up/down to customize column order
- **Fixed Height Cards**: Clean, compact task display showing only titles
- **Type-Safe**: Full TypeScript strict mode support
- **State Persistence**: Automatic localStorage sync
- **Responsive Design**: Mobile-friendly UI with Flexbox and Grid
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Error Handling**: Robust edge case handling and validation
- **No External Dependencies**: Pure React with Context API and useReducer

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens automatically at http://localhost:5173

### Build

```bash
npm run build
```

### Type Check

```bash
npm run lint
```

## Project Structure

```
src/
├── components/              # React components
│   ├── Board.tsx           # Main board container
│   ├── Column.tsx          # Column with drag & drop
│   ├── TaskCard.tsx        # Individual task card (draggable)
│   ├── TaskModal.tsx       # Task details & edit modal
│   └── CreateTaskModal.tsx # Create task modal
├── context/                # State management
│   ├── BoardContext.tsx    # Context setup
│   └── boardReducer.ts     # Reducer with reordering logic
├── styles/                 # CSS files
│   ├── index.css           # Global styles
│   ├── Board.css           # Board layout
│   ├── Column.css          # Column styles
│   ├── TaskCard.css        # Task card styles
│   └── TaskModal.css       # Modal styles
├── types/                  # TypeScript definitions
│   └── index.ts            # Task and state types
├── App.tsx                 # App component
└── main.tsx                # Entry point
```

## State Management

### Task Interface

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  column: "todo" | "inProgress" | "done";
  createdAt: number;
}
```

### BoardState Interface

```typescript
interface BoardState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}
```

### Reducer Actions

- `ADD_TASK`: Creates a new task in specified column with auto-assigned order
- `DELETE_TASK`: Removes a task by ID and recalculates column order
- `MOVE_TASK`: Moves task to another column and recalculates order
- `REORDER_TASK`: Changes task position within same column
- `UPDATE_TASK`: Edits task title and description
- `LOAD_FROM_STORAGE`: Initializes state from localStorage
- `SET_ERROR`: Sets error message

## Features in Detail

### Task Creation

- **Modal-based**: Click + Create button in any column
- **In-column creation**: Tasks created directly in the selected column
- Title and description required
- Title max: 100 characters
- Description max: 500 characters
- Real-time character count display
- Form validation with error messages

### Task Management

- **Click to view**: Click any task card to open full details modal
- **Edit modal**: View full information, edit title/description, delete
- **Drag to move**: Drag tasks between columns
- **Drag to reorder**: Drag tasks up/down within same column
- **Fixed height cards**: Shows only title (2-line max) with direction indicators
- **Bidirectional flow**: Move tasks backward or forward
- **Visual feedback**: Drag-over highlighting on columns
- **Timestamps**: Creation date displayed in task details modal

### Data Persistence

- Automatic localStorage sync on every state change
- Graceful fallback for corrupted storage data
- Validation of stored data on load
- Error handling for storage quota exceeded

### Responsive Design

Optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (<768px)

### Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Error announcements via `role="alert"`

## Edge Case Handling

1. **Blank Submissions**: Form disabled until both fields are filled
2. **Rapid Interactions**: Reducer ensures immutable updates with proper sequencing
3. **Duplicate IDs**: UUID-like generation with collision detection
4. **Corrupted Storage**: Validation and fallback to empty state
5. **Large Character Input**: Character counters and maxLength attributes
6. **Storage Quota**: Error logging for quota exceeded scenarios

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading of localStorage data
- Memoization-ready component structure
- CSS transitions for smooth animations
- Minimal re-renders with Context API

## TypeScript Strict Mode

All code passes TypeScript strict mode:
- No implicit any
- Strict null checks
- Exhaustive reducer switch cases
- Proper type inference

## Production Ready

- Clean, professional code
- Proper error handling
- Accessibility compliance
- Mobile responsive
- No console errors or warnings
- Easy to deploy and maintain

## License

MIT
