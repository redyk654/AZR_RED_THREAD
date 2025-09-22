import { useState } from "react";
import { 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  InputAdornment,
  Alert,
  Fade
} from "@mui/material";
import { 
  Description, 
  CalendarToday, 
  Event,
  Title as TitleIcon 
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
    endDate: "" 
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Effacer l'erreur du champ modifié
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

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      '&:hover fieldset': {
        borderColor: '#1b365f',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1b365f',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#1b365f',
    },
  };

  return (
    <Card 
      elevation={3} 
      sx={{ 
        maxWidth: 600, 
        margin: 'auto', 
        borderRadius: 3,
        background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: '#1b365f', 
            fontWeight: 600,
            mb: 3,
            textAlign: 'center'
          }}
        >
          Nouveau Projet
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Nom du projet"
                value={form.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon sx={{ color: '#1b365f' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
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
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Description sx={{ color: '#1b365f' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="startDate"
                type="date"
                label="Date de début"
                InputLabelProps={{ shrink: true }}
                value={form.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday sx={{ color: '#1b365f' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="endDate"
                type="date"
                label="Date de fin"
                InputLabelProps={{ shrink: true }}
                value={form.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                sx={inputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Event sx={{ color: '#1b365f' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {Object.keys(errors).length > 0 && (
              <Grid item xs={12}>
                <Fade in>
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    Veuillez corriger les erreurs avant de soumettre le formulaire.
                  </Alert>
                </Fade>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button 
                type="submit" 
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 2, 
                  py: 1.5,
                  borderRadius: 2,
                  bgcolor: '#1b365f',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(27, 54, 95, 0.3)',
                  '&:hover': {
                    bgcolor: '#152a4d',
                    boxShadow: '0 6px 16px rgba(27, 54, 95, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Créer le Projet
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}