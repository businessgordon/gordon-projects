import { useEffect, useState } from 'react';
import { createDepartment, getDepartments, updateDepartment, deleteDepartment } from '../api/departmentApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

function DepartmentForm() {
  const [form, setForm] = useState({ departmentCode: '', departmentName: '', grossSalary: '', totalDeduction: '' });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function loadDepartments() {
      try {
        const response = await getDepartments();
        setDepartments(response.data);
      } catch (error) {
        toast.error('Unable to load departments');
      } finally {
        setLoading(false);
      }
    }
    loadDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.departmentCode || !form.departmentName || !form.grossSalary || !form.totalDeduction) {
      return toast.error('Please fill all required department fields');
    }
    setLoading(true);
    try {
      if (editing) {
        await updateDepartment(form.departmentCode, {
          departmentName: form.departmentName,
          grossSalary: Number(form.grossSalary),
          totalDeduction: Number(form.totalDeduction),
        });
        toast.success('Department updated successfully');
      } else {
        await createDepartment({
          departmentCode: form.departmentCode,
          departmentName: form.departmentName,
          grossSalary: Number(form.grossSalary),
          totalDeduction: Number(form.totalDeduction),
        });
        toast.success('Department added successfully');
      }
      setForm({ departmentCode: '', departmentName: '', grossSalary: '', totalDeduction: '' });
      setEditing(false);
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Department creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dept) => {
    setForm({
      departmentCode: dept.departmentCode,
      departmentName: dept.departmentName,
      grossSalary: dept.grossSalary,
      totalDeduction: dept.totalDeduction,
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (dept) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await deleteDepartment(dept.departmentCode);
      toast.success('Department deleted');
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Unable to delete department');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Department Management</h2>
        <p className="mt-2 text-slate-500">Add a new department and review existing department salary setup.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Department Code *</span>
            <input name="departmentCode" value={form.departmentCode} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Department Name *</span>
            <input name="departmentName" value={form.departmentName} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Gross Salary *</span>
              <input name="grossSalary" value={form.grossSalary} onChange={handleChange} type="number" min="0" className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Deduction *</span>
              <input name="totalDeduction" value={form.totalDeduction} onChange={handleChange} type="number" min="0" className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
          </div>
          <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700">Save Department</button>
        </form>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Departments</h3>
          <div className="mt-4 space-y-3">
            {departments.length === 0 ? (
              <p className="text-slate-500">No departments found.</p>
            ) : (
              departments.map((dept) => (
                <div key={dept.departmentCode} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{dept.departmentName}</p>
                      <p className="text-sm text-slate-500">Code: {dept.departmentCode}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>Gross: RWF {Number(dept.grossSalary).toLocaleString()}</p>
                      <p>Deduction: RWF {Number(dept.totalDeduction).toLocaleString()}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 space-x-2">
                      <button type="button" onClick={() => handleEdit(dept)} className="rounded-md bg-emerald-500 px-3 py-1 text-white">Edit</button>
                      <button type="button" onClick={() => handleDelete(dept)} className="rounded-md bg-rose-500 px-3 py-1 text-white">Delete</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DepartmentForm;
