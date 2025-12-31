import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';

// Mock Recharts because it doesn't play well with JSDOM
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: any }) => <div>{children}</div>,
  BarChart: () => <div>BarChart</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  PieChart: () => <div>PieChart</div>,
  Pie: () => null,
  Cell: () => null,
}));

describe('Dashboard Component', () => {
  it('renders dashboard title and charts', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dataset Visibility')).toBeInTheDocument();
    expect(screen.getByText('Risk Distribution')).toBeInTheDocument();
    expect(screen.getByText('BarChart')).toBeInTheDocument();
    expect(screen.getByText('PieChart')).toBeInTheDocument();
  });
});
