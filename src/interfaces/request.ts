import { Request, Response } from 'express';
import { User, Category, Appointment } from './db';

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithCategory extends Request {
  category: Category;
}

export interface RequestWithAppointment extends Request {
  appointment: Appointment
}