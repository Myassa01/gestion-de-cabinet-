import { Link } from 'react-router-dom'
import { Button } from '../Button'

export function PublicNav() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center">
          <img src="/logo-mark.png" alt="JasMed" className="h-10 object-contain" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <Link to="/" className="hover:text-brand-600">
            Accueil
          </Link>
          <Link to="/doctors" className="hover:text-brand-600">
            Médecins
          </Link>
          <Link to="/contact" className="hover:text-brand-600">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Se connecter
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
