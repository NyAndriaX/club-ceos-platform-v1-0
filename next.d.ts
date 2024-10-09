
import { Server } from 'socket.io';

declare module 'next' {
  interface NextApiResponse {
    status(arg0: number): unknown;
    socket: {
      server: {
        io: Server;
      };
    };
  }
}

declare module 'next/server' {
  interface NextResponse {
    socket: {
      server: {
        io: Server;
      };
    };
  }
}
