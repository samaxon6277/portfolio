import { useEffect } from "react";
import { supabase } from "./supabase";

export function useVisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const sessionKey = "samaxon_visitor_session";
        if (!sessionStorage.getItem(sessionKey)) {
          const sessionId = crypto.randomUUID();
          sessionStorage.setItem(sessionKey, sessionId);

          let ip = "unknown";
          try {
             const res = await fetch("https://api.ipify.org?format=json");
             if (res.ok) {
                const data = await res.json();
                ip = data.ip;
             }
          } catch(e) {}

          await supabase.from("visitor_logs").insert({
            session_id: sessionId,
            ip_address: ip,
            user_agent: navigator.userAgent,
            referer: document.referrer || "Direct",
            page_path: window.location.pathname
          });
        }
        
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisitor();
  }, []);
}

