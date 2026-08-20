// src/utils/whatsappFormatter.js
import { calculateBoatMetrics, formatNumber } from "./balanceAlgorithm";

export const generateWhatsAppSummary = (lineup, boatConfig, lineupName = "Escalação de Treino") => {
  const metrics = calculateBoatMetrics(lineup, boatConfig);
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  let text = `🐉 *${boatConfig.name.toUpperCase()} - canoMAMA Scale*\n`;
  text += `📋 *${lineupName}*\n`;
  text += `📅 ${dateStr} às ${timeStr}\n\n`;

  text += `🐲 *ESCALAÇÃO DE REMADORES*\n`;
  text += `-----------------------------------\n`;

  if (boatConfig.hasDrummer) {
    const drumName = lineup.drummer?.name || "Vago";
    const drumW = lineup.drummer?.weight ? `[${lineup.drummer.weight}kg]` : "";
    text += `🥁 *Tambor (Proa):* ${drumName} ${drumW}\n\n`;
  }

  const maxRows = boatConfig.rows;
  for (let i = 0; i < maxRows; i++) {
    const leftRow = lineup.leftSide[i];
    const rightRow = lineup.rightSide[i];
    const lName = leftRow?.name ? leftRow.name.trim() : "Vago";
    const lW = leftRow?.weight ? `[${leftRow.weight}k]` : "";
    const rName = rightRow?.name ? rightRow.name.trim() : "Vago";
    const rW = rightRow?.weight ? `[${rightRow.weight}k]` : "";

    text += `*Banco ${i + 1}* | 👈 ${lName} ${lW} | 👉 ${rName} ${rW}\n`;
  }

  if (boatConfig.hasSteersperson) {
    const steersName = lineup.steersperson?.name || "Vago";
    const steersW = lineup.steersperson?.weight ? `[${lineup.steersperson.weight}kg]` : "";
    text += `\n🛶 *Leme (Popa):* ${steersName} ${steersW}\n`;
  }

  text += `\n-----------------------------------\n`;
  text += `⚖️ *RESUMO DE CARGA & EQUILÍBRIO*\n`;
  text += `• Esquerda: *${formatNumber(metrics.totalLeft)} kg*\n`;
  text += `• Direita: *${formatNumber(metrics.totalRight)} kg*\n`;
  text += `• Diferença Lateral: *${formatNumber(Math.abs(metrics.diffLateral))} kg* (${metrics.diffLateral > 0 ? "Mais pesado na Esquerda 👈" : metrics.diffLateral < 0 ? "Mais pesado na Direita 👉" : "Equilíbrio Perfeito ⚖️"})\n`;
  text += `• Peso Total Tripulação: *${formatNumber(metrics.grandTotal)} kg*\n`;
  text += `• Total c/ Barco: *${formatNumber(metrics.totalWithBoat)} kg* / Limite Max: *${formatNumber(boatConfig.maxCapacity)} kg*\n`;

  if (metrics.isExceeded) {
    text += `⚠️ *ATENÇÃO: Capacidade Máxima do Barco Excedida!*\n`;
  } else {
    text += `✅ *Barco Seguro dentro dos limites (${metrics.safetyPercent}%)*\n`;
  }

  text += `\n📱 *Gerado via canoMAMA Scale App*`;

  return text;
};
