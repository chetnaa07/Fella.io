import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import API from '../api/axios';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-2xl font-black tracking-tight mb-8">MY PROFILE</h1>

      <div className="border border-border p-6">
        <div className="mb-6 pb-6 border-b border-border">
          <p className="text-xs font-bold tracking-wider text-muted">USERNAME</p>
          <p className="text-sm mt-1">{user?.username}</p>
          <p className="text-xs font-bold tracking-wider text-muted mt-3">EMAIL</p>
          <p className="text-sm mt-1">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold tracking-wider text-muted block mb-2">FIRST NAME</label>
              <input
                type="text"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold tracking-wider text-muted block mb-2">LAST NAME</label>
              <input
                type="text"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">PHONE</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-8 py-3 text-sm font-bold tracking-wider hover:bg-accent transition-colors disabled:opacity-50"
          >
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </form>
      </div>
    </div>
  );
}
