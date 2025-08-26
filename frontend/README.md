# KS-QE Platform Frontend

A sophisticated React + TypeScript frontend for the Quality Engineering platform, featuring modern glassmorphism design, real-time updates, and comprehensive QA analysis tools.

## 🎨 Features

- **Modern UI/UX**: Glassmorphism effects with gradient backgrounds
- **Real-time Updates**: Server-Sent Events for live progress tracking
- **File Management**: Drag-and-drop uploads with file tree navigation
- **Interactive Dashboards**: Beautiful progress indicators and coverage charts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Preview**: Monaco Editor with syntax highlighting
- **State Management**: Zustand + TanStack React Query

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components
- **Lucide React** for consistent iconography
- **Zustand** for simple state management
- **TanStack React Query** for server state
- **React Router v6** for client-side routing
- **Monaco Editor** for code editing
- **react-dropzone** for file uploads
- **sonner** for toast notifications

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:
```env
VITE_API_BASE=http://localhost:8000
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── AppShell.tsx     # Main layout with navigation
│   ├── StatusBadge.tsx  # Status indicators with animations
│   ├── AgentsProgress.tsx # QA workflow progress stepper
│   ├── CoverageCard.tsx # Test coverage visualization
│   ├── FileUploader.tsx # File upload with drag-and-drop
│   ├── FileTree.tsx     # Interactive file tree
│   ├── CodePreview.tsx  # Monaco editor for code preview
│   └── RunsTable.tsx    # Analysis runs table
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Files.tsx        # File management
│   ├── TestCases.tsx    # Test case management
│   ├── Runs.tsx         # Analysis runs history
│   └── RunDetail.tsx    # Individual run details
├── lib/                 # Utilities and configuration
│   ├── api.ts          # API client with error handling
│   ├── store.ts        # Zustand global state
│   ├── queryClient.ts  # TanStack Query configuration
│   └── utils.ts        # Utility functions
├── types.ts            # TypeScript type definitions
└── index.css           # Global styles and Tailwind config
```

## 🎯 Key Components

### AppShell
The main layout component featuring:
- Glassmorphism header with search functionality
- Responsive sidebar with navigation
- Real-time stats in sidebar
- Mobile-friendly design

### AgentsProgress
Interactive stepper component showing:
- 8-step QA analysis workflow
- Real-time progress updates
- Beautiful animations and transitions
- Status indicators for each step

### CoverageCard
Comprehensive coverage visualization:
- Overall coverage percentage
- Detailed metrics (statements, functions, branches)
- Visual progress bars
- Coverage insights and recommendations

### FileTree
Interactive file browser with:
- Collapsible directory structure
- Tri-state checkboxes for selection
- File type icons
- Search and filter capabilities

## 🔌 API Integration

The frontend communicates with the FastAPI backend through:

### REST Endpoints
- File upload and management
- Analysis run creation and retrieval
- Coverage data fetching

### Server-Sent Events (SSE)
- Real-time progress updates during analysis
- Live status changes for agents
- Automatic UI updates without polling

### Error Handling
- Centralized error handling in API client
- User-friendly error messages
- Automatic retry for failed requests
- Toast notifications for user feedback

## 🎨 Design System

### Colors
- **Primary**: Blue to purple gradients
- **Secondary**: Emerald to teal gradients
- **Status Colors**: Green (success), amber (warning), red (error)
- **Backgrounds**: Subtle gradients with glassmorphism

### Typography
- **Headings**: Inter font with gradient text effects
- **Body**: System font stack for readability
- **Code**: Monospace fonts for code blocks

### Animations
- **Hover Effects**: Scale and shadow transitions
- **Loading States**: Pulse and fade animations
- **Progress Indicators**: Smooth width transitions
- **Page Transitions**: Fade and slide effects

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Code Style
- ESLint configuration for consistent code style
- TypeScript strict mode enabled
- Prettier for code formatting
- Import/export organization

### State Management

#### Global State (Zustand)
```typescript
// Selected file paths
const { selectedPaths, addPath, removePath } = useAppStore();

// Notebook version preference
const { useNotebook, setUseNotebook } = useAppStore();

// Last run ID for quick access
const { lastRunId, setLastRunId } = useAppStore();
```

#### Server State (TanStack Query)
```typescript
// Fetch runs with caching
const { data: runs } = useQuery({
  queryKey: ['runs'],
  queryFn: listReports
});

// Start analysis with optimistic updates
const startRunMutation = useMutation({
  mutationFn: startRun,
  onSuccess: (data) => {
    queryClient.invalidateQueries(['runs']);
  }
});
```

## 🔒 Security

- **XSS Prevention**: Proper input sanitization
- **CSRF Protection**: API token validation
- **File Upload Security**: Type and size validation
- **Environment Variables**: Sensitive data protection

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop Enhanced**: Full feature set on desktop
- **Touch Friendly**: Large tap targets and gestures

## 🚀 Performance

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with lazy loading
- **Bundle Analysis**: Webpack bundle analyzer integration

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## 🛠️ Troubleshooting

### Common Issues

1. **CSS not loading**: Clear Vite cache and restart
2. **API connection errors**: Check backend server status
3. **TypeScript errors**: Run type checking command
4. **Hot reload not working**: Restart development server

### Development Tips

- Use React DevTools for component debugging
- Monitor Network tab for API issues
- Check browser console for JavaScript errors
- Use TypeScript strict mode for better code quality

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://github.com/pmndrs/zustand)

## 🤝 Contributing

1. Follow the existing code style
2. Add TypeScript types for new features
3. Update tests for new functionality
4. Ensure responsive design compliance
5. Test on multiple browsers

---

**Built with ❤️ by the KS-QE Team**