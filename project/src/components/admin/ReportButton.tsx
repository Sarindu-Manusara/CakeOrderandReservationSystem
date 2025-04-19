import React from 'react';
import { FileDown } from 'lucide-react';
import { generateReport } from '../../../server/utils/reportGenerator';

interface ReportButtonProps {
  data: any[];
  filename: string;
  formatData: (data: any[]) => any[];
}

const ReportButton: React.FC<ReportButtonProps> = ({ data, filename, formatData }) => {
  const handleDownload = (format: 'xlsx' | 'csv') => {
    const formattedData = formatData(data);
    generateReport(formattedData, {
      filename: `${filename}-${new Date().toISOString().split('T')[0]}`,
      format
    });
  };

  return (
    <div className="relative inline-block text-left">
      <div className="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          onClick={() => handleDownload('xlsx')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-l-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Excel
        </button>
        <button
          type="button"
          onClick={() => handleDownload('csv')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 border-l border-primary-700"
        >
          CSV
        </button>
      </div>
    </div>
  );
};

export default ReportButton;