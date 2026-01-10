
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

// Mock dependencies
jest.mock('jspdf', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    setFontSize: jest.fn(),
  })),
}));

jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(),
    book_new: jest.fn(),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
}));

jest.mock('recharts', () => {
    return {
        ResponsiveContainer: ({ children }: any) => <div style={{ width: '100%', height: '100%' }}>{children}</div>,
        BarChart: ({ children }: any) => <div>{children}</div>,
        Bar: () => <div>Bar</div>,
        XAxis: () => <div>XAxis</div>,
        YAxis: () => <div>YAxis</div>,
        CartesianGrid: () => <div>CartesianGrid</div>,
        Tooltip: () => <div>Tooltip</div>,
        Legend: () => <div>Legend</div>,
        PieChart: ({ children }: any) => <div>{children}</div>,
        Pie: () => <div>Pie</div>,
        Cell: () => <div>Cell</div>,
    };
});

describe('Dashboard Component', () => {
  test('renders dashboard title', () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders Export PDF and Export Excel buttons', () => {
    render(<Dashboard />);

    const pdfButton = screen.getByText(/Export PDF/i);
    expect(pdfButton).toBeInTheDocument();

    const excelButton = screen.getByText(/Export Excel/i);
    expect(excelButton).toBeInTheDocument();
  });

  test('calls jsPDF when Export PDF is clicked', () => {
    render(<Dashboard />);
    const pdfButton = screen.getByText(/Export PDF/i);
    fireEvent.click(pdfButton);
    expect(jsPDF).toHaveBeenCalled();
  });

  test('calls XLSX when Export Excel is clicked', () => {
      render(<Dashboard />);
      const excelButton = screen.getByText(/Export Excel/i);
      fireEvent.click(excelButton);
      expect(XLSX.writeFile).toHaveBeenCalled();
  });
});
