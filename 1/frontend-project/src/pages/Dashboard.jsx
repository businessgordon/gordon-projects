import { useEffect, useState } from 'react';
import StatsCard from '../components/StatsCard';
import { getEmployees } from '../api/employeeApi';
import { getDepartments } from '../api/departmentApi';
import { getSalaries } from '../api/salaryApi';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const [stats, setStats] = useState({ employees: 0, departments: 0, salaries: 0, payroll: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [employeesRes, departmentsRes, salariesRes] = await Promise.all([
          getEmployees(),
          getDepartments(),
          getSalaries(),
        ]);
        const salaries = salariesRes.data || [];
        const payroll = salaries.reduce((sum, record) => sum + Number(record.netSalary), 0);

        setStats({
          employees: employeesRes.data.length,
          departments: departmentsRes.data.length,
          salaries: salaries.length,
          payroll,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <section className="card-surface overflow-hidden p-6 text-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="soft-pill">Payroll Overview</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back to your SmartPark control center</h2>
            <p className="mt-2 max-w-2xl text-slate-600">Track staffing, payroll totals, and monthly salary records with a cleaner, faster workspace.</p>
          </div>
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 p-4 text-white shadow-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">This Month</p>
            <p className="mt-2 text-2xl font-semibold">RWF {stats.payroll.toLocaleString()}</p>
            <p className="text-sm text-cyan-100">Total net payroll</p>
          </div>
        </div>
      </section>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Employees" value={stats.employees} icon="👥" colorClass="bg-sky-600" />
        <StatsCard title="Departments" value={stats.departments} icon="🏢" colorClass="bg-emerald-600" />
        <StatsCard title="Salary Records" value={stats.salaries} icon="💼" colorClass="bg-violet-600" />
        <StatsCard title="Payroll Total" value={`RWF ${stats.payroll.toLocaleString()}`} icon="💰" colorClass="bg-amber-600" />
      </div>
    </div>
  );
}

export default Dashboard;
