# 🤝 Contributing to QA Project Application

Thank you for your interest in contributing to the QA Project Application! This document provides guidelines and information for contributors.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and constructive in all interactions.

### Our Standards
- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and diverse perspectives
- **Be constructive**: Provide helpful feedback and suggestions
- **Be professional**: Maintain professional communication

## 🚀 Getting Started

### Prerequisites
- **Python 3.12+** (3.11.4+ also supported)
- **Node.js 18+** (v22.15.1+ recommended)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Development Environment
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/QA-project-app.git
   cd QA-project-app
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/msr-theksquaregroup/QA-project-app.git
   ```

## 🛠️ Development Setup

### Backend Setup
```bash
# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r backend/requirements.txt

# Install development dependencies
pip install pytest black flake8 mypy
```

### Frontend Setup
```bash
cd frontend
npm install

# Install development dependencies
npm install --save-dev @types/node eslint prettier

# Create environment file
echo "VITE_API_BASE=http://localhost:8000" > .env
echo "VITE_AGENT_API_BASE=http://localhost:8001" >> .env
```

### Running Development Environment
```bash
# Terminal 1 - Backend API
source .venv/bin/activate
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Agent Service
source .venv/bin/activate
python agent_service.py

# Terminal 3 - Frontend
cd frontend
npm run dev
```

## 📝 Contributing Guidelines

### Types of Contributions
We welcome various types of contributions:

1. **🐛 Bug Reports**: Report bugs with detailed information
2. **✨ Feature Requests**: Suggest new features or improvements
3. **🔧 Bug Fixes**: Submit fixes for known issues
4. **🚀 New Features**: Implement new functionality
5. **📚 Documentation**: Improve or add documentation
6. **🧪 Tests**: Add or improve test coverage
7. **🎨 UI/UX**: Improve user interface and experience

### Before Contributing
1. **Check existing issues**: Look for similar issues or feature requests
2. **Create an issue**: For new features or significant changes
3. **Discuss first**: For major changes, discuss with maintainers
4. **Follow standards**: Adhere to coding standards and conventions

## 🔄 Pull Request Process

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 2. Make Your Changes
- Write clean, readable code
- Follow coding standards
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes
```bash
# Backend tests
cd backend
python -m pytest

# Frontend tests
cd frontend
npm test

# Run linting
npm run lint
```

### 4. Commit Your Changes
```bash
# Use conventional commit format
git commit -m "feat: add new feature description"
git commit -m "fix: resolve issue with component"
git commit -m "docs: update README with new instructions"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```
Then create a Pull Request on GitHub.

### PR Requirements
- **Clear title**: Describe what the PR does
- **Detailed description**: Explain the changes and motivation
- **Link issues**: Reference related issues
- **Screenshots**: For UI changes, include before/after screenshots
- **Tests pass**: Ensure all tests pass
- **Documentation updated**: Update relevant documentation

## 🎨 Coding Standards

### Python (Backend)
```python
# Use Black for formatting
black backend/

# Use flake8 for linting
flake8 backend/

# Use mypy for type checking
mypy backend/

# Follow PEP 8 guidelines
# Use type hints
def process_file(file_path: str) -> Dict[str, Any]:
    """Process a file and return results."""
    pass

# Use docstrings
class TestProcessor:
    """Processes test files for analysis."""
    
    def __init__(self, config: Config) -> None:
        """Initialize the processor with configuration."""
        self.config = config
```

### TypeScript/React (Frontend)
```typescript
// Use Prettier for formatting
npm run format

// Use ESLint for linting
npm run lint

// Follow React best practices
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

const Component: React.FC<Props> = ({ title, onSubmit }) => {
  // Use hooks properly
  const [loading, setLoading] = useState(false);
  
  // Use proper TypeScript types
  const handleSubmit = useCallback((data: FormData) => {
    setLoading(true);
    onSubmit(data);
  }, [onSubmit]);

  return (
    <div className="component-container">
      <h1>{title}</h1>
      {/* Component content */}
    </div>
  );
};
```

### File Structure
```
# Backend
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          # FastAPI app
│   ├── models.py        # Data models
│   ├── routers/         # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions

