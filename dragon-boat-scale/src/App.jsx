// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Divider,
  useMediaQuery,
  Stack,
  IconButton,
  Fab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Helper: cria uma linha com id único
const makeRow = (i) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${i}`, name: "", weight: "" });
const initialSide = () => Array.from({ length: 10 }, (_, i) => makeRow(i));

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  // estados (persistidos localmente)
  const [leftSide, setLeftSide] = useState(() => {
    try {
      const raw = localStorage.getItem("db_leftSide");
      return raw ? JSON.parse(raw) : initialSide();
    } catch (e) {
      return initialSide();
    }
  });
  const [rightSide, setRightSide] = useState(() => {
    try {
      const raw = localStorage.getItem("db_rightSide");
      return raw ? JSON.parse(raw) : initialSide();
    } catch (e) {
      return initialSide();
    }
  });

  // Persistência automática
  useEffect(() => {
    localStorage.setItem("db_leftSide", JSON.stringify(leftSide));
  }, [leftSide]);
  useEffect(() => {
    localStorage.setItem("db_rightSide", JSON.stringify(rightSide));
  }, [rightSide]);

  // Normaliza entrada: aceita vírgula como decimal
  const normalizeWeightInput = (val) => {
    if (val === null || val === undefined) return "";
    return String(val).replace(",", ".");
  };

  const updateRow = (side, index, field, value) => {
    const normalized = field === "weight" ? normalizeWeightInput(value) : value;
    const setter = side === "left" ? setLeftSide : setRightSide;
    const current = side === "left" ? leftSide : rightSide;
    const newSide = current.map((r, i) => (i === index ? { ...r, [field]: normalized } : r));
    setter(newSide);
  };

  const isEmptyRow = (r) => {
    return (!r.name || r.name.trim() === "") && (r.weight === "" || r.weight === null || r.weight === undefined);
  };

  const calcTotal = (sideArr) =>
    sideArr.reduce((acc, row) => {
      const w = parseFloat(String(row.weight).replace(",", "."));
      return acc + (isNaN(w) ? 0 : w);
    }, 0);

  const totalLeft = useMemo(() => calcTotal(leftSide), [leftSide]);
  const totalRight = useMemo(() => calcTotal(rightSide), [rightSide]);
  const total = useMemo(() => totalLeft + totalRight, [totalLeft, totalRight]);

  const maxCapacity = 2000; // kg
  const emptyBoatWeight = 250; // kg
  const safeLimit = maxCapacity - emptyBoatWeight;

  // --- Lógica de sugestão (memoizada) ---
  const suggestion = useMemo(() => {
    const diff = totalLeft - totalRight;
    if (Math.abs(diff) < 1) return null; // já equilibrado

    // Busca melhor swap (O(n^2))
    let bestSwap = { postDiff: Math.abs(diff), leftIndex: -1, rightIndex: -1, leftPerson: null, rightPerson: null };

    for (let i = 0; i < leftSide.length; i++) {
      const wl = parseFloat(String(leftSide[i].weight).replace(",", "."));
      if (isNaN(wl)) continue;
      for (let j = 0; j < rightSide.length; j++) {
        const wr = parseFloat(String(rightSide[j].weight).replace(",", "."));
        if (isNaN(wr)) continue;
        const newDiff = Math.abs(diff - 2 * (wl - wr));
        if (newDiff < bestSwap.postDiff) {
          bestSwap = { postDiff: newDiff, leftIndex: i, rightIndex: j, leftPerson: leftSide[i], rightPerson: rightSide[j] };
        }
      }
    }

    // Busca melhor move (O(n)) — mover do lado mais pesado para o outro
    let bestMove = { postDiff: Math.abs(diff), side: null, index: -1, person: null };
    const heavierSideName = diff > 0 ? "left" : "right";
    const heavierArr = diff > 0 ? leftSide : rightSide;
    for (let i = 0; i < heavierArr.length; i++) {
      const w = parseFloat(String(heavierArr[i].weight).replace(",", "."));
      if (isNaN(w)) continue;
      const newDiff = Math.abs(Math.abs(diff) - 2 * w);
      if (newDiff < bestMove.postDiff) {
        bestMove = { postDiff: newDiff, side: heavierSideName, index: i, person: heavierArr[i] };
      }
    }

    if (bestSwap.leftIndex !== -1 && bestSwap.postDiff <= bestMove.postDiff) {
      return { type: "swap", ...bestSwap };
    }
    if (bestMove.index !== -1) return { type: "move", ...bestMove };
    return null;
  }, [leftSide, rightSide, totalLeft, totalRight]);

  // Aplicar sugestão (mesma lógica para manter idempotência)
  const applySuggestion = () => {
    const s = suggestion;
    if (!s) return;

    if (s.type === "swap") {
      const newLeft = leftSide.slice();
      const newRight = rightSide.slice();
      const tmp = newLeft[s.leftIndex];
      newLeft[s.leftIndex] = newRight[s.rightIndex];
      newRight[s.rightIndex] = tmp;
      setLeftSide(newLeft);
      setRightSide(newRight);
    } else if (s.type === "move") {
      const fromLeft = s.side === "left";
      const from = fromLeft ? leftSide.slice() : rightSide.slice();
      const to = fromLeft ? rightSide.slice() : leftSide.slice();

      const person = { ...from[s.index] };
      from[s.index] = { name: "", weight: "" };

      const emptyIdx = to.findIndex((r) => isEmptyRow(r));
      if (emptyIdx !== -1) {
        to[emptyIdx] = person;
      } else {
        // substitui o mais leve
        let lightestIdx = 0;
        let lightestW = Infinity;
        to.forEach((r, idx) => {
          const w = parseFloat(String(r.weight).replace(",", "."));
          const ww = isNaN(w) ? 0 : w;
          if (ww < lightestW) {
            lightestW = ww;
            lightestIdx = idx;
          }
        });
        const tmp = to[lightestIdx];
        to[lightestIdx] = person;
        from[s.index] = tmp;
      }

      if (fromLeft) {
        setLeftSide(from);
        setRightSide(to);
      } else {
        setRightSide(from);
        setLeftSide(to);
      }
    }
  };

  const chartData = useMemo(() => [{ side: "Esquerdo", peso: totalLeft }, { side: "Direito", peso: totalRight }], [totalLeft, totalRight]);

  const resetAll = () => {
    setLeftSide(initialSide());
    setRightSide(initialSide());
  };

  const fmt = (n) => Number.isFinite(n) ? n.toLocaleString("pt-BR", { maximumFractionDigits: 1 }) : "0";

  return (
    <Box sx={{ pb: { xs: 12, sm: 4 } }}>
      <AppBar position="sticky" color="primary" sx={{ backdropFilter: "blur(6px)" }}>
        <Toolbar sx={{ gap: 1 }}>
          <DirectionsBoatIcon />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">Dragon Boat • Pesagem</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Total {fmt(total)} kg • Limite {fmt(safeLimit)} kg • {total > safeLimit ? "⚠️ Excedido" : "✅ Seguro"}
            </Typography>
          </Box>
          <IconButton color="inherit" aria-label="reset" onClick={resetAll} title="Resetar campos">
            <RestartAltIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%", height: isMobile ? 120 : 220, overflow: "hidden" }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dragon_boat_budapest_2010.jpg/500px-Dragon_boat_budapest_2010.jpg"
          alt="Dragon Boat"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Inputs - responsivo: mobile = accordions (coluna única), desktop = duas colunas */}
          {isMobile ? (
            <>
              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1">Lado Esquerdo</Typography>
                      <Chip label={`Total: ${fmt(totalLeft)} kg`} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {leftSide.map((row, index) => (
                        <Box key={row.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <TextField
                            label={`${index + 1}. Nome`}
                            size="small"
                            value={row.name}
                            onChange={(e) => updateRow("left", index, "name", e.target.value)}
                            fullWidth
                          />
                          <TextField
                            label="Peso"
                            size="small"
                            type="tel"
                            inputProps={{ inputMode: "decimal", step: "0.1", min: 0 }}
                            sx={{ width: 100 }}
                            value={row.weight}
                            onChange={(e) => updateRow("left", index, "weight", e.target.value)}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>

              <Grid item xs={12}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1">Lado Direito</Typography>
                      <Chip label={`Total: ${fmt(totalRight)} kg`} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {rightSide.map((row, index) => (
                        <Box key={row.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <TextField
                            label={`${index + 1}. Nome`}
                            size="small"
                            value={row.name}
                            onChange={(e) => updateRow("right", index, "name", e.target.value)}
                            fullWidth
                          />
                          <TextField
                            label="Peso"
                            size="small"
                            type="tel"
                            inputProps={{ inputMode: "decimal", step: "0.1", min: 0 }}
                            sx={{ width: 100 }}
                            value={row.weight}
                            onChange={(e) => updateRow("right", index, "weight", e.target.value)}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </>
          ) : (
            // Desktop / Tablet view: two columns side-by-side
            <>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="h6">Lado Esquerdo</Typography>
                      <Chip label={`Total ${fmt(totalLeft)} kg`} size="small" />
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Stack spacing={1}>
                      {leftSide.map((row, index) => (
                        <Box key={row.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <TextField
                            label={`${index + 1}. Nome`}
                            size="small"
                            value={row.name}
                            onChange={(e) => updateRow("left", index, "name", e.target.value)}
                            fullWidth
                          />
                          <TextField
                            label="Peso"
                            size="small"
                            type="tel"
                            inputProps={{ inputMode: "decimal", step: "0.1", min: 0 }}
                            sx={{ width: 110 }}
                            value={row.weight}
                            onChange={(e) => updateRow("left", index, "weight", e.target.value)}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="h6">Lado Direito</Typography>
                      <Chip label={`Total ${fmt(totalRight)} kg`} size="small" />
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Stack spacing={1}>
                      {rightSide.map((row, index) => (
                        <Box key={row.id} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <TextField
                            label={`${index + 1}. Nome`}
                            size="small"
                            value={row.name}
                            onChange={(e) => updateRow("right", index, "name", e.target.value)}
                            fullWidth
                          />
                          <TextField
                            label="Peso"
                            size="small"
                            type="tel"
                            inputProps={{ inputMode: "decimal", step: "0.1", min: 0 }}
                            sx={{ width: 110 }}
                            value={row.weight}
                            onChange={(e) => updateRow("right", index, "weight", e.target.value)}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </>
          )}

          {/* Painel resumo: sempre full-width */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 600 }}>
                      Peso Total: {fmt(total)} kg • Limite: {fmt(safeLimit)} kg
                    </Typography>
                    <Typography variant="body2" color={total > safeLimit ? "error" : "text.secondary"} sx={{ mt: 0.5 }}>
                      {total > safeLimit ? "⚠️ Capacidade excedida!" : "✅ Dentro da capacidade segura"}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Diferença entre lados: <b>{fmt(Math.abs(totalLeft - totalRight))} kg</b>
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                      {suggestion ? (
                        <Typography variant="body2" sx={{ fontStyle: "italic" }} color="text.secondary">
                          {suggestion.type === "swap" ? (
                            <>
                              🔁 Trocar <b>{suggestion.leftPerson.name || "remador"}</b> ({suggestion.leftPerson.weight || "-"} kg, esquerdo) ↔{' '}
                              <b>{suggestion.rightPerson.name || "remador"}</b> ({suggestion.rightPerson.weight || "-"} kg, direito). Diferença final: {fmt(suggestion.postDiff)} kg
                            </>
                          ) : (
                            <>
                              🔄 Mover <b>{suggestion.person.name || "remador"}</b> ({suggestion.person.weight || "-"} kg) do lado{' '}
                              {suggestion.side === "left" ? "esquerdo" : "direito"} para o oposto. Diferença final: {fmt(suggestion.postDiff)} kg
                            </>
                          )}
                        </Typography>
                      ) : (
                        <Typography variant="body2" sx={{ fontStyle: "italic" }} color="text.secondary">
                          ⚖️ Já está equilibrado ou faltam dados.
                        </Typography>
                      )}
                    </Box>

                    <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                      <Button variant="contained" startIcon={<SwapHorizIcon />} disabled={!suggestion} onClick={applySuggestion}>
                        Aplicar sugestão
                      </Button>
                      <Button variant="outlined" onClick={resetAll} startIcon={<RestartAltIcon />}>
                        Resetar
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ width: "100%", height: isMobile ? 180 : 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="side" type="category" />
                          <Tooltip formatter={(v) => `${fmt(v)} kg`} />
                          <Bar dataKey="peso" fill={theme.palette.primary.main} barSize={20} radius={[6, 6, 6, 6]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Mobile sticky summary + action */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            zIndex: (t) => t.zIndex.appBar + 5,
            left: 12,
            right: 12,
            bottom: 12,
            bgcolor: "background.paper",
            boxShadow: 6,
            borderRadius: 3,
            p: 1,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Box>
              <Typography variant="subtitle2">Total: {fmt(total)} kg</Typography>
              <Typography variant="caption" color={total > safeLimit ? "error" : "text.secondary"}>
                {total > safeLimit ? "⚠️ Excedeu" : "✅ Seguro"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small" onClick={applySuggestion} disabled={!suggestion}>
                Aplicar
              </Button>
              <Fab size="small" color="primary" onClick={resetAll} aria-label="reset">
                <RestartAltIcon />
              </Fab>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
