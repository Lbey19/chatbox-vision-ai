import { createContext, useContext, useMemo, useState, useCallback } from "react";

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

let idc = 0;

export function ToastProvider({ children }){
  const [list, setList] = useState([]);

  const push = useCallback(({ title, message, kind = "info", ttl = 2200 })=>{
    const id = ++idc;
    setList(l => [...l, { id, title, message, kind }]);
    setTimeout(()=> setList(l => l.filter(t => t.id !== id)), ttl);
  }, []);

  const value = useMemo(()=>({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div style={{position:"fixed", right:20, bottom:20, display:"grid", gap:10, zIndex:50}}>
        {list.map(t => (
          <div key={t.id} className={`toast ${mapKind(t.kind)}`}>
            <div>
              <div className="title">{t.title}</div>
              <div className="msg">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function mapKind(k){
  if(k === "success") return "success";
  if(k === "warn") return "warn";
  if(k === "error") return "error";
  return ""; // info
}
