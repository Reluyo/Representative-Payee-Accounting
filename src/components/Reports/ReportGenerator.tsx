import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../UI/Card';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { useReports } from '../../hooks/useReports';

interface ReportGeneratorProps {
  accountId: number | null;
  accountName: string;
}

export function ReportGenerator({ accountId, accountName }: ReportGeneratorProps) {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [customDateRange, setCustomDateRange] = useState(false);

  const { reportLoading, reportError, generateAndExportPDF } = useReports(accountId, accountName);

  const handleGenerateReport = async () => {
    try {
      await generateAndExportPDF(new Date(startDate), new Date(endDate), notes);
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const setThisMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setLastMonth = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const setLastQuarter = () => {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) - 1;
    const start = new Date(now.getFullYear(), quarter * 3, 1);
    const end = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Generate Report</h2>
        <p className="text-gray-600 text-sm">Create a court-ready PDF report for any date range</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {!customDateRange && (
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={setThisMonth}
              >
                This Month
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={setLastMonth}
              >
                Last Month
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={setLastQuarter}
              >
                Last Quarter
              </Button>
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCustomDateRange(!customDateRange)}
            className="w-full"
          >
            {customDateRange ? 'Use Quick Range' : 'Custom Date Range'}
          </Button>

          {customDateRange && (
            <div className="grid grid-cols-2 gap-3 border-t pt-4">
              <Input
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          <textarea
            placeholder="Add optional notes for the report (e.g., special circumstances, certifications)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />

          {reportError && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{reportError}</p>
          )}
        </div>
      </CardBody>
      <CardFooter className="justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerateReport}
          loading={reportLoading}
          disabled={!accountId}
        >
          📊 Generate PDF Report
        </Button>
      </CardFooter>
    </Card>
  );
}
