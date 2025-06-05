import React, { useState, useEffect } from "react";
import "./App.css";
import { saveAs } from "file-saver";

// Utility to generate vCard content
function generateVCF(contacts) {
  let vcf = "";
  contacts.forEach(({ name, phone }) => {
    vcf += `BEGIN:VCARD
VERSION:3.0
N:${name}
TEL;TYPE=CELL:${phone}
END:VCARD
`;
  });
  // Add owner contact
  vcf += `BEGIN:VCARD
VERSION:3.0
N:PK DRILL SUPPORT
EMAIL:benardwachira49@gmail.com
TEL;TYPE=CELL:+254794146821
NOTE:PK DRILL VCF SUPPORT Owner
END:VCARD
`;
  return vcf;
}

// WhatsApp Channel link
const CHANNEL_LINK = "https://whatsapp.com/channel/0029Vad7YNyJuyA77CtIPX0x";

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [followed, setFollowed] = useState(false);
  const [timer, setTimer] = useState(24 * 60 * 60); // 24 hours in seconds
  const [isOwner, setIsOwner] = useState(false);

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Format countdown
  function formatTime(sec) {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${h}h ${m}m ${s}s`
  }

  // Handle registration
  function handleRegister(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return alert("All fields required!");
    if (!followed) return alert("You must follow the WhatsApp channel first!");
    setContacts([...contacts, form]);
    setForm({ name: "", phone: "" });
  }

  // VCF Download (owner only)
  function downloadVCF() {
    const blob = new Blob([generateVCF(contacts)], { type: "text/vcard" });
    saveAs(blob, "pkdrill-support.vcf");
  }

  return (
    <div className="App">
      <div className="background-animation" />
      <div className="container">
        <h1>
          <span className="glow">PK DRILL VCF SUPPORT</span>
        </h1>
        <p>
          Register to be added to the exclusive PK DRILL VCF!<br />
          <b>Registration closes in: <span className="timer">{formatTime(timer)}</span></b>
        </p>
        <form className="registration-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            required
          />
          <label className="follow-label">
            <input
              type="checkbox"
              checked={followed}
              onChange={e => setFollowed(e.target.checked)}
              required
            />
            <span>
              I have <a href={CHANNEL_LINK} target="_blank" rel="noopener noreferrer" className="channel-link">followed the WhatsApp channel</a>
            </span>
          </label>
          <button
            type="submit"
            className="glow-button"
            disabled={timer <= 0}
          >
            Register
          </button>
        </form>
        <div className="contacts-list">
          <h3>Registered People ({contacts.length})</h3>
          <ul>
            {contacts.map((c, i) => (
              <li key={i}>{c.name} - {c.phone}</li>
            ))}
          </ul>
        </div>
        <div className="owner-section">
          <label>
            <input type="checkbox" checked={isOwner} onChange={e => setIsOwner(e.target.checked)} />
            <span className="owner-text">I am the owner (PK DRILL)</span>
          </label>
          {isOwner && (
            <button className="glow-button owner-download" onClick={downloadVCF}>
              Download VCF
            </button>
          )}
        </div>
        <footer>
          <div className="owner-details">
            <strong>Contact Owner:</strong> <br />
            Email: <a href="mailto:benardwachira49@gmail.com">benardwachira49@gmail.com</a><br />
            Phone: <a href="tel:+254794146821">+254794146821</a>
          </div>
        </footer>
      </div>
    </div>
  );
    }
