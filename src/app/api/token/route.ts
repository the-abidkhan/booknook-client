import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { auth } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = jwt.sign(
        { email: session.user.email, name: session.user.name },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );

    return NextResponse.json({ token });
}