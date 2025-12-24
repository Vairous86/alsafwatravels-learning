import { useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface SecurityProviderProps {
  children: ReactNode;
}

const SecurityProvider = ({ children }: SecurityProviderProps) => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast({
        title: "غير مسموح",
        description: "هذا المحتوى محمي ولا يمكن نسخه أو تحميله",
        variant: "destructive",
      });
    };

    // Disable keyboard shortcuts for download and screen capture
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S, Ctrl+Shift+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (View source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        return false;
      }
      // F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "i" || e.key === "I")) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        return false;
      }
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        navigator.clipboard.writeText("");
        toast({
          title: "محمي",
          description: "تسجيل الشاشة غير مسموح",
          variant: "destructive",
        });
        return false;
      }
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Detect visibility change (tab switching during screen recording)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - could indicate screen recording software
        console.log("Tab visibility changed");
      }
    };

    if (!localStorage.getItem("device_id")) {
      localStorage.setItem("device_id", nanoid());
    }

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Disable text selection via CSS (backup)
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {children}
      {/* Transparent overlay to prevent screen capture tools from focusing on content */}
      <div className="security-overlay" aria-hidden="true" />
    </>
  );
};

export default SecurityProvider;