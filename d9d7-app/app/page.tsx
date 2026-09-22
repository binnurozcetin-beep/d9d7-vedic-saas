 'use client';

import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthTime: '',
    birthLocation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Chart generation for ${formData.name} coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-purple-900 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">D9/D7 Vedic Chart Reader</h1>
          <p className="text-purple-300 mt-2">Marriage Compatibility Through Navamsha & Saptamsha</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Form Section */}
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Enter Birth Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name" 
                  className="w-full bg-black/50 border border-purple-500/50 rounded px-3 py-2 text-white placeholder-gray-500" 
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <input 
                  type="date" 
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-purple-500/50 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time of Birth</label>
                <input 
                  type="time" 
                  name="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-purple-500/50 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Birth Location</label>
                <input 
                  type="text" 
                  name="birthLocation"
                  value={formData.birthLocation}
                  onChange={handleChange}
                  placeholder="City, Country" 
                  className="w-full bg-black/50 border border-purple-500/50 rounded px-3 py-2 text-white placeholder-gray-500"
                  required
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded mt-6 transition"
              >
                Generate D9/D7 Chart
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="bg-purple-900/40 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">D9/D7 Charts</h2>
            <p className="text-purple-200 mb-4">
              Upload your birth details to get instant D9 (Navamsha) and D7 (Saptamsha) chart readings for marriage compatibility analysis.
            </p>
            
            <div className="space-y-3 text-sm text-purple-200">
              <p>✨ <strong>D9 Chart:</strong> Reveals marriage prospects and life partner compatibility</p>
              <p>✨ <strong>D7 Chart:</strong> Indicates children, progeny and family life</p>
              <p>✨ <strong>Compatibility:</strong> Analyze both partners' charts together</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
