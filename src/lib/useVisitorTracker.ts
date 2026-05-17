import { useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export function useVisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const sessionKey = "samaxon_visitor_session";
        if (!sessionStorage.getItem(sessionKey)) {
          sessionStorage.setItem(sessionKey, "true");

          // Note: Full IP tracking in frontend is tricky without an API due to CORS.
          // We can use a free IP API or just log the browser data.
          let ip = "unknown";
          try {
             // Example simple IP fetch
             const res = await fetch("https://api.ipify.org?format=json");
             if (res.ok) {
                const data = await res.json();
                ip = data.ip;
             }
          } catch(e) {}

          await addDoc(collection(db, "visitor_logs"), {
            ip,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            createdAt: serverTimestamp(),
            source: document.referrer || "Direct"
          });
        }
        
        // Track page view
        await addDoc(collection(db, "page_views"), {
           path: window.location.pathname,
           timestamp: Date.now(),
           createdAt: serverTimestamp()
        });
        
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisitor();
  }, []);
}
