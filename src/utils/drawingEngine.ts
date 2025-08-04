import type { DrawingCommand, DrawCommand } from '../types/models';

export class DrawingEngine {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupCanvas();
  }

  private setupCanvas() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.font = '16px Arial';
  }

  executeCommand(command: DrawingCommand) {
    try {
      const params = JSON.parse(command.parameters);
      
      switch (command.commandType.toUpperCase()) {
        case 'LINE':
          this.drawLine(params);
          break;
        case 'CIRCLE':
          this.drawCircle(params);
          break;
        case 'RECTANGLE':
          this.drawRectangle(params);
          break;
        case 'TRIANGLE':
          this.drawTriangle(params);
          break;
        case 'TEXT':
          this.drawText(params);
          break;
        case 'CLEAR':
          this.clearCanvas();
          break;
      }
    } catch (error) {
      console.error('Error executing command:', error);
    }
  }

  executeDrawCommand(command: DrawCommand) {
    switch (command.type) {
      case 'line':
        this.drawSimpleLine(command);
        break;
      case 'circle':
        this.drawSimpleCircle(command);
        break;
      case 'rect':
        this.drawSimpleRectangle(command);
        break;
      case 'triangle':
        this.drawSimpleTriangle(command);
        break;
      case 'text':
        this.drawSimpleText(command);
        break;
      case 'clear':
        this.clearCanvas();
        break;
    }
  }

  executeCommands(commands: DrawingCommand[]) {
    const sortedCommands = [...commands].sort((a, b) => a.order - b.order);
    
    for (const command of sortedCommands) {
      this.executeCommand(command);
    }
  }

  executeDrawCommands(commands: DrawCommand[]) {
    for (const command of commands) {
      this.executeDrawCommand(command);
    }
  }

  async executeDrawCommandsWithAnimation(commands: DrawCommand[], delayMs: number = 200) {
    for (let i = 0; i < commands.length; i++) {
      this.executeDrawCommand(commands[i]);
      if (i < commands.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  private drawSimpleLine(command: DrawCommand) {
    if (command.x1 !== undefined && command.y1 !== undefined && 
        command.x2 !== undefined && command.y2 !== undefined) {
      this.ctx.strokeStyle = command.color || 'black';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(command.x1, command.y1);
      this.ctx.lineTo(command.x2, command.y2);
      this.ctx.stroke();
    }
  }

  private drawSimpleCircle(command: DrawCommand) {
    if (command.x !== undefined && command.y !== undefined && command.radius !== undefined) {
      this.ctx.beginPath();
      this.ctx.arc(command.x, command.y, command.radius, 0, 2 * Math.PI);
      
      if (command.color) {
        this.ctx.fillStyle = command.color;
        this.ctx.fill();
      }
    }
  }

  private drawSimpleRectangle(command: DrawCommand) {
    if (command.x !== undefined && command.y !== undefined && 
        command.width !== undefined && command.height !== undefined) {
      if (command.color) {
        this.ctx.fillStyle = command.color;
        this.ctx.fillRect(command.x, command.y, command.width, command.height);
      }
    }
  }

  private drawSimpleTriangle(command: DrawCommand) {
    if (command.x1 !== undefined && command.y1 !== undefined && 
        command.x2 !== undefined && command.y2 !== undefined && 
        command.x3 !== undefined && command.y3 !== undefined) {
      this.ctx.beginPath();
      this.ctx.moveTo(command.x1, command.y1);
      this.ctx.lineTo(command.x2, command.y2);
      this.ctx.lineTo(command.x3, command.y3);
      this.ctx.closePath();
      
      if (command.color) {
        this.ctx.fillStyle = command.color;
        this.ctx.fill();
      }
    }
  }

  private drawSimpleText(command: DrawCommand) {
    if (command.x !== undefined && command.y !== undefined && command.text) {
      this.ctx.font = `${command.fontSize || 16}px ${command.fontFamily || 'Arial'}`;
      this.ctx.fillStyle = command.color || 'black';
      this.ctx.fillText(command.text, command.x, command.y);
    }
  }

  private drawLine(params: any) {
    const { x1, y1, x2, y2, color = 'black', width = 2 } = params;
    
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  private drawCircle(params: any) {
    const { x, y, radius, fillColor, strokeColor = 'black', strokeWidth = 2 } = params;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = strokeWidth;
      this.ctx.stroke();
    }
  }

  private drawRectangle(params: any) {
    const { x, y, width, height, fillColor, strokeColor = 'black', strokeWidth = 2 } = params;
    
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fillRect(x, y, width, height);
    }
    
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = strokeWidth;
      this.ctx.strokeRect(x, y, width, height);
    }
  }

  private drawTriangle(params: any) {
    const { x1, y1, x2, y2, x3, y3, fillColor, strokeColor = 'black', strokeWidth = 2 } = params;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    
    if (fillColor) {
      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
    }
    
    if (strokeColor) {
      this.ctx.strokeStyle = strokeColor;
      this.ctx.lineWidth = strokeWidth;
      this.ctx.stroke();
    }
  }

  private drawText(params: any) {
    const { x, y, text, fontSize = 16, fontFamily = 'Arial', color = 'black' } = params;
    
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.setupCanvas();
  }

  getCanvasDataURL(): string {
    return this.canvas.toDataURL();
  }

  resizeCanvas(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.setupCanvas();
  }
}