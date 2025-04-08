import { useAuth } from "@clerk/nextjs";


export async function secureFetch(
  path: string,
  options: RequestInit = {}
) {
  const {getToken} = useAuth();
  const token = await getToken(); // Get Clerk token

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return res.json();
}
