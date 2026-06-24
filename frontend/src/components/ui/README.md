# shadecn/ui Component Library Setup

This project has been configured with a manual shadecn/ui-style component library. Instead of relying on the npm registry (which has been inaccessible), components have been created directly using Radix UI primitives and Tailwind CSS.

## Available Components

### Core Components
- **Button** - Versatile button component with multiple variants (default, destructive, outline, secondary, ghost, link) and sizes (sm, md, lg)
- **Input** - Text input with focus ring styling and disabled states
- **Textarea** - Multi-line text input
- **Label** - Form label with proper accessibility attributes
- **Badge** - Badge component with multiple variants (default, primary, secondary, destructive, success)
- **Checkbox** - Checkbox input with custom styling

### Layout & Container Components
- **Card** - Container with border, shadow, and padding (includes CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- **Table** - HTML table wrapper with semantic structure (includes TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption)

### Form & Interactive Components
- **Dialog** - Modal dialog built on Radix Dialog (includes DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription)
- **Select** - Dropdown select built on Radix Select (includes SelectTrigger, SelectContent, SelectItem, SelectValue, SelectGroup, SelectSeparator)

## Utility Functions

### `cn()` - Merge Classnames
Located in `src/lib/utils.js`, this utility function merges Tailwind CSS classes while handling conflicts intelligently:

```javascript
import { cn } from '@/lib/utils';

cn("px-2 py-1", "px-4")  // Results in px-4 py-1 (later class wins)
cn({ "text-red-500": isError })  // Conditional classes using clsx
```

## Installation in Components

All components are pre-installed in `src/components/ui/`. To use them in your React components:

```javascript
import { Button, Card, CardContent, Input } from '@/components/ui';

export default function MyComponent() {
  return (
    <Card>
      <CardContent className="pt-6">
        <Input placeholder="Enter text..." />
        <Button variant="primary">Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## Dependencies Installed

- `@radix-ui/react-dialog` - Dialog/Modal primitives
- `@radix-ui/react-select` - Select dropdown primitives
- `@radix-ui/react-dropdown-menu` - Dropdown menu primitives (ready for extension)
- `class-variance-authority` - Component variant management
- `clsx` - Conditional className builder
- `tailwind-merge` - Intelligent Tailwind class merging

## Usage Examples

### Button
```javascript
import { Button } from '@/components/ui';

<Button variant="default" size="md">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
```

### Card
```javascript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Dialog
```javascript
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Dialog Title</DialogTitle>
    Dialog content
  </DialogContent>
</Dialog>
```

### Form with Input and Label
```javascript
import { Input, Label, Button } from '@/components/ui';

<div className="space-y-4">
  <div>
    <Label htmlFor="name">Name</Label>
    <Input id="name" placeholder="Enter name" />
  </div>
  <Button>Submit</Button>
</div>
```

## Adding New Components

To add a new shadecn/ui component:

1. Create a new file in `src/components/ui/component-name.jsx`
2. Use the `cn()` utility for className merging
3. Follow the existing component patterns (use React.forwardRef for ref forwarding)
4. Export the component in `src/components/ui/index.js`

## Styling

All components are built with:
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible primitives
- Dark mode support can be added via Tailwind's dark mode utilities

## Next Steps

To start using these components in your existing pages and modals:

1. Replace Tailwind-only components with shadecn/ui components
2. Update `EditProfileModal.jsx`, `ViewProfile.jsx` to use Dialog component
3. Use Table component in admin pages for data display
4. Use Button, Input, Label components in forms

## Notes

- All components accept a `className` prop for additional styling
- Components use `forwardRef` for direct DOM access when needed
- Accessibility is built-in via Radix UI primitives
- Theming can be customized by editing Tailwind classes in each component
