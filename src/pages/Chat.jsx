import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  // user courant
  let me = { id: null, firstName: "Moi", lastName: "" };
  try {
    const stored = localStorage.getItem("user");
    me = stored ? JSON.parse(stored) : me;
  } catch {}

  const publicChannels = ["general", "entraide", "logistique", "alertes"];
  const [current, setCurrent] = useState(publicChannels[0]);
  const [users, setUsers] = useState([]);

  // Charger la liste pour libellé DM
  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((res) => res.json())
      .then((arr) => setUsers(Array.isArray(arr) ? arr : []))
      .catch(() => setUsers([]));
  }, []);

  // Calcul du channel API + user DM affiché
  let apiChannel = current;
  let dmUser = null;

  if (current.startsWith("dm:")) {
    const userId = current.replace("dm:", "");
    dmUser = users.find((u) => u.id?.toString() === userId);

    if (dmUser && me?.id) {
      const ids = [Number(me.id), Number(dmUser.id)].sort((a, b) => a - b);
      apiChannel = `dm__${ids[0]}__${ids[1]}`;
    }
  }

  return (
    <div className="chat-layout">
      <Sidebar
        channels={publicChannels}
        selected={current}
        onSelect={setCurrent}
      />
      <ChatWindow
        channel={apiChannel}
        me={me}
        dmUser={dmUser}
      />
    </div>
  );
}
