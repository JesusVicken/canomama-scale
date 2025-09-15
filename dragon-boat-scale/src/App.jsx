
// src/App.jsx
import React, { useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DirectionsBoatIcon from "@mui/icons-material/DirectionsBoat";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const emptyRow = () => ({ name: "", weight: "" });
const initialSide = () => Array.from({ length: 10 }, emptyRow);

export default function App() {
  const [leftSide, setLeftSide] = useState(initialSide);
  const [rightSide, setRightSide] = useState(initialSide);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const updateRow = (side, index, field, value) => {
    const setter = side === "left" ? setLeftSide : setRightSide;
    const current = side === "left" ? leftSide : rightSide;
    const newSide = current.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    setter(newSide);
  };

  const getTotal = (side) =>
    side.reduce((acc, row) => {
      const w = parseFloat(row.weight);
      return acc + (isNaN(w) ? 0 : w);
    }, 0);

  const totalLeft = getTotal(leftSide);
  const totalRight = getTotal(rightSide);
  const total = totalLeft + totalRight;

  const maxCapacity = 2000; // kg
  const emptyBoatWeight = 250; // kg
  const safeLimit = maxCapacity - emptyBoatWeight;

  // --- Lógica de sugestão ---
  const findBestSuggestion = () => {
    const diff = totalLeft - totalRight;
    if (Math.abs(diff) < 1) return null;

    // Melhor troca
    let bestSwap = {
      postDiff: Math.abs(diff),
      leftIndex: -1,
      rightIndex: -1,
      leftPerson: null,
      rightPerson: null,
    };

    for (let i = 0; i < leftSide.length; i++) {
      const wl = parseFloat(leftSide[i].weight);
      if (isNaN(wl)) continue;
      for (let j = 0; j < rightSide.length; j++) {
        const wr = parseFloat(rightSide[j].weight);
        if (isNaN(wr)) continue;
        const newDiff = Math.abs(diff - 2 * (wl - wr));
        if (newDiff < bestSwap.postDiff) {
          bestSwap = {
            postDiff: newDiff,
            leftIndex: i,
            rightIndex: j,
            leftPerson: leftSide[i],
            rightPerson: rightSide[j],
          };
        }
      }
    }

    // Melhor movimento simples
    let bestMove = { postDiff: Math.abs(diff), side: null, index: -1, person: null };
    const heavierSideName = diff > 0 ? "left" : "right";
    const heavierArr = diff > 0 ? leftSide : rightSide;
    for (let i = 0; i < heavierArr.length; i++) {
      const w = parseFloat(heavierArr[i].weight);
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
  };

  const suggestion = findBestSuggestion();

  const applySuggestion = () => {
    const s = findBestSuggestion();
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

      const emptyIdx = to.findIndex((r) => !r.name && !r.weight);
      if (emptyIdx !== -1) {
        to[emptyIdx] = person;
      } else {
        let lightestIdx = 0;
        let lightestW = Infinity;
        to.forEach((r, idx) => {
          const w = parseFloat(r.weight);
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

  const chartData = [
    { side: "Esquerdo", peso: totalLeft },
    { side: "Direito", peso: totalRight },
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <DirectionsBoatIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Dragon Boat - Pesagem
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%", height: isMobile ? 120 : 180, overflow: "hidden", mb: 2 }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dragon_boat_budapest_2010.jpg/500px-Dragon_boat_budapest_2010.jpg"
          alt="Dragon Boat"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Container maxWidth="sm">
        <Grid container spacing={2}>
          {/* Lado esquerdo */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Lado Esquerdo
                </Typography>
                {leftSide.map((row, index) => (
                  <Box key={index} display="flex" gap={1} mb={1} alignItems="center">
                    <TextField
                      label="Nome"
                      size="small"
                      fullWidth
                      value={row.name}
                      onChange={(e) => updateRow("left", index, "name", e.target.value)}
                    />
                    <TextField
                      label="Peso"
                      size="small"
                      type="number"
                      sx={{ width: isMobile ? "80px" : "100px" }}
                      value={row.weight}
                      onChange={(e) => updateRow("left", index, "weight", e.target.value)}
                    />
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" align="center">
                  Total: {totalLeft} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Lado direito */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Lado Direito
                </Typography>
                {rightSide.map((row, index) => (
                  <Box key={index} display="flex" gap={1} mb={1} alignItems="center">
                    <TextField
                      label="Nome"
                      size="small"
                      fullWidth
                      value={row.name}
                      onChange={(e) => updateRow("right", index, "name", e.target.value)}
                    />
                    <TextField
                      label="Peso"
                      size="small"
                      type="number"
                      sx={{ width: isMobile ? "80px" : "100px" }}
                      value={row.weight}
                      onChange={(e) => updateRow("right", index, "weight", e.target.value)}
                    />
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" align="center">
                  Total: {totalRight} kg
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Painel resumo */}
        <Box sx={{ mt: 3, textAlign: "center", p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant={isMobile ? "subtitle1" : "h6"}>
            Peso Total: {total} kg / Limite: {safeLimit} kg
          </Typography>
          <Typography
            variant="subtitle1"
            color={total > safeLimit ? "error" : "primary"}
            sx={{ mt: 1 }}
          >
            {total > safeLimit ? "⚠️ Capacidade excedida!" : "✅ Dentro da capacidade segura"}
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Diferença entre lados: {Math.abs(totalLeft - totalRight)} kg
          </Typography>

          <Box sx={{ mt: 2 }}>
            {suggestion ? (
              <>
                {suggestion.type === "swap" ? (
                  <Typography variant="body2" sx={{ fontStyle: "italic" }} color="secondary">
                    🔁 Trocar <b>{suggestion.leftPerson.name || "remador"}</b> ({suggestion.leftPerson.weight} kg, esquerdo)
                    ↔ <b>{suggestion.rightPerson.name || "remador"}</b> ({suggestion.rightPerson.weight} kg, direito).
                    Diferença final: {suggestion.postDiff} kg
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ fontStyle: "italic" }} color="secondary">
                    🔄 Mover <b>{suggestion.person.name || "remador"}</b> ({suggestion.person.weight} kg) do lado{" "}
                    {suggestion.side === "left" ? "esquerdo" : "direito"} para o oposto. Diferença final: {suggestion.postDiff} kg
                  </Typography>
                )}

                <Button variant="outlined" sx={{ mt: 1 }} onClick={applySuggestion}>
                  Aplicar sugestão
                </Button>
              </>
            ) : (
              <Typography variant="body2" sx={{ fontStyle: "italic" }} color="secondary">
                ⚖️ Já está equilibrado ou faltam dados.
              </Typography>
            )}
          </Box>

          {/* Gráfico com scroll no mobile */}
          <Box sx={{ width: "100%", height: isMobile ? 200 : 250, mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="side" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="peso" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => {
              setLeftSide(initialSide());
              setRightSide(initialSide());
            }}
          >
            Resetar
          </Button>
        </Box>
      </Container>
    </>
  );
}
