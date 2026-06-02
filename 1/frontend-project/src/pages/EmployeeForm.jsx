import { useEffect, useState } from 'react';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from '../api/employeeApi';
import { getDepartments } from '../api/departmentApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

function EmployeeForm() {
  const [form, setForm] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    position: '',
    address: '',
    telephone: '',
    gender: 'Male',
    hiredDate: '',
    departmentCode: '',
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([getDepartments(), getEmployees()]);
      setDepartments(deptRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      toast.error('Unable to load employees or departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = ['employeeNumber', 'firstName', 'lastName', 'position', 'telephone', 'departmentCode'];
    const missing = requiredFields.filter((field) => !form[field]);
    if (missing.length) {
      return toast.error('Please fill all required employee fields');
    }
    if (!/^\d{10}$/.test(form.telephone)) {
      return toast.error('Phone number must contain 10 digits');
    }
    setLoading(true);
    try {
      if (editing && form.employeeNumber) {
        await updateEmployee(form.employeeNumber, form);
        toast.success('Employee updated successfully');
      } else {
        await createEmployee(form);
        toast.success('Employee saved successfully');
      }
      setForm({
        employeeNumber: '',
        firstName: '',
        lastName: '',
        position: '',
        address: '',
        telephone: '',
        gender: 'Male',
        hiredDate: '',
        departmentCode: '',
      });
      setEditing(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    setForm({
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      address: employee.address,
      telephone: employee.telephone,
      gender: employee.gender || 'Male',
      hiredDate: employee.hiredDate ? employee.hiredDate.split('T')[0] : '',
      departmentCode: employee.departmentCode,
    });
    setEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (employee) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(employee.employeeNumber);
      toast.success('Employee deleted');
      loadData();
    } catch (err) {
      console.error(err);
      toast.error('Unable to delete employee');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Employee Management</h2>
        <p className="mt-2 text-slate-500">Create new employees and view current employee data.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Employee Number *</span>
              <input name="employeeNumber" value={form.employeeNumber} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
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
            <label className="block">
              <span className="text-sm font-medium text-slate-700">First Name *</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Last Name *</span>
              <input name="lastName"  value={form.lastName} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Position *</span>
              <input name="position" value={form.position} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Phone *</span>
              <input name="telephone" value={form.telephone} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Gender</span>
              <select name="gender" value={form.gender} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Hired Date</span>
              <input type="date" name="hiredDate" value={form.hiredDate} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900" />
            </label>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Address</span>
            <textarea name="address" value={form.address} onChange={handleChange} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400" rows="3" />
          </label>
          <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700">Save Employee</button>
        </form>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Recent Employees</h3>
          <div className="mt-4 space-y-3">
            {employees.length === 0 ? (
              <p className="text-slate-500">No employees created yet.</p>
            ) : (
              employees.slice(-5).reverse().map((employee) => (
                <div key={employee.employeeNumber} className="rounded-3xl border border-slate-100 bg-slate-50 p-4 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{employee.firstName} {employee.lastName}</p>
                    <p className="text-sm text-slate-500">{employee.position} — {employee.departmentCode}</p>
                  </div>
                  <div className="space-x-2">
                    <button type="button" onClick={() => handleEdit(employee)} className="rounded-md bg-emerald-500 px-3 py-1 text-white">Edit</button>
                    <button type="button" onClick={() => handleDelete(employee)} className="rounded-md bg-rose-500 px-3 py-1 text-white">Delete</button>
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

export default EmployeeForm;
