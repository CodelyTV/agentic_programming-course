import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
	title: "Neveraly | What to Cook Today",
	description: "Discover delicious recipes based on what's in your fridge",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
