import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db';
import config from '../config';
import { User } from '../types';

export class AuthService {
  static async login(email: string, password: string) {
    const user = db.prepare('SELECT * FROM Users WHERE email = ?').get(email);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Contraseña incorrecta');
    }

    if (user.status === 'suspended') {
      throw new Error('Usuario suspendido');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = db.prepare(`
        INSERT INTO Users (name, email, password, role, status)
        VALUES (?, ?, ?, 'pending', 'active')
      `).run(name, email, hashedPassword);

      return { success: true, id: result.lastInsertRowid };
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('El correo ya está registrado');
      }
      throw error;
    }
  }

  static updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const user = db.prepare('SELECT role FROM Users WHERE id = ?').get(userId);
    
    if (user?.role === 'admin') {
      throw new Error('No se puede suspender a un administrador');
    }

    db.prepare(`
      UPDATE Users 
      SET status = ?, updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(status, userId);

    return { success: true };
  }
}