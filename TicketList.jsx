import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await axios.get('http://localhost:5000/api/tickets');
      setTickets(res.data);
    };
    fetchTickets();
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Judul</th>
          <th>Status</th>
          <th>Prioritas</th>
        </tr>
      </thead>
      <tbody>
        {tickets.map((ticket) => (
          <tr key={ticket.id}>
            <td>{ticket.id}</td>
            <td>{ticket.title}</td>
            <td>{ticket.status}</td>
            <td>{ticket.priority}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

const updateStatus = async (id, newStatus) => {
  try {
    await axios.put(
      `http://localhost:5000/api/tickets/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    alert('Status berhasil diupdate!');
  } catch (error) {
    console.error(error);
  }
};

// Di dalam tabel:
<select onChange={(e) => updateStatus(ticket.id, e.target.value)}>
  <option value="open">Open</option>
  <option value="pending">Pending</option>
  <option value="resolved">Resolved</option>
</select>