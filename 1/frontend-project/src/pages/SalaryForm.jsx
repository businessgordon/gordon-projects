import { useEffect, useState } from 'react';
import { createSalary, getSalaries, updateSalary, deleteSalary } from '../api/salaryApi';
import { getEmployees } from '../api/employeeApi';
import { getDepartments } from '../api/departmentApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

function SalaryForm() {
  const [form, setForm] = useState({ employeeNumber: '', departmentCode: '', grossSalary: '', totalDeduction: '', month: '' });
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empRes, deptRes, salaryRes] = await Promise.all([getEmployees(), getDepartments(), getSalaries(filterMonth)]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
      setSalaries(salaryRes.data);
    } catch (error) {
      toast.error('Unable to load salary records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterMonth]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.employeeNumber || !form.departmentCode || !form.grossSalary || form.totalDeduction === '' || !form.month) {
      return toast.error('Please fill all required salary fields');
    }
    setLoading(true);
    try {
      await createSalary({
        employeeNumber: form.employeeNumber,
        departmentCode: form.departmentCode,
        grossSalary: Number(form.grossSalary),
        totalDeduction: Number(form.totalDeduction),
        month: form.month,
      });
      toast.success('Salary record created');
      setForm({ employeeNumber: '', departmentCode: '', grossSalary: '', totalDeduction: '', month: '' });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save salary');
    } finally {
      setLoading(false);
    }
  };

  const removeSalary = async (salaryId) => {
    if (!window.confirm('Delete this salary record?')) return;
    setLoading(true);
    try {
      await deleteSalary(salaryId);
      toast.success('Salary record deleted');
      loadData();
    } catch (error) {
      toast.error('Unable to delete salary');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Salary Management</h2>
        <p className="mt-2 text-slate-500">Create payroll records, filter by month, and manage salary entries.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Employee *</span>
            <select name="employeeNumber" value={form.employeeNumber} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900">
              <option value="">Select employee</option>
              {employees.map((employee) => (
                <option key={employee.employeeNumber} value={employee.employeeNumber}>
                  {employee.firstName} {employee.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Department *</span>
            <select name="departmentCode" value={form.departmentCode} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900">
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept.departmentCode} value={dept.departmentCode}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Gross Salary *</span>
              <input type="number" min="0" name="grossSalary" value={form.grossSalary} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Deduction *</span>
              <input type="number" min="0" name="totalDeduction" value={form.totalDeduction} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Month *</span>
            <input type="month" name="month" value={form.month} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900" />
          </label>
          <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700">Create Salary</button>
        </form>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Salary Records</h3>
              <p className="mt-1 text-slate-500">Filter records by month or remove outdated payroll entries.</p>
            </div>
            <input
              type="month"
              value={filterMonth}
              onChange={(event) => setFilterMonth(event.target.value)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
            />
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Deduction</th>
                  <th className="px-4 py-3">Net</th>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                      No salary records found.
                    </td>
                  </tr>
                ) : (
                  salaries.map((salary) => (
                    <tr key={salary.salaryId}>
                      <td className="px-4 py-4">{salary.employeeNumber}</td>
                      <td className="px-4 py-4">{salary.departmentCode}</td>
                      <td className="px-4 py-4">RWF {Number(salary.grossSalary).toLocaleString()}</td>
                      <td className="px-4 py-4">RWF {Number(salary.totalDeduction).toLocaleString()}</td>
                      <td className="px-4 py-4">RWF {Number(salary.netSalary).toLocaleString()}</td>
                      <td className="px-4 py-4">{salary.month}</td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => removeSalary(salary.salaryId)}
                          className="rounded-2xl bg-rose-500 px-3 py-2 text-white transition hover:bg-rose-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryForm;
