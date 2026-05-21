import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export function useSaveCalculation() {
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const saveCalculation = async (type: string, resultValue: string) => {
    if (!user) {
      alert("Hesaplamayı kaydetmek için lütfen giriş yapın.");
      return;
    }
    
    setIsSaving(true);
    try {
      const historyRef = collection(db, "users", user.uid, "history");
      await addDoc(historyRef, {
        type,
        resultValue,
        createdAt: serverTimestamp(),
      });
      alert("Hesaplama başarıyla geçmişinize eklendi!");
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      alert("Kaydedilirken bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return { saveCalculation, isSaving, user };
}
