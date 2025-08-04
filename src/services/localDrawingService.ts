import type { DrawCommand } from '../types/models';

export class LocalDrawingService {
  private static readonly DRAWINGS_KEY = 'localDrawings';

  static generateDrawingFromPrompt(prompt: string): DrawCommand[] {
    const lowerPrompt = prompt.toLowerCase();
    const commands: DrawCommand[] = [];

    if (lowerPrompt.includes('house')) {
      commands.push(
        { type: 'circle', x: 250, y: 100, radius: 30, color: '#FFCC00' },
        { type: 'rect', x: 230, y: 130, width: 40, height: 80, color: '#FF6347' },
        { type: 'rect', x: 210, y: 130, width: 10, height: 50, color: '#FF6347' },
        { type: 'rect', x: 270, y: 130, width: 10, height: 50, color: '#FF6347' },
        { type: 'rect', x: 230, y: 210, width: 10, height: 40, color: '#4682B4' },
        { type: 'rect', x: 260, y: 210, width: 10, height: 40, color: '#4682B4' },
        { type: 'line', x1: 250, y1: 130, x2: 250, y2: 180, color: '#000000', width: 2 },
        { type: 'circle', x: 250, y: 80, radius: 10, color: '#FF0000' },
        { type: 'rect', x: 350, y: 150, width: 100, height: 100, color: '#8B4513' },
        { type: 'rect', x: 370, y: 180, width: 20, height: 20, color: '#FFFFFF' },
        { type: 'rect', x: 410, y: 180, width: 20, height: 20, color: '#FFFFFF' },
        { type: 'rect', x: 385, y: 210, width: 30, height: 40, color: '#0000FF' },
        { type: 'triangle', x1: 350, y1: 150, x2: 400, y2: 100, x3: 450, y3: 150, color: '#A52A2A' },
        { type: 'rect', x: 370, y: 210, width: 20, height: 40, color: '#8B4513' },
        { type: 'rect', x: 410, y: 210, width: 20, height: 40, color: '#8B4513' },
      );
    }
    else if (lowerPrompt.includes('sun')) {
      commands.push(
        { type: 'circle', x: 100, y: 100, radius: 40, color: '#FFD700' }
      );
    }
    else if (lowerPrompt.includes('tree')) {
      commands.push(
        { type: 'rect', x: 300, y: 250, width: 20, height: 80, color: '#8B4513' },
        { type: 'circle', x: 310, y: 240, radius: 50, color: '#228B22' }
      );
    }
    else if (lowerPrompt.includes('boat')) {
      commands.push(
        { type: 'rect', x: 200, y: 300, width: 120, height: 30, color: '#8B4513' },
        { type: 'triangle', x1: 260, y1: 300, x2: 320, y2: 300, x3: 290, y3: 220, color: '#FFFFFF' },
        { type: 'rect', x: 315, y: 220, width: 5, height: 20, color: '#000000' },
        { type: 'rect', x: 320, y: 220, width: 15, height: 10, color: '#FF0000' }
      );
    }
    else if (lowerPrompt.includes('flower')) {
      commands.push(
        { type: 'line', x1: 250, y1: 350, x2: 250, y2: 280, color: '#228B22' },
        { type: 'circle', x: 230, y: 320, radius: 15, color: '#228B22' },
        { type: 'circle', x: 270, y: 320, radius: 15, color: '#228B22' },
        { type: 'circle', x: 250, y: 280, radius: 25, color: '#FF69B4' },
        { type: 'circle', x: 250, y: 280, radius: 15, color: '#FFFF00' }
      );
    }
    else if (lowerPrompt.includes('heart')) {
      for (let i = 0; i < 36; i++) {
        const angle = (i * 10 * Math.PI) / 180;
        const nextAngle = ((i + 1) * 10 * Math.PI) / 180;

        const x1 = 250 + 30 * Math.cos(angle) * (1 - Math.sin(angle));
        const y1 = 250 + 30 * Math.sin(angle) * (1 - Math.sin(angle));
        const x2 = 250 + 30 * Math.cos(nextAngle) * (1 - Math.sin(nextAngle));
        const y2 = 250 + 30 * Math.sin(nextAngle) * (1 - Math.sin(nextAngle));

        commands.push({
          type: 'line',
          x1: Math.round(x1),
          y1: Math.round(y1),
          x2: Math.round(x2),
          y2: Math.round(y2),
          color: '#FF0000'
        });
      }
    }
    else if (lowerPrompt.includes('star')) {
      const centerX = 250;
      const centerY = 250;
      const outerRadius = 40;
      const innerRadius = 20;
      const points = 5;

      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) {
          commands.push({
            type: 'line',
            x1: centerX + outerRadius,
            y1: centerY,
            x2: Math.round(x),
            y2: Math.round(y),
            color: '#FFD700'
          });
        } else {
          const prevAngle = ((i - 1) * Math.PI) / points;
          const prevRadius = (i - 1) % 2 === 0 ? outerRadius : innerRadius;
          const prevX = centerX + prevRadius * Math.cos(prevAngle);
          const prevY = centerY + prevRadius * Math.sin(prevAngle);

          commands.push({
            type: 'line',
            x1: Math.round(prevX),
            y1: Math.round(prevY),
            x2: Math.round(x),
            y2: Math.round(y),
            color: '#FFD700'
          });
        }
      }
    }
    else {
      commands.push(
        { type: 'rect', x: 200, y: 200, width: 100, height: 100, color: '#4169E1' },
        { type: 'circle', x: 250, y: 250, radius: 20, color: '#FFD700' }
      );
    }

    if (lowerPrompt.includes('rainbow')) {
      for (let i = 0; i < 180; i++) {
        const angle = (i * Math.PI) / 180;
        const radius = 80;
        const x1 = 250 + radius * Math.cos(angle);
        const y1 = 300 + radius * Math.sin(angle);
        const x2 = 250 + (radius + 20) * Math.cos(angle);
        const y2 = 300 + (radius + 20) * Math.sin(angle);

        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
        const colorIndex = Math.floor((i / 180) * colors.length);

        commands.push({
          type: 'line',
          x1: Math.round(x1),
          y1: Math.round(y1),
          x2: Math.round(x2),
          y2: Math.round(y2),
          color: colors[colorIndex % colors.length]
        });
      }
    }

    return commands;
  }

  static saveDrawingLocally(title: string, commands: DrawCommand[], userId: number): void {
    const drawings = this.getLocalDrawings();
    const newDrawing = {
      id: Date.now(),
      title,
      commands,
      userId,
      createdAt: new Date().toISOString()
    };

    drawings.push(newDrawing);
    localStorage.setItem(this.DRAWINGS_KEY, JSON.stringify(drawings));
  }

  static getLocalDrawings(): any[] {
    const drawings = localStorage.getItem(this.DRAWINGS_KEY);
    return drawings ? JSON.parse(drawings) : [];
  }

  static getUserDrawings(userId: number): any[] {
    const drawings = this.getLocalDrawings();
    return drawings.filter((d: any) => d.userId === userId);
  }

  static deleteLocalDrawing(id: number): void {
    const drawings = this.getLocalDrawings();
    const filteredDrawings = drawings.filter((d: any) => d.id !== id);
    localStorage.setItem(this.DRAWINGS_KEY, JSON.stringify(filteredDrawings));
  }

  static getLocalDrawing(id: number): any {
    const drawings = this.getLocalDrawings();
    return drawings.find((d: any) => d.id === id);
  }
}