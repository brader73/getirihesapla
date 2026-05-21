"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function HistoryPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setHistory([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "history"), orderBy("createdAt", "desc"), limit(10));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setHistory(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-24 transform transition-all duration-500 animate-fade-in-down">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shadow-inner">
          <span role="img" aria-label="history">🕒</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Geçmiş Hesaplamalar</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Son yaptığınız analizler</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          Henüz kaydedilmiş bir hesaplamanız bulunmuyor.
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {history.map((item) => (
            <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300">
              <div className="text-xs font-bold text-amber-600 mb-1">{item.type}</div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">{item.resultValue}</div>
              <div className="text-[10px] text-slate-500 mt-2 text-right">
                {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : 'Şimdi'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
