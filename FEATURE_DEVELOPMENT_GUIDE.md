# Feature Development Guide

A comprehensive reference guide for building new features in the Story Keeper Frontend project.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Environment Setup](#environment-setup)
5. [Common Patterns](#common-patterns)
6. [Adding New Features](#adding-new-features)
7. [API Integration](#api-integration)
8. [Styling Guidelines](#styling-guidelines)
9. [Development Workflow](#development-workflow)
10. [Best Practices](#best-practices)
11. [Common Tasks](#common-tasks)

---

## Project Overview

This is a React + TypeScript frontend application built with Vite, using Material-UI (MUI) for components and React Router for navigation.

---

## Tech Stack

- **React 18.3** - UI library
- **TypeScript 5.5** - Type safety
- **Vite 5.4** - Build tool and dev server
- **Material-UI (MUI) 5.16** - Component library
- **React Router 6.26** - Client-side routing
- **ESLint** - Code linting

---

## Project Structure

```
story-keeper-frontend/
├── src/
│   ├── pages/          # Page components (routes)
│   │   ├── Home.tsx
│   │   └── Login.tsx
│   ├── utils/          # Utility functions
│   │   └── api.ts      # API client utilities
│   ├── App.tsx         # Main app component with routes
│   ├── main.tsx        # Application entry point
│   ├── index.css       # Global styles
│   └── vite-env.d.ts   # Vite type definitions
├── .env.local          # Local environment variables (gitignored)
├── .env.example        # Example environment file
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

### Directory Conventions

- **`src/pages/`** - Top-level page components that correspond to routes
- **`src/utils/`** - Reusable utility functions (API clients, helpers, etc.)
- **`src/components/`** - (Create if needed) Reusable UI components
- **`src/hooks/`** - (Create if needed) Custom React hooks
- **`src/types/`** - (Create if needed) TypeScript type definitions
- **`src/context/`** - (Create if needed) React Context providers

---

## Environment Setup

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the application.

**Required Variables:**
- `VITE_API_BASE_URL` - Base URL for the backend API (e.g., `https://your-backend.onrender.com/api`)

### Setup Steps

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual values:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

3. Restart the dev server after changing environment variables

### Accessing Environment Variables

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Common Patterns

### 1. API State Management

The project uses a discriminated union type for API state:

```typescript
type ApiState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
```

**Usage Example:**
```typescript
const [dataState, setDataState] = useState<ApiState<MyDataType>>({ 
  status: "loading" 
});

// In useEffect or event handler
const result = await fetchMyData();
setDataState(result);

// In JSX
{dataState.status === "loading" && <CircularProgress />}
{dataState.status === "success" && <div>{dataState.data}</div>}
{dataState.status === "error" && <div>Error: {dataState.error}</div>}
```

### 2. Page Component Structure

Pages follow this pattern:

```typescript
import { Box, Paper, Typography } from "@mui/material";

function MyPage() {
  return (
    <Box sx={{ /* styling */ }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Page Title
        </Typography>
        {/* Page content */}
      </Paper>
    </Box>
  );
}

export default MyPage;
```

### 3. Material-UI Styling

Use the `sx` prop for styling:

```typescript
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    mt: 4,        // margin-top: theme.spacing(4)
    p: 2,         // padding: theme.spacing(2)
  }}
>
```

**Common MUI spacing shortcuts:**
- `mt`, `mb`, `ml`, `mr` - margin top/bottom/left/right
- `pt`, `pb`, `pl`, `pr` - padding top/bottom/left/right
- `m`, `p` - margin/padding all sides
- `mx`, `my` - margin horizontal/vertical
- `px`, `py` - padding horizontal/vertical

---

## Adding New Features

### Step 1: Create a New Page

1. Create a new file in `src/pages/`:
   ```typescript
   // src/pages/MyNewPage.tsx
   import { Box, Paper, Typography } from "@mui/material";

   function MyNewPage() {
     return (
       <Box sx={{ mt: 4 }}>
         <Paper elevation={3} sx={{ p: 4 }}>
           <Typography variant="h4" component="h1" gutterBottom>
             My New Page
           </Typography>
           {/* Your content here */}
         </Paper>
       </Box>
     );
   }

   export default MyNewPage;
   ```

2. Add the route in `src/App.tsx`:
   ```typescript
   import MyNewPage from "./pages/MyNewPage";

   // In the Routes component:
   <Route path="/my-new-page" element={<MyNewPage />} />
   ```

### Step 2: Add API Functions (if needed)

Add API functions to `src/utils/api.ts`:

```typescript
/**
 * Fetch data from your endpoint
 * @returns Promise that resolves to ApiState with your data type
 */
export async function fetchMyData(): Promise<ApiState<MyDataType>> {
  try {
    const response = await apiFetch<MyDataType>("/my-endpoint", {
      method: "GET",
    });

    return {
      status: "success",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

/**
 * POST data to your endpoint
 */
export async function createMyData(
  data: CreateMyDataType
): Promise<ApiState<MyDataType>> {
  try {
    const response = await apiFetch<MyDataType>("/my-endpoint", {
      method: "POST",
      body: JSON.stringify(data),
    });

    return {
      status: "success",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
```

### Step 3: Use API in Your Page

```typescript
import { useEffect, useState } from "react";
import { ApiState, fetchMyData } from "../utils/api";

function MyNewPage() {
  const [dataState, setDataState] = useState<ApiState<MyDataType>>({
    status: "loading",
  });

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchMyData();
      setDataState(result);
    };
    loadData();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      {dataState.status === "loading" && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {dataState.status === "success" && (
        <div>{/* Render your data */}</div>
      )}
      {dataState.status === "error" && (
        <Typography color="error">Error: {dataState.error}</Typography>
      )}
    </Box>
  );
}
```

---

## API Integration

### Using the API Utility

The project provides `apiFetch` utility in `src/utils/api.ts`:

```typescript
import { apiFetch } from "../utils/api";

// GET request
const response = await apiFetch<MyType>("/my-endpoint");

// POST request
const response = await apiFetch<MyType>("/my-endpoint", {
  method: "POST",
  body: JSON.stringify({ key: "value" }),
});

// PUT request
const response = await apiFetch<MyType>("/my-endpoint/123", {
  method: "PUT",
  body: JSON.stringify({ key: "updated value" }),
});

// DELETE request
const response = await apiFetch<void>("/my-endpoint/123", {
  method: "DELETE",
});
```

### Important Notes

- **Base URL**: The base URL is automatically prepended. Don't include `/api` in your endpoint paths.
- **Credentials**: All requests include `credentials: "include"` for CORS with cookies.
- **Content-Type**: Automatically set to `application/json`.
- **Error Handling**: `apiFetch` throws errors for non-OK responses. Wrap in try-catch or use the pattern shown in `fetchHealth()`.

### Creating API Functions

Follow this pattern for new API functions:

```typescript
export async function fetchMyResource(
  id: string
): Promise<ApiState<MyResource>> {
  try {
    const response = await apiFetch<MyResource>(`/my-resource/${id}`, {
      method: "GET",
    });

    return {
      status: "success",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
```

---

## Styling Guidelines

### Material-UI Components

Use MUI components for consistent UI:

- **Layout**: `Box`, `Container`, `Grid`, `Stack`
- **Surfaces**: `Paper`, `Card`, `AppBar`
- **Inputs**: `TextField`, `Button`, `Checkbox`, `Radio`, `Select`
- **Feedback**: `CircularProgress`, `Alert`, `Snackbar`, `Dialog`
- **Navigation**: `Tabs`, `Breadcrumbs`, `Link`
- **Typography**: `Typography`

### Responsive Design

Use MUI's responsive breakpoints:

```typescript
<Box
  sx={{
    width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
    padding: { xs: 2, sm: 3, md: 4 },
  }}
>
```

### Theme Customization

The theme is defined in `src/main.tsx`. To customize:

```typescript
const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
    primary: {
      main: "#your-color",
    },
  },
  // Add other theme customizations
});
```

---

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Linting

```bash
npm run lint
```

### Preview Production Build

```bash
npm run preview
```

---

## Best Practices

### 1. TypeScript

- **Always type your state**: Use explicit types for `useState` and function parameters
- **Use interfaces for complex types**: Define interfaces for API responses and component props
- **Avoid `any`**: Use `unknown` if the type is truly unknown, then narrow it

### 2. Component Organization

- **One component per file**: Each component should be in its own file
- **Default exports for pages**: Use default exports for page components
- **Named exports for utilities**: Use named exports for utility functions

### 3. State Management

- **Use `ApiState` pattern**: For async data, use the `ApiState<T>` discriminated union
- **Local state first**: Use `useState` for component-local state
- **Consider Context**: For shared state across multiple components, use React Context

### 4. Error Handling

- **Always handle errors**: Wrap async operations in try-catch
- **User-friendly messages**: Show meaningful error messages to users
- **Loading states**: Always show loading indicators for async operations

### 5. Code Quality

- **Run linter**: Fix linting errors before committing
- **Consistent formatting**: Use consistent code formatting (consider Prettier)
- **Meaningful names**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for public functions

### 6. Performance

- **Lazy loading**: Consider code splitting for large pages
- **Memoization**: Use `useMemo` and `useCallback` when appropriate
- **Avoid unnecessary re-renders**: Structure components to minimize re-renders

---

## Common Tasks

### Adding a Form

```typescript
import { Box, Button, TextField, Paper } from "@mui/material";
import { useState } from "react";

function MyForm() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call your API
      await createMyData(formData);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Paper>
  );
}
```

### Adding Navigation Links

```typescript
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

// In your component:
<Button component={Link} to="/my-page">
  Go to My Page
</Button>

// Or with MUI Link:
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

<MuiLink component={RouterLink} to="/my-page">
  Go to My Page
</MuiLink>
```

### Handling Authentication

If you need to add authentication:

1. Create an auth context/provider
2. Store tokens in localStorage or cookies
3. Add auth headers to API requests
4. Protect routes with authentication checks

Example API function with auth:

```typescript
export async function fetchProtectedData(): Promise<ApiState<MyData>> {
  try {
    const token = localStorage.getItem("authToken");
    const response = await apiFetch<MyData>("/protected-endpoint", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      status: "success",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
```

### Adding Loading States

```typescript
import { CircularProgress, Box } from "@mui/material";

{isLoading && (
  <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
    <CircularProgress />
  </Box>
)}
```

### Adding Error Messages

```typescript
import { Alert } from "@mui/material";

{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

### Adding Success Messages

```typescript
import { Alert, Snackbar } from "@mui/material";
import { useState } from "react";

const [successMessage, setSuccessMessage] = useState<string | null>(null);

// Show success message
setSuccessMessage("Operation completed successfully!");

// In JSX:
<Snackbar
  open={!!successMessage}
  autoHideDuration={6000}
  onClose={() => setSuccessMessage(null)}
>
  <Alert severity="success" onClose={() => setSuccessMessage(null)}>
    {successMessage}
  </Alert>
</Snackbar>
```

---

## Quick Reference

### Common MUI Components

```typescript
// Layout
<Box>...</Box>
<Container maxWidth="lg">...</Container>
<Grid container spacing={2}>...</Grid>
<Stack direction="row" spacing={2}>...</Stack>

// Surfaces
<Paper elevation={3} sx={{ p: 4 }}>...</Paper>
<Card>...</Card>

// Inputs
<TextField label="Label" value={value} onChange={handleChange} />
<Button variant="contained" onClick={handleClick}>Click</Button>
<Checkbox checked={checked} onChange={handleChange} />

// Feedback
<CircularProgress />
<Alert severity="error">Error message</Alert>
<Snackbar open={open} onClose={handleClose}>...</Snackbar>

// Typography
<Typography variant="h4" component="h1">Heading</Typography>
<Typography variant="body1">Body text</Typography>
```

### Common React Patterns

```typescript
// State
const [state, setState] = useState<Type>(initialValue);

// Effect
useEffect(() => {
  // Side effect
  return () => {
    // Cleanup
  };
}, [dependencies]);

// Event handlers
const handleClick = (e: React.MouseEvent) => {
  e.preventDefault();
  // Handle click
};

// Form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  // Handle submit
};
```

### API Patterns

```typescript
// GET request
const result = await fetchMyData();
setDataState(result);

// POST request
const result = await createMyData(data);
if (result.status === "success") {
  // Handle success
}

// Error handling
if (result.status === "error") {
  console.error(result.error);
  // Show error to user
}
```

---

## Troubleshooting

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Restart the dev server after changing `.env.local`
- Check that `.env.local` exists and has correct values

### API Requests Failing

- Verify `VITE_API_BASE_URL` is set correctly
- Check CORS settings on backend
- Ensure backend is running and accessible
- Check browser console for detailed error messages

### TypeScript Errors

- Run `npm run lint` to see all errors
- Ensure all imports are correct
- Check that types match between components and API responses

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`
- Ensure all environment variables are set for production builds

---

## Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Last Updated**: January 2026
