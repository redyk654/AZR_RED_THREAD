// src/components/pages/dashboard/ProjectTableRow.tsx
import React from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Box,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Delete,
  Assignment,
} from '@mui/icons-material';
import { Project } from '@/types/project.types';
import { COLORS } from '@/utils/constants';

interface ProjectTableRowProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onViewTasks: (project: Project) => void;
}

const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
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

  return (
    <TableRow
      sx={{
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      {/* ID */}
      <TableCell>
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ color: COLORS.PRIMARY }}
        >
          #{project.id}
        </Typography>
      </TableCell>

      {/* Nom */}
      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {project.name}
        </Typography>
        {project.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '200px',
            }}
          >
            {project.description}
          </Typography>
        )}
      </TableCell>

      {/* Dates */}
      <TableCell>
        <Typography variant="body2">
          {new Date(project.startDate).toLocaleDateString('fr-FR')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Début
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="body2">
          {new Date(project.endDate).toLocaleDateString('fr-FR')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Fin
        </Typography>
      </TableCell>

      {/* Status */}
      <TableCell>
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
      </TableCell>

      {/* Progression */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100px' }}>
          <Box sx={{ width: '100%', mr: 1 }}>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: COLORS.PRIMARY,
                  borderRadius: 4,
                },
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ minWidth: 35 }}>
            {`${calculateProgress()}%`}
          </Typography>
        </Box>
      </TableCell>
      {/* Actions */}
      <TableCell>
        <Tooltip title="Voir les tâches">
          <IconButton onClick={() => onViewTasks(project)} color="primary">
            <Assignment />
          </IconButton>
        </Tooltip>
        <Tooltip title="Éditer">
          <IconButton onClick={() => onEdit(project)} color="primary">
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Supprimer">
          <IconButton onClick={() => onDelete(project)} color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ProjectTableRow;