import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../api/axios';

const TSHIRT_COLORS = [
  { hex: '#000000', name: 'Black' },
  { hex: '#FFFFFF', name: 'White' },
  { hex: '#1a1a1a', name: 'Charcoal' },
  { hex: '#f5f5f5', name: 'Off-White' },
];

const PLACEMENTS = [
  { value: 'FRONT', label: 'Front' },
  { value: 'BACK', label: 'Back' },
  { value: 'LEFT_SLEEVE', label: 'Left Sleeve' },
  { value: 'RIGHT_SLEEVE', label: 'Right Sleeve' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CustomDesign() {
  const [designFile, setDesignFile] = useState(null);
  const [designPreview, setDesignPreview] = useState(null);
  const [form, setForm] = useState({
    title: '',
    tshirt_color: '#000000',
    placement: 'FRONT',
    size: 'M',
    quantity: 1,
    text_overlay: '',
    text_color: '#FFFFFF',
  });
  const [submitting, setSubmitting] = useState(false);
  const [myDesigns, setMyDesigns] = useState([]);
  const [showDesigns, setShowDesigns] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large (max 10MB)');
        return;
      }
      setDesignFile(file);
      setDesignPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.svg'] },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!designFile) {
      toast.error('Please upload a design image');
      return;
    }
    if (!form.title.trim()) {
      toast.error('Please enter a design title');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('design_image', designFile);
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      await API.post('/customizer/designs/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Design submitted! We will process your order.');
      setDesignFile(null);
      setDesignPreview(null);
      setForm({ title: '', tshirt_color: '#000000', placement: 'FRONT', size: 'M', quantity: 1, text_overlay: '', text_color: '#FFFFFF' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit design');
    }
    setSubmitting(false);
  };

  const loadMyDesigns = async () => {
    try {
      const res = await API.get('/customizer/designs/');
      setMyDesigns(res.data.results || res.data);
      setShowDesigns(true);
    } catch {
      toast.error('Failed to load designs');
    }
  };

  const price = 799 + (form.quantity - 1) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
          DESIGN YOUR <span className="text-muted">CUSTOM TEE</span>
        </h1>
        <p className="text-sm text-muted mt-2">Upload your art, we print & deliver premium quality</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* T-Shirt Preview */}
        <div className="flex flex-col items-center">
          <div
            className="relative w-72 h-80 flex items-center justify-center border-2 border-dashed border-border transition-colors"
            style={{ backgroundColor: form.tshirt_color === '#FFFFFF' || form.tshirt_color === '#f5f5f5' ? '#f0f0f0' : form.tshirt_color }}
          >
            {/* T-shirt shape outline */}
            <div className="absolute inset-4 border border-white/20 rounded-sm" />

            {/* Design preview */}
            {designPreview ? (
              <img
                src={designPreview}
                alt="Your design"
                className="max-w-[60%] max-h-[60%] object-contain z-10"
                style={{ filter: form.tshirt_color === '#000000' || form.tshirt_color === '#1a1a1a' ? 'none' : 'none' }}
              />
            ) : (
              <div className="text-center z-10">
                <p className={`text-sm ${form.tshirt_color === '#FFFFFF' || form.tshirt_color === '#f5f5f5' ? 'text-gray-400' : 'text-white/50'}`}>
                  Your Design Here
                </p>
              </div>
            )}

            {/* Text overlay preview */}
            {form.text_overlay && (
              <p
                className="absolute bottom-8 text-sm font-bold z-10 text-center w-full"
                style={{ color: form.text_color }}
              >
                {form.text_overlay}
              </p>
            )}

            {/* Placement label */}
            <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 bg-white/20 text-white/70">
              {form.placement}
            </span>
          </div>

          <p className="mt-4 text-2xl font-black">₹{price}</p>
          <p className="text-xs text-muted">Starting at ₹799 • Premium 220 GSM cotton</p>
        </div>

        {/* Design Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Upload Zone */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">UPLOAD DESIGN</label>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-surface' : 'border-border hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              {designFile ? (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-sm">{designFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setDesignFile(null); setDesignPreview(null); }}
                    className="text-red-500"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <HiOutlineUpload className="w-8 h-8 mx-auto text-muted mb-2" />
                  <p className="text-sm text-muted">Drag & drop your design or click to browse</p>
                  <p className="text-[10px] text-muted mt-1">PNG, JPG, SVG • Max 10MB</p>
                </>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">DESIGN TITLE</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Give your design a name"
              required
              className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* T-shirt Color */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">T-SHIRT COLOR</label>
            <div className="flex gap-3">
              {TSHIRT_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setForm({ ...form, tshirt_color: c.hex })}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    form.tshirt_color === c.hex ? 'border-primary scale-110 ring-2 ring-offset-2 ring-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Placement */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">PLACEMENT</label>
            <div className="flex flex-wrap gap-2">
              {PLACEMENTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm({ ...form, placement: p.value })}
                  className={`px-4 py-2 border text-sm font-bold transition-colors ${
                    form.placement === p.value ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">SIZE</label>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, size: s })}
                  className={`w-12 h-12 border text-sm font-bold transition-colors ${
                    form.size === s ? 'border-primary bg-primary text-white' : 'border-border hover:border-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">QUANTITY</label>
            <input
              type="number"
              min="1"
              max="50"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
              className="w-24 px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Optional Text */}
          <div>
            <label className="text-xs font-bold tracking-wider text-muted block mb-2">TEXT OVERLAY (optional)</label>
            <input
              type="text"
              value={form.text_overlay}
              onChange={(e) => setForm({ ...form, text_overlay: e.target.value })}
              placeholder="Add text to your tee"
              maxLength={100}
              className="w-full px-3 py-2 border border-border text-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-4 text-sm font-bold tracking-wider hover:bg-accent transition-colors disabled:opacity-50"
          >
            {submitting ? 'SUBMITTING...' : `ORDER CUSTOM TEE — ₹${price}`}
          </button>
        </form>
      </div>

      {/* My Designs */}
      <div className="mt-16 border-t border-border pt-8">
        <button
          onClick={loadMyDesigns}
          className="text-sm font-bold tracking-wider text-primary hover:underline"
        >
          {showDesigns ? 'REFRESH' : 'VIEW'} MY DESIGNS →
        </button>
        {showDesigns && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {myDesigns.length === 0 ? (
              <p className="text-sm text-muted col-span-full">No designs yet.</p>
            ) : (
              myDesigns.map((d) => (
                <div key={d.id} className="border border-border p-3">
                  <div className="aspect-square bg-surface overflow-hidden mb-2">
                    <img src={d.design_image} alt={d.title} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-sm font-bold truncate">{d.title}</p>
                  <p className="text-xs text-muted">{d.size} · {d.placement} · Qty: {d.quantity}</p>
                  <p className="text-sm font-bold mt-1">₹{d.price}</p>
                  <span className={`text-[10px] font-bold ${d.is_ordered ? 'text-green-600' : 'text-yellow-600'}`}>
                    {d.is_ordered ? 'ORDERED' : 'DRAFT'}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
