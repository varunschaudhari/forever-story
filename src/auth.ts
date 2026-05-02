import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        try {
          // Dynamically import server-side modules to avoid Edge Runtime issues
          const { dbConnect } = await import('@/lib/mongodb');
          const { User } = await import('@/models/User');

          await dbConnect();

          // Find user by email with password field
          const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select(
            '+password'
          );

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Verify password
          const isPasswordValid = await user.comparePassword(parsed.data.password);
          if (!isPasswordValid) {
            throw new Error('Invalid email or password');
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log('User signed in:', user.email);
    },
    async signOut() {
      console.log('User signed out');
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});
