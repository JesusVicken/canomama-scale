// src/App.jsx
import { useState } from "react";
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
  Paper,
} from "@mui/material";
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

export default function App() {
  const [leftSide, setLeftSide] = useState(
    Array(10).fill({ name: "", weight: "" })
  );
  const [rightSide, setRightSide] = useState(
    Array(10).fill({ name: "", weight: "" })
  );

  const updateRow = (side, index, field, value) => {
    const newSide = [...(side === "left" ? leftSide : rightSide)];
    newSide[index] = { ...newSide[index], [field]: value };
    side === "left" ? setLeftSide(newSide) : setRightSide(newSide);
  };

  const getTotal = (side) =>
    side.reduce((acc, row) => acc + (parseFloat(row.weight) || 0), 0);

  const totalLeft = getTotal(leftSide);
  const totalRight = getTotal(rightSide);
  const total = totalLeft + totalRight;

  const maxCapacity = 2000; // kg
  const emptyBoatWeight = 250; // kg
  const safeLimit = maxCapacity - emptyBoatWeight;

  // Função para sugerir troca
  const suggestSwap = () => {
    const diff = totalLeft - totalRight;
    if (Math.abs(diff) < 5) return "⚖️ Os lados já estão equilibrados.";

    const heavierSide = diff > 0 ? leftSide : rightSide;
    const lighterSide = diff > 0 ? rightSide : leftSide;
    const heavierLabel = diff > 0 ? "esquerdo" : "direito";
    const lighterLabel = diff > 0 ? "direito" : "esquerdo";

    let bestOption = null;
    let minDiff = Math.abs(diff);

    // Tenta mover uma pessoa
    heavierSide.forEach((row) => {
      const w = parseFloat(row.weight);
      if (!w) return;
      const newDiff = Math.abs(diff - 2 * w);
      if (newDiff < minDiff) {
        minDiff = newDiff;
        bestOption = [row];
      }
    });

    // Tenta mover pares de pessoas se uma não equilibrar
    for (let i = 0; i < heavierSide.length; i++) {
      for (let j = i + 1; j < heavierSide.length; j++) {
        const w1 = parseFloat(heavierSide[i].weight) || 0;
        const w2 = parseFloat(heavierSide[j].weight) || 0;
        const newDiff = Math.abs(diff - 2 * (w1 + w2));
        if (newDiff < minDiff) {
          minDiff = newDiff;
          bestOption = [heavierSide[i], heavierSide[j]];
        }
      }
    }

    if (!bestOption) return "ℹ️ Não foi possível sugerir uma troca.";

    const names = bestOption.map((r) => r.name || "remador").join(" e ");
    const weights = bestOption.map((r) => r.weight).join(" kg e ") + " kg";

    return `🔄 Sugestão: mover ${names} (${weights}) do lado ${heavierLabel} → lado ${lighterLabel}. Diferença restante: ${minDiff} kg`;
  };

  // Dados para gráfico
  const chartData = [
    { side: "Esquerdo", peso: totalLeft },
    { side: "Direito", peso: totalRight },
  ];

  return (
    <>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <DirectionsBoatIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Dragon Boat - Pesagem
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Imagem topo */}
      <Box
        sx={{
          width: "100%",
          height: 180,
          overflow: "hidden",
          mb: 2,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dragon_boat_budapest_2010.jpg/500px-Dragon_boat_budapest_2010.jpg"
          alt="Dragon Boat"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Conteúdo principal */}
      <Container maxWidth="sm">
        <Grid container spacing={2}>
          {/* Lado Esquerdo */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Lado Esquerdo
                </Typography>
                {leftSide.map((row, index) => (
                  <Box
                    key={index}
                    display="flex"
                    gap={1}
                    mb={1}
                    alignItems="center"
                  >
                    <TextField
                      label="Nome"
                      size="small"
                      fullWidth
                      value={row.name}
                      onChange={(e) =>
                        updateRow("left", index, "name", e.target.value)
                      }
                    />
                    <TextField
                      label="Peso"
                      size="small"
                      type="number"
                      sx={{ width: "100px" }}
                      value={row.weight}
                      onChange={(e) =>
                        updateRow("left", index, "weight", e.target.value)
                      }
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

          {/* Lado Direito */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center" gutterBottom>
                  Lado Direito
                </Typography>
                {rightSide.map((row, index) => (
                  <Box
                    key={index}
                    display="flex"
                    gap={1}
                    mb={1}
                    alignItems="center"
                  >
                    <TextField
                      label="Nome"
                      size="small"
                      fullWidth
                      value={row.name}
                      onChange={(e) =>
                        updateRow("right", index, "name", e.target.value)
                      }
                    />
                    <TextField
                      label="Peso"
                      size="small"
                      type="number"
                      sx={{ width: "100px" }}
                      value={row.weight}
                      onChange={(e) =>
                        updateRow("right", index, "weight", e.target.value)
                      }
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

        {/* Resultado */}
        <Paper
          elevation={3}
          sx={{
            mt: 3,
            textAlign: "center",
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6">
            Peso Total: {total} kg / Limite: {safeLimit} kg
          </Typography>
          <Typography
            variant="subtitle1"
            color={total > safeLimit ? "error" : "primary"}
            sx={{ mt: 1 }}
          >
            {total > safeLimit
              ? "⚠️ Capacidade excedida!"
              : "✅ Dentro da capacidade segura"}
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            Diferença entre lados: {Math.abs(totalLeft - totalRight)} kg
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{ mt: 2, fontStyle: "italic" }}
            color="secondary"
          >
            {suggestSwap()}
          </Typography>

          {/* Gráfico */}
          <Box sx={{ width: "100%", height: 250, mt: 3 }}>
            <ResponsiveContainer>
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
              setLeftSide(Array(10).fill({ name: "", weight: "" }));
              setRightSide(Array(10).fill({ name: "", weight: "" }));
            }}
          >
            Resetar
          </Button>
        </Paper>
      </Container>
    </>
  );
}
