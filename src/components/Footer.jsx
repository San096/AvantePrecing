import logo from "/src/assets/logosasp.png"


export default function Footer() {
  return (
    <footer className="w-full bg-blue-200 text-center text-xs py-3 mt-10 flex flex-col items-center gap-2">
      <img src={logo} alt="Logo ÁSAP-DEV" className="h-8" />
      <p>
        Produzido por <span className="font-semibold">SASP-DEV</span>
      </p>
    </footer>
  );
}
