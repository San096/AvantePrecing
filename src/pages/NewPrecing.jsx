import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";

export default function NewPricing() {
  // 🔹 Consultoria (fixos)
  const companyData = {
    name: "AvanteTech Jr.",
    cnpj: "55.625.728/0001-09",
    address: "Avenida Jose de Freitas Queiroz, 5003 - Cedro - Quixadá/CE - CEP 63.902-580",
    phone: "(88) 9618-8715",
    email: "avantetechjr@gmail.com",
  };

  const [clients, setClients] = useState([]);
  const [searchParams] = useSearchParams();
  const clientIdFromUrl = searchParams.get("clientId");

  const [form, setForm] = useState({
    clientId: clientIdFromUrl || "",
    problem_description: "",
    serveco_prestado: "",
    brand: "",
    model: "",
    devs: 1,
    business_days: 1,
    hours_per_day: 1,
    hourly_rate: 0,
  });

  // 🔹 Procedimentos
  const [procedures, setProcedures] = useState([{ description: "", days: 0 }]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      setClients(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 gera código único
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0);

    const q = query(
      collection(db, "pricings"),
      where("created_at", ">=", startOfMonth),
      where("created_at", "<=", endOfMonth)
    );
    const snapshot = await getDocs(q);
    const sequence = String(snapshot.size + 1).padStart(3, "0");

    const codigo = `Avante-${year}.${month}.${sequence}`;

    const total_hours =
      form.business_days * form.hours_per_day * form.devs;
    const total_cost = total_hours * form.hourly_rate;

    // 🔹 salva tudo em um único documento
    const docRef = await addDoc(collection(db, "pricings"), {
      ...form,
      codigo,
      total_hours,
      total_cost,
      status: "draft",
      created_at: new Date(),
      companyData,
      procedures: procedures.filter((p) => p.description.trim() !== ""), // 👈 salva junto
    });

    alert(`✅ Precificação criada com sucesso! TAG: ${codigo}`);
    navigate(`/pricings/review/${docRef.id}`);
  };

  // 🔹 Atualiza procedimento
  const handleProcedureChange = (index, field, value) => {
    const updated = [...procedures];
    updated[index][field] = value;
    setProcedures(updated);
  };

  // 🔹 Adiciona novo procedimento
  const addProcedure = () => {
    setProcedures([...procedures, { description: "", days: 0 }]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center justify-center flex-1 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg mt-6 flex flex-col gap-3"
        >
          <h2 className="text-center text-xl font-semibold mb-4">
            Nova Precificação
          </h2>

          {/* 🔹 Consultoria */}
          <div className="p-3 border rounded bg-gray-50 text-sm">
            <p><strong>{companyData.name}</strong></p>
            <p>CNPJ: {companyData.cnpj}</p>
            <p>{companyData.address}</p>
            <p>{companyData.phone} - {companyData.email}</p>
          </div>

          {/* Cliente */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Cliente</label>
            <select
              className="border p-2 rounded"
              value={form.clientId}
              onChange={(e) =>
                setForm({ ...form, clientId: e.target.value })
              }
              required
            >
              <option value="">Selecione o cliente</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Problema */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Descrição do problema
            </label>
            <input
              type="text"
              value={form.problem_description}
              onChange={(e) =>
                setForm({ ...form, problem_description: e.target.value })
              }
              className="border p-2 rounded"
            />
          </div>

          {/* Equipamento */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Serviço Prestado"
              value={form.equipment_name}
              onChange={(e) =>
                setForm({ ...form, equipment_name: e.target.value })
              }
              className="border p-2 rounded w-1/3"
            />
            <input
              type="text"
              placeholder="Marca"
              value={form.brand}
              onChange={(e) =>
                setForm({ ...form, brand: e.target.value })
              }
              className="border p-2 rounded w-1/3"
            />
            <input
              type="text"
              placeholder="Modelo"
              value={form.model}
              onChange={(e) =>
                setForm({ ...form, model: e.target.value })
              }
              className="border p-2 rounded w-1/3"
            />
          </div>

          {/* Procedimentos */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Procedimentos & Cronograma
            </label>
            {procedures.map((p, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Nome do procedimento"
                  value={p.description}
                  onChange={(e) =>
                    handleProcedureChange(index, "description", e.target.value)
                  }
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Dias"
                  value={p.days}
                  onChange={(e) =>
                    handleProcedureChange(index, "days", Number(e.target.value))
                  }
                  className="border p-2 rounded w-20"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addProcedure}
              className="bg-gray-200 text-sm px-2 py-1 rounded"
            >
              + Adicionar procedimento
            </button>
          </div>

          {/* Equipe e tempo */}
          <div className="flex gap-2">
            <div className="flex flex-col w-1/3">
              <label className="text-sm font-medium mb-1">Devs</label>
              <input
                type="number"
                placeholder="Qtd."
                value={form.devs}
                onChange={(e) =>
                  setForm({ ...form, devs: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col w-1/3">
              <label className="text-sm font-medium mb-1">Dias úteis</label>
              <input
                type="number"
                placeholder="Ex: 10"
                value={form.business_days}
                onChange={(e) =>
                  setForm({ ...form, business_days: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col w-1/3">
              <label className="text-sm font-medium mb-1">Horas/dia</label>
              <input
                type="number"
                placeholder="Ex: 8"
                value={form.hours_per_day}
                onChange={(e) =>
                  setForm({ ...form, hours_per_day: Number(e.target.value) })
                }
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Valor hora */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Informe o valor da hora
            </label>
            <input
              type="number"
              value={form.hourly_rate}
              onChange={(e) =>
                setForm({ ...form, hourly_rate: Number(e.target.value) })
              }
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition mt-4"
          >
            Salvar Precificação
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
