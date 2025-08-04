import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Undo as UndoIcon,
  Redo as RedoIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
  FolderOpen as LoadIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  CloudDownload as ExportIcon,
} from '@mui/icons-material';

interface DrawingControlsProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
  onDownload: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isLoading?: boolean;
}

const DrawingControls: React.FC<DrawingControlsProps> = ({
  onUndo,
  onRedo,
  onClear,
  onSave,
  onLoad,
  onDownload,
  canUndo = false,
  canRedo = false,
  isLoading = false,
}) => {
  return (
    <Box sx={{ width: '100%' }}>
      {/* History Controls */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <HistoryIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            History
          </Typography>
          <Chip 
            label={canUndo || canRedo ? 'Available' : 'Empty'} 
            size="small" 
            sx={{ 
              ml: 'auto', 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '0.7rem'
            }} 
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Undo last action">
            <span>
              <Button
                variant="contained"
                size="small"
                onClick={onUndo}
                disabled={!canUndo || isLoading}
                startIcon={<UndoIcon />}
                sx={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  },
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Undo
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Redo last action">
            <span>
              <Button
                variant="contained"
                size="small"
                onClick={onRedo}
                disabled={!canRedo || isLoading}
                startIcon={<RedoIcon />}
                sx={{
                  flex: 1,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255,255,255,0.05)',
                  },
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Redo
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      {/* Action Controls */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <EditIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Actions
          </Typography>
        </Box>
        <Tooltip title="Clear entire canvas">
          <Button
            variant="contained"
            size="small"
            onClick={onClear}
            disabled={isLoading}
            startIcon={<ClearIcon />}
            fullWidth
            sx={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.25)',
              },
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Clear Canvas
          </Button>
        </Tooltip>
      </Paper>

      {/* File Operations */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          mb: 2, 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <SaveIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            File Operations
          </Typography>
        </Box>
        <Grid container spacing={1}>
          <Grid size={6}>
            <Tooltip title="Save drawing">
              <Button
                variant="contained"
                size="small"
                onClick={onSave}
                disabled={isLoading}
                startIcon={<SaveIcon />}
                fullWidth
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              >
                Save
              </Button>
            </Tooltip>
          </Grid>
          <Grid size={6}>
            <Tooltip title="Load drawing">
              <Button
                variant="contained"
                size="small"
                onClick={onLoad}
                disabled={isLoading}
                startIcon={<LoadIcon />}
                fullWidth
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                  },
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              >
                Load
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Export */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 2, 
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          color: '#333',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <ExportIcon sx={{ mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Export
          </Typography>
          <Chip 
            label="PNG" 
            size="small" 
            sx={{ 
              ml: 'auto', 
              backgroundColor: 'rgba(0,0,0,0.1)',
              fontSize: '0.7rem'
            }} 
          />
        </Box>
        <Tooltip title="Download drawing as PNG image">
          <Button
            variant="contained"
            size="small"
            onClick={onDownload}
            disabled={isLoading}
            startIcon={<DownloadIcon />}
            fullWidth
            sx={{
              backgroundColor: 'rgba(0,0,0,0.1)',
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.2)',
              },
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Download Image
          </Button>
        </Tooltip>
      </Paper>
    </Box>
  );
};

export default DrawingControls;