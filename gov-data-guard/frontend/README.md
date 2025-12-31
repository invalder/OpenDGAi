# GovData Guard - Frontend

React + TypeScript + Vite application for the OpenDGAi platform.

## Tech Stack

- **React 19** - UI framework
- **TypeScript 5.9** - Type safety
- **Vite 7** - Build tool and dev server
- **Tailwind CSS 4** - Styling
- **Recharts** - Data visualization
- **React Router 7** - Routing
- **Jest** - Testing framework
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/      # Reusable UI components
├── context/        # React context providers (Auth)
├── pages/          # Page components (Dashboard, DatasetList, DatasetForm)
├── services/       # API services (DatasetService)
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
    └── pdpa/       # PDPA validation and risk scoring
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Jest

## Features

### PDPA Validation

The application includes validators for Thai-specific PII:

- **Thai National ID**: Validates 13-digit IDs with checksum algorithm
- **Email**: Standard email format validation
- **Phone Number**: Thai phone number formats (0x-xxx-xxxx, +66xxxxxxxxx)
- **Address**: Thai address pattern detection

### Risk Scoring

Automated risk assessment of datasets based on PII findings:
- National IDs: 10 points each
- Other PII (email, phone, address): 5 points each
- Score capped at 100

### Mock Data Service

For MVP development, `DatasetService` provides in-memory CRUD operations:
- Create, read, update, delete datasets
- Save and retrieve scan results
- Simulated async operations

## Development Notes

This is a Vite template with HMR and ESLint rules configured for React development.

### ESLint Configuration

The project uses flat config format for ESLint 9. For production applications, consider enabling type-aware lint rules as shown in the advanced configuration section.

## Testing

Jest is configured with:
- `ts-jest` for TypeScript support
- `jsdom` test environment for DOM testing
- `@testing-library/react` for component testing
- `identity-obj-proxy` for CSS module mocking

Run tests with:
```bash
npm test
```

## Building

The build process uses TypeScript compiler for type checking followed by Vite for bundling:

```bash
npm run build
```

Output will be in the `dist/` directory.
