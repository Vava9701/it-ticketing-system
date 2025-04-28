import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

export default function TicketForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tickets', {
        title,
        description,
        priority
      });
      alert('Tiket berhasil dibuat!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Judul Tiket</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Deskripsi</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Prioritas</Form.Label>
        <Form.Select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Rendah</option>
          <option value="medium">Sedang</option>
          <option value="high">Tinggi</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">
        Buat Tiket
      </Button>
    </Form>
  );
}