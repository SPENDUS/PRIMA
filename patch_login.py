import re

with open('src/pages/Login.tsx', 'r') as f:
    content = f.read()

target1 = """import { LogIn, KeyRound, User, Lock, ExternalLink } from 'lucide-react';
import { useSchoolIdentity } from '../hooks/useSchoolIdentity';"""
replacement1 = """import { useState, useEffect } from 'react';
import { LogIn, KeyRound, User, Lock, ExternalLink } from 'lucide-react';
import { useSchoolIdentity } from '../hooks/useSchoolIdentity';"""

if "import { useState" not in content and target1 in content:
    content = content.replace(target1, replacement1)

target_bg = """  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`
        }}></div>
      </div>"""

replacement_bg = """  const [bgLogin, setBgLogin] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const stored = localStorage.getItem('school_identity_data');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.bgLogin) {
            setBgLogin(data.bgLogin);
            return;
          }
        }
        const res = await fetch('/api/pengaturan');
        const result = await res.json();
        if (result.success && result.data && result.data.bgLogin) {
          setBgLogin(result.data.bgLogin);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        {bgLogin ? (
          <>
            <img src={bgLogin} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/60 dark:bg-slate-900/80"></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 opacity-90"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)`
            }}></div>
          </>
        )}
      </div>"""

if target_bg in content:
    content = content.replace(target_bg, replacement_bg)
else:
    print("Could not find background replacement target")

with open('src/pages/Login.tsx', 'w') as f:
    f.write(content)

