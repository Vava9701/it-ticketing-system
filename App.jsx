import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">IT Ticketing System</h1>
      <TicketForm />
      <hr />
      <h2 className="mb-3">Daftar Tiket</h2>
      <TicketList />
    </div>
  );
}