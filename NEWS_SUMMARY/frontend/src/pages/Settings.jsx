import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import ThemeToggle from '../components/ThemeToggle'

export default function Settings(){
  const [settings, setSettings] = useState({
    language: 'en',
    summaryLength: 'medium',
    darkMode: true,
    enableNotifications: false,
    autoSave: true
  })

  useEffect(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSetting = (key, value) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    localStorage.setItem('appSettings', JSON.stringify(updated))
  }

  const languages = [
    { code: 'en', name: '🇬🇧 English', label: 'English' },
    { code: 'hi', name: '🇮🇳 Hindi', label: 'हिंदी' },
    { code: 'mr', name: '🇮🇳 Marathi', label: 'मराठी' },
    { code: 'te', name: '🇮🇳 Telugu', label: 'తెలుగు' },
    { code: 'bho', name: '🇮🇳 Bhojpuri', label: 'भोजपुरी' }
  ]

  const summaryOptions = [
    { value: 'short', label: '📝 Short (2 sentences)', desc: 'Quick overview' },
    { value: 'medium', label: '📄 Medium (5 sentences)', desc: 'Balanced summary' },
    { value: 'long', label: '📖 Long (8 sentences)', desc: 'Comprehensive' }
  ]

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <h3 className="text-2xl font-bold mb-6">⚙️ Settings</h3>

        {/* Theme Setting */}
        <Card className="mb-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700">
            <div>
              <div className="font-semibold text-slate-100">🌙 Dark Mode</div>
              <div className="text-sm text-slate-400 mt-1">Toggle between dark and light theme</div>
            </div>
            <ThemeToggle />
          </div>
        </Card>

        {/* Language Setting */}
        <Card className="mb-4">
          <div>
            <div className="font-semibold text-slate-100 mb-3">🌍 Default Language</div>
            <div className="text-sm text-slate-400 mb-4">Choose your preferred language for summaries</div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => updateSetting('language', lang.code)}
                  className={`p-3 rounded-lg text-left transition ${
                    settings.language === lang.code
                      ? 'bg-indigo-600 border border-indigo-400 text-white'
                      : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div className="font-medium">{lang.name}</div>
                  <div className="text-xs opacity-70">{lang.label}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Summary Length Setting */}
        <Card className="mb-4">
          <div>
            <div className="font-semibold text-slate-100 mb-3">📊 Default Summary Length</div>
            <div className="text-sm text-slate-400 mb-4">Choose how detailed summaries should be</div>
            <div className="space-y-2">
              {summaryOptions.map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition ${
                    settings.summaryLength === opt.value
                      ? 'bg-indigo-600/20 border border-indigo-500'
                      : 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    name="summaryLength"
                    value={opt.value}
                    checked={settings.summaryLength === opt.value}
                    onChange={(e) => updateSetting('summaryLength', e.target.value)}
                    className="w-4 h-4"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-slate-100">{opt.label}</div>
                    <div className="text-xs text-slate-400">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </Card>

        {/* Auto-Save Setting */}
        <Card className="mb-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-700">
            <div>
              <div className="font-semibold text-slate-100">💾 Auto-Save Summaries</div>
              <div className="text-sm text-slate-400 mt-1">Automatically save generated summaries</div>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => updateSetting('autoSave', e.target.checked)}
                className="w-5 h-5"
              />
            </label>
          </div>
        </Card>

        {/* Notifications Setting */}
        <Card className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-100">🔔 Browser Notifications</div>
              <div className="text-sm text-slate-400 mt-1">Get notifications when summaries are ready</div>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="w-5 h-5"
              />
            </label>
          </div>
        </Card>

        {/* Info Section */}
        <Card className="bg-blue-900/20 border border-blue-700/30">
          <div className="flex gap-3">
            <div className="text-2xl">ℹ️</div>
            <div>
              <div className="font-semibold text-blue-100">💡 Tip</div>
              <p className="text-sm text-blue-200 mt-1">
                Your settings are saved locally in your browser. They persist across sessions and don't affect other users.
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="text-sm text-slate-400 space-y-2">
            <p>📝 <strong>Version:</strong> 1.0.0</p>
            <p>🔧 <strong>Backend:</strong> Flask API</p>
            <p>⚛️ <strong>Frontend:</strong> React 18 + Vite</p>
            <p>🎨 <strong>Styling:</strong> Tailwind CSS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
