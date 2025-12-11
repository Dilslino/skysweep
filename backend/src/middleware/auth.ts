import { Request, Response, NextFunction } from 'express';
import { createClient, Errors } from '@farcaster/quick-auth';
import { env } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import axios from 'axios';

const quickAuthClient = createClient();

export interface AuthenticatedUser {
  id: string;
  fid: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  primaryAddress?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

async function resolveUserFromNeynar(fid: number): Promise<Partial<AuthenticatedUser>> {
  try {
    const response = await axios.get(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'api_key': env.neynar.apiKey,
        },
      }
    );

    const user = response.data.users?.[0];
    
    if (!user) {
      throw new Error('User not found in Neynar');
    }

    return {
      fid: user.fid,
      username: user.username,
      displayName: user.display_name || user.username,
      avatarUrl: user.pfp_url,
      primaryAddress: user.verified_addresses?.eth_addresses?.[0] || 
                      user.custody_address,
    };
  } catch (error) {
    console.error('Error fetching user from Neynar:', error);
    throw error;
  }
}

async function getOrCreateUser(fid: number): Promise<AuthenticatedUser> {
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('fid', fid)
    .single();

  if (existingUser) {
    return {
      id: existingUser.id,
      fid: existingUser.fid,
      username: existingUser.username,
      displayName: existingUser.display_name,
      avatarUrl: existingUser.avatar_url,
      primaryAddress: existingUser.primary_address,
    };
  }

  const neynarUser = await resolveUserFromNeynar(fid);

  const { data: newUser, error } = await supabaseAdmin
    .from('users')
    .insert({
      fid: neynarUser.fid,
      username: neynarUser.username,
      display_name: neynarUser.displayName,
      avatar_url: neynarUser.avatarUrl,
      primary_address: neynarUser.primaryAddress,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return {
    id: newUser.id,
    fid: newUser.fid,
    username: newUser.username,
    displayName: newUser.display_name,
    avatarUrl: newUser.avatar_url,
    primaryAddress: newUser.primary_address,
  };
}

export const quickAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const token = authorization.split(' ')[1];
    
    const payload = await quickAuthClient.verifyJwt({
      token,
      domain: env.hostname,
    });

    const user = await getOrCreateUser(payload.sub);
    req.user = user;
    
    next();
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.info('Invalid token:', e.message);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.error('Auth error:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
