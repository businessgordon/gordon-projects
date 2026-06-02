import { useEffect, useState } from 'react';
import { getPayrollReport } from '../api/salaryApi';
import LoadingSpinner from '../components/LoadingSpinner';

function Reports() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  const downloadReport = () => {
    const rows = [
      ['First Name', 'Last Name', 'Position', 'Department', 'Net Salary', 'Month'],
      ...report.map((item) => [
        item.firstName,
        item.lastName,
        item.position,
        item.department,
        Number(item.netSalary).toLocaleString(),
        item.month,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'smartpark-payroll-report.csv');
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    async function loadReport() {
      try {
        const response = await getPayrollReport();
        setReport(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Payroll Reports</h2>
            <p className="mt-2 text-slate-500">Monthly payroll report for SmartPark employees.</p>
          </div>
          <button
            type="button"
            onClick={downloadReport}
            disabled={report.length === 0}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Download CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3">First Name</th>
              <th className="px-4 py-3">Last Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Net Salary</th>
              <th className="px-4 py-3">Month</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {report.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-slate-500">No payroll records available.</td>
              </tr>
            ) : (
              report.map((item, index) => (
                <tr key={`${item.employeeNumber}-${index}`}>
                  <td className="px-4 py-4">{item.firstName}</td>
                  <td className="px-4 py-4">{item.lastName}</td>
                  <td className="px-4 py-4">{item.position}</td>
                  <td className="px-4 py-4">{item.department}</td>
                  <td className="px-4 py-4">RWF {Number(item.netSalary).toLocaleString()}</td>
                  <td className="px-4 py-4">{item.month}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
