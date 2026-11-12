import { Link } from 'react-router-dom';
import { EmptyState } from '../components/ui';

export default function NotFound() {
  return (
    <EmptyState
      title="Diese Seite ist nicht aufgegangen"
      action={
        <Link to="/" className="btn-primary">
          Zur Startseite
        </Link>
      }
    >
      Die Adresse gibt es nicht (mehr).
    </EmptyState>
  );
}
