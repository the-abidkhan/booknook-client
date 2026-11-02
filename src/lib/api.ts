const API = process.env.NEXT_PUBLIC_API_URL;

async function getToken(): Promise<string> {
    const res = await fetch('/api/token', { cache: 'no-store' });
    if (!res.ok) throw new Error('Please login first');
    const data = await res.json();
    return data.token;
}

type ApiOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
    const { auth = false, headers, ...rest } = options;
    const h = new Headers(headers);

    if (rest.body && !h.has('Content-Type')) h.set('Content-Type', 'application/json');
    if (auth) h.set('Authorization', `Bearer ${await getToken()}`);

    const res = await fetch(`${API}${path}`, { ...rest, headers: h });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data as T;
}