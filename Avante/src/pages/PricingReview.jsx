import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "/src/components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Header from "/src/components/Header";
import Footer from "/src/components/Footer";
import jsPDF from "jspdf";
import avanteLogo from "/src/assets/avantelogo.png";

export default function PricingReview() {
  const { id } = useParams();
  const [pricing, setPricing] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Dados fixos da consultoria
  const companyData = {
    name: "AvanteTech Jr.",
    cnpj: "55.625.728/0001-09",
    address: "Avenida Jose de Freitas Queiroz, 5003 - Cedro - Quixadá/CE - CEP 63.902-580",
    phone: "(88) 9618-8715",
    email: "avantetechjr@gmail.com",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pricingRef = doc(db, "pricings", id);
        const pricingSnap = await getDoc(pricingRef);

        if (!pricingSnap.exists()) {
          alert("Precificação não encontrada!");
          navigate("/pricings");
          return;
        }

        const pricingData = { id: pricingSnap.id, ...pricingSnap.data() };
        setPricing(pricingData);

        if (pricingData.clientId) {
          const clientRef = doc(db, "clients", pricingData.clientId);
          const clientSnap = await getDoc(clientRef);
          if (clientSnap.exists()) {
            setClient({ id: clientSnap.id, ...clientSnap.data() });
          }
        }
      } catch (err) {
        console.error("Erro ao carregar revisão:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    }
  };

  // 🔹 Função auxiliar título seção
  const drawSectionTitle = (pdf, title, y) => {
    pdf.setFillColor(0, 102, 204);
    pdf.rect(10, y, 190, 8, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.text(title, 105, y + 6, { align: "center" });
    pdf.setTextColor(0, 0, 0);
    return y + 14;
  };

  // ✅ Exportar PDF
  const handleExportPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 20;

    // Logo
    pdf.addImage(avanteLogo, "PNG", 10, 10, 20, 20);

    // Título
    pdf.setFontSize(16);
    pdf.text("Orçamento Detalhado", 105, y, { align: "center" });
    y += 20;

    // 1️⃣ Consultoria
    y = drawSectionTitle(pdf, "Consultoria", y);
    pdf.setFontSize(10);
    pdf.text(`Nome: ${companyData.name}`, 10, y); y += 6;
    pdf.text(`CNPJ: ${companyData.cnpj}`, 10, y); y += 6;
    pdf.text(`Endereço: ${companyData.address}`, 10, y); y += 6;
    pdf.text(`Telefone: ${companyData.phone}`, 10, y); y += 6;
    pdf.text(`Email: ${companyData.email}`, 10, y); y += 10;

    // 2️⃣ Cliente
    y = drawSectionTitle(pdf, "Cliente", y);
    pdf.text(`Nome: ${client?.name || ""}`, 10, y); y += 6;
    pdf.text(`Email: ${client?.email || ""}`, 10, y); y += 6;
    pdf.text(`Telefone: ${client?.phone || ""}`, 10, y); y += 6;
    pdf.text(`Cidade/Estado: ${client?.city_state || ""}`, 10, y); y += 10;

    // 3️⃣ Precificação
    y = drawSectionTitle(pdf, "Precificação", y);
    pdf.text(`Código: ${pricing?.codigo}`, 10, y); y += 6;
    pdf.text(`Descrição: ${pricing?.problem_description}`, 10, y); y += 6;
    pdf.text(`Devs: ${pricing?.devs}`, 10, y); y += 6;
    pdf.text(`Dias úteis: ${pricing?.business_days}`, 10, y); y += 6;
    pdf.text(`Horas/dia: ${pricing?.hours_per_day}`, 10, y); y += 6;
    pdf.text(`Total de horas: ${pricing?.total_hours}`, 10, y); y += 6;
    pdf.text(`Valor hora: R$ ${pricing?.hourly_rate}`, 10, y); y += 6;
    pdf.text(`Custo total: R$ ${pricing?.total_cost}`, 10, y); y += 10;

    // 4️⃣ Procedimentos
    y = drawSectionTitle(pdf, "Procedimentos & Cronograma", y);
    if (pricing?.procedures?.length > 0) {
      pricing.procedures.forEach((p, index) => {
        pdf.text(`${index + 1}. ${p.description} — ${p.days} dias`, 10, y);
        y += 6;
      });
    } else {
      pdf.text("Nenhum procedimento informado", 10, y);
      y += 6;
    }

    // 5️⃣ Formalização
    y = drawSectionTitle(pdf, "Formalização", y);
    pdf.setFontSize(10);
    pdf.text(
      `Criado em: ${
        pricing?.created_at?.seconds
          ? new Date(pricing.created_at.seconds * 1000).toLocaleString()
          : ""
      }`,
      10,
      y
    );
    y += 20;

    pdf.line(20, 260, 190, 260);
    pdf.setFontSize(12);
    pdf.text("Assinatura do Diretor Financeiro", 105, 270, { align: "center" });

    pdf.save(`Precificacao-${pricing?.codigo}.pdf`);
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!pricing) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex flex-col items-center flex-1 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl mt-6">
          <h2 className="text-xl font-bold text-center mb-6">
            Revisão da Precificação
          </h2>

          {/* Cliente */}
          <h3 className="text-lg font-semibold mb-2">Cliente</h3>
          {client ? (
            <>
              <p><strong>Nome:</strong> {client.name}</p>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Telefone:</strong> {client.phone}</p>
              <p><strong>Cidade/Estado:</strong> {client.city_state}</p>
            </>
          ) : (
            <p>Cliente não encontrado</p>
          )}

          <hr className="my-4" />

          {/* Precificação */}
          <h3 className="text-lg font-semibold mb-2">Informações da Precificação</h3>
          <p><strong>Código:</strong> {pricing.codigo}</p>
          <p><strong>Descrição:</strong> {pricing.problem_description}</p>
          <p><strong>Devs:</strong> {pricing.devs}</p>
          <p><strong>Dias úteis:</strong> {pricing.business_days}</p>
          <p><strong>Horas/dia:</strong> {pricing.hours_per_day}</p>
          <p><strong>Total de horas:</strong> {pricing.total_hours}</p>
          <p><strong>Valor hora:</strong> R$ {pricing.hourly_rate}</p>
          <p><strong>Custo total:</strong> R$ {pricing.total_cost}</p>

          <hr className="my-4" />

          {/* Procedimentos */}
          <h3 className="text-lg font-semibold mb-2">Procedimentos</h3>
          {pricing?.procedures?.length > 0 ? (
            <ul className="list-disc ml-6">
              {pricing.procedures.map((p, index) => (
                <li key={index}>
                  {p.description} — {p.days} dias
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum procedimento informado</p>
          )}

          <div className="flex gap-4 mt-6 justify-center">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={handleExportPDF}
            >
              Exportar PDF
            </button>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/pricings/new?pricingId=${pricing.id}`)}
            >
              Voltar
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Deslogar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
