"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Fade,
} from "@mui/material";
import {
  Description,
  CalendarToday,
  Event,
  Title as TitleIcon,
} from "@mui/icons-material";
import { CreateProjectDto } from "@/types/project.types";

interface CreateProjectFormProps {
  onSubmit: (data: CreateProjectDto) => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export default function CreateProjectForm({ onSubmit }: CreateProjectFormProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    createdBy: 1, // À remplir côté serveur si besoin
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Le nom du projet est requis";
    if (!form.description.trim()) newErrors.description = "La description est requise";
    if (!form.startDate) newErrors.startDate = "La date de début est requise";
    if (!form.endDate) newErrors.endDate = "La date de fin est requise";

    if (form.startDate && form.endDate && form.startDate > form.endDate) {
      newErrors.endDate = "La date de fin doit être après la date de début";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="name"
            label="Nom du projet"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            // InputProps={{
            //   startAdornment: <TitleIcon sx={{ color: "#1b365f", mr: 1 }} />,
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            multiline
            rows={3}
            // InputProps={{
            //   startAdornment: <Description sx={{ color: "#1b365f", mr: 1 }} />,
            // }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="startDate"
            type="date"
            label="Date de début"
            value={form.startDate}
            onChange={handleChange}
            error={!!errors.startDate}
            helperText={errors.startDate}
            InputProps={{
              startAdornment: (
                <CalendarToday sx={{ color: "#1b365f", mr: 1 }} />
              ),
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            name="endDate"
            type="date"
            label="Date de fin"
            value={form.endDate}
            onChange={handleChange}
            error={!!errors.endDate}
            helperText={errors.endDate}
            InputProps={{
              startAdornment: <Event sx={{ color: "#1b365f", mr: 1 }} />,
            }}
          />
        </Grid>

        {Object.keys(errors).length > 0 && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <Fade in>
              <Alert severity="error" sx={{ fontSize: "0.9rem" }}>
                Veuillez corriger les erreurs avant de soumettre le formulaire.
              </Alert>
            </Fade>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 2,
              bgcolor: "#1b365f",
              color: "#fff",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#152a4d",
              },
            }}
          >
            Créer le Projet
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
