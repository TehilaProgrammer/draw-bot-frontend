# DrawBot Frontend

A React-based frontend for the DrawBot application - an AI-powered drawing bot that converts natural language instructions into canvas drawings.

## Features

- **AI-Powered Drawing**: Enter natural language instructions and get automatic drawings
- **Canvas Drawing Engine**: Real-time drawing on HTML5 Canvas
- **Undo/Redo**: Full history management for drawing operations
- **Save/Load**: Save drawings to database and load them back
- **Export**: Download drawings as PNG images
- **Modern UI**: Built with Material-UI for a clean, responsive interface
- **Local Demo Mode**: Test the application without backend connection
- **Animation Support**: Watch drawings being created step by step

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000` (optional for demo mode)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd drawbot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── api/                 # API services
│   ├── aiService.ts     # AI integration
│   ├── authService.ts   # Authentication
│   └── drawingService.ts # Drawing operations
├── components/          # React components
│   ├── AIPromptInput.tsx    # AI prompt input
│   ├── DrawingCanvas.tsx    # Canvas component
│   ├── DrawingControls.tsx  # Drawing tools
│   └── DrawingContainer.tsx # Main container
├── services/            # Local services
│   └── localDrawingService.ts # Local demo service
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── drawingEngine.ts # Canvas drawing engine
└── pages/              # Page components
    └── HomePage.tsx
```

## API Integration

The frontend integrates with a C# ASP.NET Core backend with the following endpoints:

### Drawing Operations
- `POST /api/drawing` - Create new drawing
- `GET /api/drawing/{id}` - Get drawing by ID
- `GET /api/drawing/user/{userId}` - Get user drawings
- `POST /api/drawing/{id}/command` - Add command to drawing
- `DELETE /api/drawing/command/{commandId}` - Delete command
- `PUT /api/drawing/{id}` - Update drawing title
- `DELETE /api/drawing/{id}` - Delete drawing

### AI Operations
- `POST /api/ai/generate` - Generate drawing commands from prompt
- `POST /api/ai/generate/{drawingId}` - Generate commands for existing drawing

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

## Data Models

### Drawing
```typescript
interface Drawing {
  drawingId: number;
  userId: number;
  title: string;
  createsAt: Date;
  updatesAt: Date;
  commands: DrawingCommand[];
}
```

### DrawingCommand (Database Format)
```typescript
interface DrawingCommand {
  drawingCommandId: number;
  drawingId: number;
  commandType: string;  // 'LINE', 'CIRCLE', 'RECTANGLE', 'TRIANGLE', 'TEXT', 'CLEAR'
  parameters: string;   // JSON string with command parameters
  order: number;
}
```

### DrawCommand (Simple Format)
```typescript
interface DrawCommand {
  type: 'line' | 'circle' | 'rect' | 'triangle' | 'text' | 'clear';
  x?: number;
  y?: number;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  x3?: number;
  y3?: number;
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
}
```

## Drawing Commands

The system supports the following drawing commands in simple format:

### LINE
```json
{
  "type": "line",
  "x1": 100, "y1": 100, "x2": 200, "y2": 200,
  "color": "black"
}
```

### CIRCLE
```json
{
  "type": "circle",
  "x": 150, "y": 150, "radius": 50,
  "color": "yellow"
}
```

### RECTANGLE
```json
{
  "type": "rect",
  "x": 100, "y": 100, "width": 200, "height": 100,
  "color": "red"
}
```

### TRIANGLE
```json
{
  "type": "triangle",
  "x1": 100, "y1": 200, "x2": 200, "y2": 100, "x3": 300, "y3": 200,
  "color": "green"
}
```

### TEXT
```json
{
  "type": "text",
  "x": 100, "y": 100, "text": "Hello World",
  "fontSize": 16, "fontFamily": "Arial", "color": "black"
}
```

### CLEAR
```json
{
  "type": "clear"
}
```

## Local Demo Mode

The application includes a local demo mode that works without a backend connection. It supports the following drawing types:

- **House** - Draws a house with roof, door, and windows
- **Sun** - Draws a yellow sun
- **Tree** - Draws a tree with trunk and leaves
- **Boat** - Draws a boat with sail and flag
- **Flower** - Draws a flower with stem, leaves, and petals
- **Heart** - Draws a heart using line segments
- **Star** - Draws a 5-pointed star
- **Rainbow** - Creates a colorful rainbow effect

## Usage

1. **Enter Drawing Instructions**: Type natural language instructions in the input field
2. **Generate Drawing**: Click "Create Drawing" to send instructions to AI (or local service)
3. **View Result**: The drawing will appear on the canvas
4. **Edit**: Use Undo/Redo buttons to navigate through drawing history
5. **Save**: Click "Save" to store the drawing (locally or in database)
6. **Export**: Click "Download Image" to save as PNG file

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Switching Between Local and AI Service

The application includes a toggle button to switch between:
- **Local Demo Service**: Works offline, includes predefined drawings
- **AI Service**: Connects to backend API for AI-generated drawings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
