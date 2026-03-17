"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.css";

interface CookedDish {
	id: string;
	name: string;
	description: string;
	ingredients: { name: string; type: string }[];
}

export default function CookedDishDetail() {
	const params = useParams();
	const id = params.id as string;
	const [dish, setDish] = useState<CookedDish | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchDish = async () => {
			try {
				const response = await fetch(`/api/cooked-dishes/${id}`);
				if (!response.ok) {
					throw new Error("Dish not found");
				}
				const data = await response.json();
				setDish(data);
			} catch {
				setError("Could not load the dish");
			} finally {
				setIsLoading(false);
			}
		};

		void fetchDish();
	}, [id]);

	if (isLoading) {
		return (
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.loading}>Loading...</div>
				</div>
			</main>
		);
	}

	if (error || !dish) {
		return (
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.error}>
						{error ?? "Dish not found"}
					</div>
					<Link href="/" className={styles.backLink}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							width="20"
							height="20"
						>
							<path
								d="M19 12H5M12 19l-7-7 7-7"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span>Back to home</span>
					</Link>
				</div>
			</main>
		);
	}

	const mainIngredients = dish.ingredients.filter((i) => i.type === "main");
	const stapleIngredients = dish.ingredients.filter(
		(i) => i.type === "household_staple",
	);

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<Link href="/" className={styles.backLink}>
					<svg viewBox="0 0 24 24" fill="none" width="20" height="20">
						<path
							d="M19 12H5M12 19l-7-7 7-7"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					<span>Back to home</span>
				</Link>

				<article className={styles.dish}>
					<header className={styles.dishHeader}>
						<div className={styles.badge}>Cooked</div>
						<h1 className={styles.dishName}>{dish.name}</h1>
					</header>

					<p className={styles.dishDescription}>{dish.description}</p>

					<section className={styles.ingredientsSection}>
						{mainIngredients.length > 0 && (
							<div className={styles.ingredientGroup}>
								<h2 className={styles.ingredientGroupTitle}>
									Main ingredients
								</h2>
								<ul className={styles.ingredientsList}>
									{mainIngredients.map(
										(ingredient, index) => (
											<li
												key={index}
												className={`${styles.ingredient} ${styles["ingredient--main"]}`}
											>
												{ingredient.name}
											</li>
										),
									)}
								</ul>
							</div>
						)}

						{stapleIngredients.length > 0 && (
							<div className={styles.ingredientGroup}>
								<h2 className={styles.ingredientGroupTitle}>
									Pantry staples
								</h2>
								<ul className={styles.ingredientsList}>
									{stapleIngredients.map(
										(ingredient, index) => (
											<li
												key={index}
												className={`${styles.ingredient} ${styles["ingredient--staple"]}`}
											>
												{ingredient.name}
											</li>
										),
									)}
								</ul>
							</div>
						)}
					</section>
				</article>
			</div>
		</main>
	);
}
