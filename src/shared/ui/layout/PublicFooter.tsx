export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 py-10 text-sm md:grid-cols-4">
        <div>
          <p className="mb-3 font-semibold text-white">JasMed</p>
          <p className="text-slate-400">Prise de rendez-vous médicaux en ligne, simple et sécurisée.</p>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Plateforme</p>
          <ul className="space-y-2 text-slate-400">
            <li>Médecins</li>
            <li>Rendez-vous</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Légal</p>
          <ul className="space-y-2 text-slate-400">
            <li>Confidentialité</li>
            <li>Conditions</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-slate-400">
            <li>contact@cabinet.local</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} JasMed. Tous droits réservés.
      </div>
    </footer>
  )
}
