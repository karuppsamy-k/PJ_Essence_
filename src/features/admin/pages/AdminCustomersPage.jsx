import React, { useEffect, useState } from 'react';
import { Users, Mail, Compass, Star, DollarSign, Calendar } from 'lucide-react';
import { getCustomerRepository } from '../../../repositories';

export function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const repo = getCustomerRepository();
        const list = await repo.list();
        setCustomers(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-bronze font-semibold">Client Relations</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-semibold mt-0.5">VIP Client Directory</h1>
        <p className="text-xs text-taupe-dark mt-1">
          Complete client fragrance dossiers, lifetime spending, and tailored olfactory profiles.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-bronze/25 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-warm/80 text-taupe-dark uppercase tracking-wider text-[10px] border-b border-taupe/20">
              <tr>
                <th className="p-4">Client Identity</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role Tier</th>
                <th className="p-4">Lifetime Investment</th>
                <th className="p-4">Commissions</th>
                <th className="p-4">Olfactory Affinity Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-taupe/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-taupe-dark">
                    Loading client registry...
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/30 transition-colors">
                    <td className="p-4">
                      <span className="font-serif font-bold text-charcoal text-sm block">{c.name}</span>
                      <span className="text-[11px] text-taupe-dark">UID: {c.id}</span>
                    </td>

                    <td className="p-4 text-taupe-dark">
                      <span className="text-charcoal font-medium block">{c.email}</span>
                      <span className="text-[11px]">Member since {new Date(c.createdAt).toLocaleDateString()}</span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        c.role === 'ADMIN' ? 'bg-burgundy text-cream' : 'bg-bronze/10 text-bronze-dark border border-bronze/30'
                      }`}>
                        {c.role === 'ADMIN' ? 'Master Parfumeur' : 'Private Client'}
                      </span>
                    </td>

                    <td className="p-4 font-serif font-bold text-burgundy text-sm">
                      ₹{c.totalSpent.toLocaleString('en-IN')}
                    </td>

                    <td className="p-4 font-semibold text-charcoal">
                      {c.orderCount} orders
                    </td>

                    <td className="p-4">
                      {c.savedProfile ? (
                        <div className="text-[11px] space-y-0.5">
                          <span className="font-semibold text-charcoal block">{c.savedProfile.name}</span>
                          <span className="text-taupe-dark">
                            Season: {c.savedProfile.season} • Warmth: {c.savedProfile.warmth}/10
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-taupe-dark italic">Quiz pending</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
