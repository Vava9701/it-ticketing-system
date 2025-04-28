import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function AdminDashboard() {
  useEffect(() => {
    socket.on('ticketCreated', (ticket) => {
      alert(`Tiket baru: ${ticket.title}`);
    });
    return () => socket.disconnect();
  }, []);

  return <div>Dashboard Admin</div>;
}