import jsPDF from "jspdf";
import box from "../assets/box.png";

const sale = {};

export default function genegenerateReportPDF() {
  let report = new jsPDF();

  report.setFont("Times");

  writeHeader(report);
  writeSales(report);

  report.save("Relatório.pdf");
}

function writeHeader(document) {
  document.setFontSize(22);
  document.text("Relatório Mensal: 07/2021", 30, 25);
  document.setFontSize(12);
  document.text("Usuário: RV Suplementos Animais", 30, 35);
  document.text("Data de Geração: 05/07/2021", 30, 40);
  document.text("Hora: 15:30h", 30, 45);
  document.text(
    "---------------------------------------------------------------------------------------------------------------",
    30,
    55
  );
}

function writeSales(document) {
  let spacing = 40;
  document.addPage();
  document.setFontSize(18);
  document.text("Vendas", 30, 30);
  document.setFontSize(12);
  for (var i = 0; i < 200; i++) {
    document.text("vendasasdafsd", 30, spacing);
    spacing += 5;
    if (spacing > 270) {
      document.addPage();
      spacing = 30;
    }
  }
}
