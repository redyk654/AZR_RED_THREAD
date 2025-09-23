// src/components/pages/dashboard/ProjectCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Assignment,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { Project } from '@/types/project.types';
import { COLORS } from '@/utils/constants';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewTasks: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onViewTasks,
}) => {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'À venir': return COLORS.WARNING;
      case 'En cours': return COLORS.PRIMARY;
      case 'Terminé': return COLORS.SUCCESS;
      default: return COLORS.PRIMARY;
    }
  };

  const calculateProgress = () => {
    const total = project.durationInDays;
    const elapsed = Math.max(0, 
      Math.min(total, 
        Math.floor((new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24))
      )
    );
    return total > 0 ? Math.round((elapsed / total) * 100) : 0;
  };

  const progress = calculateProgress();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header avec actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: COLORS.PRIMARY,
              fontSize: '1.1rem',
              lineHeight: 1.3,
            }}
          >
            {project.name}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Voir les tâches">
              <IconButton
                size="small"
                onClick={() => onViewTasks(project)}
                sx={{
                  color: COLORS.PRIMARY,
                  '&:hover': { backgroundColor: `${COLORS.PRIMARY}10` },
                }}
              >
                <Assignment fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Modifier">
              <IconButton
                size="small"
                onClick={() => onEdit(project)}
                sx={{
                  color: COLORS.PRIMARY,
                  '&:hover': { backgroundColor: `${COLORS.PRIMARY}10` },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Supprimer">
              <IconButton
                size="small"
                onClick={() => onDelete(project)}
                sx={{
                  color: COLORS.ERROR,
                  '&:hover': { backgroundColor: `${COLORS.ERROR}10` },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Description */}
        {project.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.4,
            }}
          >
            {project.description}
          </Typography>
        )}

        {/* Status */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={project.status}
            size="small"
            sx={{
              backgroundColor: getStatusColor(project.status),
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progression
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              '& .MuiLinearProgress-bar': {
                backgroundColor: COLORS.PRIMARY,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Dates */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {new Date(project.startDate).toLocaleDateString('fr-FR')} - {new Date(project.endDate).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>

        {/* Durée */}
        <Typography variant="body2" color="text.secondary">
          Durée: {project.durationInDays} jours
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;