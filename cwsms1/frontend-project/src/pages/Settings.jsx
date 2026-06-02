import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="surface-card p-6">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-slate-600">Manage your account and application settings.</p>
      </div>
      <div className="surface-card p-6">
        <h3 className="text-xl font-semibold">Account Profile</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="surface-panel p-4">
            <p className="text-slate-500">Username</p>
            <p className="mt-2 text-lg">{user?.username}</p>
          </div>
          <div className="surface-panel p-4">
            <p className="text-slate-500">Email</p>
            <p className="mt-2 text-lg">{user?.email}</p>
          </div>
          <div className="surface-panel p-4">
            <p className="text-slate-500">Role</p>
            <p className="mt-2 text-lg">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
