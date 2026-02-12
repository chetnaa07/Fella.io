import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', phone: '', password: '', password2: '' });
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(msg));
      } else {
        toast.error('Registration failed');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter">CREATE ACCOUNT</h1>
          <p className="text-sm text-muted mt-2">Join fella.io today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'username', label: 'USERNAME', type: 'text', placeholder: 'Choose a username' },
            { name: 'email', label: 'EMAIL', type: 'email', placeholder: 'your@email.com' },
            { name: 'phone', label: 'PHONE', type: 'tel', placeholder: '+91 98765 43210' },
            { name: 'password', label: 'PASSWORD', type: 'password', placeholder: 'Min 8 characters' },
            { name: 'password2', label: 'CONFIRM PASSWORD', type: 'password', placeholder: 'Re-enter password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs font-bold tracking-wider text-muted block mb-2">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border text-sm focus:outline-none focus:border-primary transition-colors"
                placeholder={field.placeholder}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 text-sm font-bold tracking-wider hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
