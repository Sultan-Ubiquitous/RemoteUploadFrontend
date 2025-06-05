"use client";

import { useEffect, useState } from "react";

export default function page() {
	const [session, setSession] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const res = await fetch("http://localhost:8008/api/user-session", {
					credentials: "include", // important for sending cookies
				});
				if (!res.ok) throw new Error("Failed to fetch session");

				const data = await res.json();
				setSession(data);
			} catch (error) {
				console.error("Error fetching session:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchSession();
	}, []);

	if (loading) return <p>Loading...</p>;

	if (!session) return <p>Not signed in</p>;
	
	return (
		<div>
            
			<h2>Welcome, {
				//@ts-ignore
			session?.user.name}</h2>
			<p>Email: {
				//@ts-ignore
			session?.user.email}</p>
		</div>
	);
}
