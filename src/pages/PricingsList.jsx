import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "/src/components/firebase";
import { signOut } from "firebase/auth";


export default function PricingsList() {
  const [pricings, setPricings] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "pricings"));
      setPricings(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
  try {
    await signOut(auth);
    alert("Você saiu da sua conta!");
    navigate("/login"); 
  } catch (error) {
    console.error("Erro ao deslogar:", error);
  }
};


  const handleDelete = async () => {
    if (!selected) return alert("Selecione uma precificação!");
    await deleteDoc(doc(db, "pricings", selected));
    alert("Excluído com sucesso!");
    setPricings(pricings.filter((p) => p.id !== selected));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-poppins text-blue-700">
          Precificações anteriores
        </h2>
        <div className="flex gap-4 mt-6 justify-center">
  <button
    className="bg-red-500 text-white px-4 py-2 rounded"
    onClick={handleLogout}
  >
    Deslogar
  </button>

  <button
    className="bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => navigate("/clients/new")}
  >
    Nova Precificação
  </button>
</div>
</div>
      <ul className="bg-purple-50 p-4 rounded">
        {pricings.map((p) => (
          <li
            key={p.id}
            className={`flex items-center justify-between border-b py-2 cursor-pointer ${
              selected === p.id ? "bg-blue-100" : ""
            }`}
            onClick={() => setSelected(p.id)}
          >
            <span>
              {p.equipment_name} - {p.problem_description}
            </span>
            <input type="radio" checked={selected === p.id} readOnly />
          </li>
        ))}
      </ul>

      <div className="flex gap-4 mt-6 justify-center">
       <button
  className="bg-green-500 text-white px-4 py-2 rounded"
  onClick={() => selected && navigate(`/pricings/review/${selected}`)}
>
  Visualizar
</button>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Exportar PDF
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleDelete}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
