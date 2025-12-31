# OpenDGAi - Government Data Guard

An AI-powered platform for Thailand's open government data portal that ensures PDPA compliance through automated PII detection and risk assessment.

## Project Structure

```
OpenDGAi/
├── gov-data-guard/
│   ├── frontend/     # React + Vite + TypeScript frontend
│   └── functions/    # Firebase Cloud Functions backend
└── docs/            # Documentation
```

## Features

- **PII Detection**: Automated scanning for Thai National IDs, emails, phone numbers, and addresses
- **Risk Scoring**: Intelligent risk assessment of datasets
- **Dataset Management**: CRUD operations for government datasets
- **Dashboard**: Visual analytics for data visibility and risk distribution
- **PDPA Compliance**: Ensures compliance with Thailand's Personal Data Protection Act

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/invalder/OpenDGAi.git
cd OpenDGAi
```

2. Install frontend dependencies:
```bash
cd gov-data-guard/frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../functions
npm install
```

### Development

Run the frontend development server:
```bash
cd gov-data-guard/frontend
npm run dev
```

### Testing

Run tests:
```bash
cd gov-data-guard/frontend
npm test
```

### Build

Build for production:
```bash
cd gov-data-guard/frontend
npm run build
```

## License

ISC