import  { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Box, Paper } from '@mui/material';
import { DrawingEngine } from '../utils/drawingEngine';
import type { DrawingCommand, DrawCommand } from '../types/models';

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  commands?: DrawingCommand[];
  drawCommands?: DrawCommand[];
  onCanvasReady?: (engine: DrawingEngine) => void;
}

export interface DrawingCanvasRef {
  clear: () => void;
  executeCommands: (commands: DrawingCommand[]) => void;
  executeDrawCommands: (commands: DrawCommand[]) => void;
  executeDrawCommandsWithAnimation: (commands: DrawCommand[], delayMs?: number) => Promise<void>;
  getDataURL: () => string;
  resize: (width: number, height: number) => void;
}

const DrawingCanvas = forwardRef<DrawingCanvasRef, DrawingCanvasProps>(
  ({ width = 800, height = 600, commands = [], drawCommands = [], onCanvasReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engineRef = useRef<DrawingEngine | null>(null);

    useEffect(() => {
      if (canvasRef.current) {
        engineRef.current = new DrawingEngine(canvasRef.current);
        onCanvasReady?.(engineRef.current);
      }
    }, [onCanvasReady]);

    useEffect(() => {
      if (engineRef.current && commands.length > 0) {
        engineRef.current.clearCanvas();
        engineRef.current.executeCommands(commands);
      }
    }, [commands]);

    useEffect(() => {
      if (engineRef.current && drawCommands.length > 0) {
        engineRef.current.clearCanvas();
        engineRef.current.executeDrawCommands(drawCommands);
      }
    }, [drawCommands]);

    useImperativeHandle(ref, () => ({
      clear: () => {
        engineRef.current?.clearCanvas();
      },
      executeCommands: (newCommands: DrawingCommand[]) => {
        engineRef.current?.executeCommands(newCommands);
      },
      executeDrawCommands: (newCommands: DrawCommand[]) => {
        engineRef.current?.executeDrawCommands(newCommands);
      },
      executeDrawCommandsWithAnimation: async (newCommands: DrawCommand[], delayMs?: number) => {
        if (engineRef.current) {
          engineRef.current.clearCanvas();
          await engineRef.current.executeDrawCommandsWithAnimation(newCommands, delayMs);
        }
      },
      getDataURL: () => {
        return engineRef.current?.getCanvasDataURL() || '';
      },
      resize: (newWidth: number, newHeight: number) => {
        engineRef.current?.resizeCanvas(newWidth, newHeight);
      },
    }));

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            backgroundColor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
              border: '2px solid #ccc',
              borderRadius: '4px',
              backgroundColor: 'white',
              cursor: 'crosshair',
            }}
          />
        </Paper>
      </Box>
    );
  }
);

DrawingCanvas.displayName = 'DrawingCanvas';

export default DrawingCanvas; 