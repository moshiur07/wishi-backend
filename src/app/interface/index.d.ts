// import { User } from "../../generated/prisma/client";

import { User } from "better-auth";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         role: Role;
//         email: string;
//         username?: string;
//         name?: string;
//       }
//     };
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: User
    }
  }
}