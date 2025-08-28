import { useState } from "react";
import { db } from "/src/components/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";

export default function NewClient() {
  const [form, setForm] = useState({
    name: "",
    CNPJ:"",
    address: "",
    city_state: "",
    cep: "",
    phone: "",
    email: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const docRef = await addDoc(collection(db, "clients"), form);
      alert("✅ Cliente cadastrado com sucesso!");
      navigate(`/pricings/new?clientId=${docRef.id}`); // já manda para precificação
    } catch (err) {
      console.error(err);
      setError("❌ Erro ao cadastrar cliente");
    }
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
            Cadastrar Cliente
          </h2>

          <input type="text" name="name" placeholder="Nome da empresa" value={form.name} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" required />
           <input type="text" name="Cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" required />
          <input type="text" name="address" placeholder="Endereço" value={form.address} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" />
          <input type="text" name="city_state" placeholder="Cidade/Estado" value={form.city_state} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" />
          <input type="text" name="cep" placeholder="CEP" value={form.cep} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" />
          <input type="text" name="phone" placeholder="Telefone" value={form.phone} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 rounded-md border border-gray-300" />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition">
            Salvar Cliente
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
