# ESLint Plugin

## Installation

```bash
pnpm dlx jsr add -D @ximagine/eslint-plugin
```

## Usage

```javascript
import { defineConfig } from "@ximagine/eslint-config";
import ximagine from "@ximagine/eslint-plugin";

export default defineConfig({
  globals: {
    presets: ["nodeBuiltin"],
  },
  configs: (p) => [p.js, p.ts, p.vitest, ximagine.configs.recommended],
});
```