# Frontend
frontend/src/
├── components/          # Reusable components
├── pages/              # Page components
├── lib/                # Utilities and API
├── types.ts            # Type definitions
└── hooks/              # Custom hooks
```

### Naming Conventions
- **Files**: `kebab-case.ts`, `PascalCase.tsx` for React components
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Classes**: `PascalCase`
- **Functions**: `camelCase`

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
python -m pytest

# Run with coverage
python -m pytest --cov=backend

# Run specific test
python -m pytest tests/test_api.py::test_upload_file
```

### Frontend Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test
npm test -- --testNamePattern="FileUploader"
```

### Test Guidelines
- **Write tests**: For new features and bug fixes
- **Test coverage**: Aim for >80% coverage
- **Test types**: Unit, integration, and E2E tests
- **Mock external dependencies**: Use mocks for external APIs
- **Test edge cases**: Include error scenarios

### Example Test Structure
```python
# Backend test example
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_upload_file():
    """Test file upload functionality."""
    with open("test_file.js", "rb") as f:
        response = client.post("/api/upload", files={"file": f})
    
    assert response.status_code == 200
    assert "upload_id" in response.json()
```

```typescript
// Frontend test example
import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploader } from '../FileUploader';

describe('FileUploader', () => {
  it('should handle file upload', () => {
    const onUpload = jest.fn();
    render(<FileUploader onUpload={onUpload} />);
    
    const file = new File(['test'], 'test.js', { type: 'text/javascript' });
    const input = screen.getByLabelText(/upload/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(onUpload).toHaveBeenCalledWith(file);
  });
});
```

## 📚 Documentation

### Documentation Types
1. **Code Comments**: Inline documentation
2. **API Documentation**: Swagger/OpenAPI docs
3. **User Guides**: How-to guides and tutorials
4. **Technical Documentation**: Architecture and design docs

### Documentation Standards
- **Clear and concise**: Write for your audience
- **Up-to-date**: Keep documentation current with code changes
- **Examples**: Include practical examples
- **Screenshots**: Use visuals for UI documentation

### API Documentation
```python
@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    description: Optional[str] = None
) -> UploadResponse:
    """
    Upload a test file for analysis.
    
    Args:
        file: The test file to upload (JS, TS, or Cypress)
        description: Optional description of the test file
        
    Returns:
        UploadResponse with upload details and file ID
        
    Raises:
        HTTPException: If file type is not supported
    """
```

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on

## 🎯 Areas for Contribution

### High Priority
- **Bug fixes**: Critical issues affecting functionality
- **Performance improvements**: Optimize slow operations
- **Test coverage**: Add missing tests
- **Documentation**: Improve existing docs

### Medium Priority
- **New features**: Enhance user experience
- **UI/UX improvements**: Better user interface
- **Code refactoring**: Improve code quality
- **Accessibility**: Make app more accessible

### Low Priority
- **Nice-to-have features**: Additional functionality
- **Code cleanup**: Non-critical improvements
- **Examples**: More usage examples

## 🚀 Release Process

### Versioning
We use [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
1. Update version numbers
2. Update CHANGELOG.md
3. Run all tests
4. Update documentation
5. Create release notes
6. Tag release
7. Deploy to production

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: For sensitive matters

### Mentorship
New contributors are welcome! We provide:
- **Code reviews**: Detailed feedback on contributions
- **Guidance**: Help with development setup
- **Mentoring**: Support for first-time contributors

## 🙏 Recognition

Contributors are recognized through:
- **Contributors list**: Listed in README.md
- **Release notes**: Mentioned in release notes
- **GitHub profile**: Contributions visible on GitHub

---

**Thank you for contributing to the QA Project Application! 🎉**

Every contribution, no matter how small, makes a difference. We appreciate your time and effort in helping improve this project.
