// src/components/ExportModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Snackbar,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CheckIcon from "@mui/icons-material/Check";
import { useApp } from "../context/AppContext";
import { generateWhatsAppSummary } from "../utils/whatsappFormatter";

export default function ExportModal({ open, onClose }) {
  const { lineup, activeBoatConfig, lineupName } = useApp();
  const [copied, setCopied] = useState(false);

  const formattedText = generateWhatsAppSummary(lineup, activeBoatConfig, lineupName);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(formattedText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "var(--bg-secondary)",
          color: "var(--text-primary)",
          borderRadius: "24px",
          border: "1px solid var(--border-glass)",
          boxShadow: "var(--shadow-glass)",
        },
      }}
    >
      <DialogTitle sx={{ p: 2.5, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WhatsAppIcon sx={{ color: "#25D366" }} />
          <Typography variant="h6" sx={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
            Exportar para o WhatsApp
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "var(--text-muted)" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Typography variant="body2" sx={{ color: "var(--text-secondary)", mb: 2 }}>
          Copie ou envie a lista formatada com a distribuição de assentos e métricas de equilíbrio para o grupo de treino:
        </Typography>

        <TextField
          multiline
          rows={12}
          fullWidth
          value={formattedText}
          readOnly
          sx={{
            "& .MuiInputBase-root": {
              fontFamily: "monospace",
              fontSize: "0.82rem",
              color: "var(--text-primary)",
              bgcolor: "rgba(0,0,0,0.3)",
              borderRadius: "14px",
              border: "1px solid var(--border-glass)",
            },
          }}
        />

        {copied && (
          <Alert severity="success" sx={{ mt: 1.5, borderRadius: "12px" }}>
            Texto copiado para a área de transferência!
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={handleCopy}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          sx={{
            borderRadius: "12px",
            borderColor: "var(--border-glass)",
            color: "var(--text-primary)",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {copied ? "Copiado!" : "Copiar Texto"}
        </Button>

        <Button
          variant="contained"
          onClick={handleShareWhatsApp}
          startIcon={<WhatsAppIcon />}
          sx={{
            borderRadius: "12px",
            bgcolor: "#25D366",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#1da851",
            },
          }}
        >
          Enviar no WhatsApp
        </Button>
      </DialogActions>
    </Dialog>
  );
}
