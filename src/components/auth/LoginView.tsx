import React, { useState } from 'react';
import {
  Activity,
  ShieldCheck,
  Lock,
  ArrowRight,
  Server,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: { name: string; role: string }) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<'actuary' | 'claims' | 'executive'>('actuary');
  const [email, setEmail] = useState('e.kiplagat@medinsure.co.ke');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const DEMO_ROLES = [
    {
      id: 'actuary',
      title: 'Lead Health Actuary / BI',
      name: 'Dr. Evans Kiplagat',
      email: 'e.kiplagat@medinsure.co.ke',
      badge: 'Full Decision Access',
    },
    {
      id: 'claims',
      title: 'Senior Claims Adjudicator',
      name: 'Mercy Chebet',
      email: 'm.chebet@medinsure.co.ke',
      badge: 'Audit & Investigation',
    },
    {
      id: 'executive',
      title: 'Chief Underwriting Officer',
      name: 'Anthony Gitonga',
      email: 'a.gitonga@medinsure.co.ke',
      badge: 'Executive Governance',
    },
  ];

  const handleRoleSelect = (roleId: 'actuary' | 'claims' | 'executive') => {
    setSelectedRole(roleId);
    const r = DEMO_ROLES.find((role) => role.id === roleId);
    if (r) {
      setEmail(r.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const r = DEMO_ROLES.find((role) => role.id === selectedRole);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: r?.name || 'Dr. Evans Kiplagat',
        role: r?.title || 'Lead Health Actuary / BI',
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 text-slate-100 font-sans relative overflow-hidden">
      {/* Subtle Background Radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 mx-auto shadow-md">
            <Activity className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            MedInsure Analytics
          </h1>
          <p className="text-xs text-teal-400 font-medium tracking-wide uppercase">
            Medical Insurance Intelligence & Claims Analytics
          </p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Decision-support intelligence platform for health schemes, underwriters, and actuarial teams.
          </p>
        </div>

        {/* Login Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          {/* Demo Role Selector */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Select Demo Portfolio Persona:
            </label>
            <div className="space-y-2">
              {DEMO_ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleRoleSelect(role.id as any)}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-teal-950/60 border-teal-500 text-white shadow-xs ring-1 ring-teal-500/60'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block">{role.name}</span>
                      <span className="text-[11px] text-slate-400">{role.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {role.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Corporate Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Security Token / Password</label>
              <input
                type="password"
                value={password}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>{isLoading ? 'Authenticating Scheme Access...' : 'Launch Intelligence Platform'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              SOC2 Type II & HIPAA
            </span>
            <span className="font-mono text-slate-500">FastAPI • v2.4-py</span>
          </div>
        </div>

        {/* Portfolio Credit Note */}
        <p className="text-center text-[11px] text-slate-500">
          Portfolio Demonstration • Python Data Science & Healthcare Analytics Frontend
        </p>
      </div>
    </div>
  );
};
