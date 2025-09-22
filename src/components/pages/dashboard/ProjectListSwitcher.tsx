// src/components/pages/dashboard/ProjectListSwitcher.tsx
import React from 'react';
import { ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';
import { COLORS } from '@/utils/constants';

interface ProjectListSwitcherProps {
  viewMode: 'card' | 'list';
  onChange: (mode: 'card' | 'list') => void;
}

const ProjectListSwitcher: React.FC<ProjectListSwitcherProps> = ({
  viewMode,
  onChange,
}) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: 'card' | 'list'
  ) => {
    if (newViewMode !== null) {
      onChange(newViewMode);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleChange}
        aria-label="view mode"
        sx={{
          '& .MuiToggleButton-root': {
            border: `1px solid ${COLORS.PRIMARY}`,
            borderRadius: '8px',
            color: COLORS.PRIMARY,
            '&.Mui-selected': {
              backgroundColor: COLORS.PRIMARY,
              color: '#fff',
              '&:hover': {
                backgroundColor: COLORS.PRIMARY_HOVER,
              },
            },
            '&:hover': {
              backgroundColor: `${COLORS.PRIMARY}10`,
            },
          },
        }}
      >
        <ToggleButton value="card" aria-label="card view">
          <GridView sx={{ mr: 1 }} />
          Cartes
        </ToggleButton>
        <ToggleButton value="list" aria-label="list view">
          <ViewList sx={{ mr: 1 }} />
          Liste
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ProjectListSwitcher;