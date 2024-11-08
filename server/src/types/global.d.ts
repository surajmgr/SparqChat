import { Request, Response } from "express";
import { Socket } from "socket.io";
import { IncomingMessage } from "http";

declare global {
  namespace Express {
    interface Request {
      session?: {
        user?: {
          id: string;
          email: string;
          socketId?: string;
        };
    }
    }
  }
}
declare module "http" {
  interface IncomingMessage {
    session?: {
      user?: {
        id: string;
        email: string;
        socketId?: string;
      };
    };
  }
}

declare module 'express-session' {
  interface Session {
    user?: { id: string; email: string; socketId?: string };
  }
}
    
declare module "socket.io" {
  interface Socket {
    user?: {
      id: string;
      email: string;
      socketId?: string;
    };
  }
}


