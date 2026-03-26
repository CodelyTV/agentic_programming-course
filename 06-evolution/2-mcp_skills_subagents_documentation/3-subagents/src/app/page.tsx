"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import styles from "./page.module.css";

interface SuggestedDish {
	name: string;
	description: string;
	ingredients: { name: string; type: string }[];
}

interface CookedDish {
	id: string;
	name: string;
	description: string;
	ingredients: { name: string; type: string }[];
}

export default function Home() {
	const [ingredients, setIngredients] = useState<string[]>(["", "", ""]);
	const [suggestedDish, setSuggestedDish] = useState<SuggestedDish | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cookedDishes, setCookedDishes] = useState<CookedDish[]>([]);
	const [isLoadingDishes, setIsLoadingDishes] = useState(true);

	useEffect(() => {
		const fetchCookedDishes = async () => {
			try {
				const response = await fetch("/api/cooked-dishes");
				if (response.ok) {
					const dishes = await response.json();
					setCookedDishes(dishes);
				}
			} catch {
				// Silently fail - dishes will just be empty
			} finally {
				setIsLoadingDishes(false);
			}
		};

		void fetchCookedDishes();
	}, []);

	const handleIngredientChange = (index: number, value: string) => {
		const newIngredients = [...ingredients];
		newIngredients[index] = value;
		setIngredients(newIngredients);
	};

	const addIngredient = () => {
		setIngredients([...ingredients, ""]);
	};

	const removeIngredient = (index: number) => {
		if (ingredients.length > 1) {
			const newIngredients = ingredients.filter((_, i) => i !== index);
			setIngredients(newIngredients);
		}
	};

	const handleSuggest = async () => {
		setIsLoading(true);
		setError(null);
		setSuggestedDish(null);

		const userIngredients = ingredients
			.map((i) => i.trim().toLowerCase())
			.filter((i) => i !== "");

		try {
			const params = new URLSearchParams();
			for (const ing of userIngredients) {
				params.append("ingredients", ing);
			}
			const response = await fetch(
				`/api/dishes/suggest?${params.toString()}`,
			);

			if (!response.ok) {
				throw new Error("Failed to get dish suggestion");
			}

			const dish = await response.json();
			setSuggestedDish(dish);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Something went wrong",
			);
		} finally {
			setIsLoading(false);
		}
	};

	const filledCount = ingredients.filter((i) => i.trim() !== "").length;

	const handleMarkAsCooked = async () => {
		if (!suggestedDish) {
			return;
		}

		try {
			const uuid = crypto.randomUUID();
			const response = await fetch(`/api/cooked-dishes/${uuid}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: suggestedDish.name,
					description: suggestedDish.description,
					ingredients: suggestedDish.ingredients,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to save dish");
			}

			const newCookedDish: CookedDish = {
				id: uuid,
				name: suggestedDish.name,
				description: suggestedDish.description,
				ingredients: suggestedDish.ingredients,
			};
			setCookedDishes([newCookedDish, ...cookedDishes]);
			setSuggestedDish(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to save dish",
			);
		}
	};

	const handleDismissDish = () => {
		setSuggestedDish(null);
	};

	return (
		<main className={styles.main}>
			<div className={styles.container}>
				<header className={styles.header}>
					<div className={styles.logoMark}>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							className={styles.logoIcon}
						>
							<path
								d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
								fill="currentColor"
							/>
						</svg>
					</div>
					<h1 className={styles.title}>Neveraly</h1>
					<p className={styles.subtitle}>
						Tell us what's in your fridge, and we'll suggest the
						perfect dish
					</p>
				</header>

				<section className={styles.inputSection}>
					<div className={styles.sectionHeader}>
						<span className={styles.sectionLabel}>
							Your ingredients
						</span>
						<span className={styles.counter}>
							{filledCount} added
						</span>
					</div>

					<div className={styles.ingredientsList}>
						{ingredients.map((ingredient, index) => (
							<div
								key={index}
								className={styles.ingredientRow}
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<div className={styles.inputWrapper}>
									<span className={styles.inputNumber}>
										{index + 1}
									</span>
									<input
										type="text"
										value={ingredient}
										onChange={(e) =>
											handleIngredientChange(
												index,
												e.target.value,
											)
										}
										placeholder="e.g. tomatoes, chicken, rice..."
										className={styles.input}
									/>
									{ingredients.length > 1 && (
										<button
											onClick={() =>
												removeIngredient(index)
											}
											className={styles.removeButton}
											aria-label="Remove ingredient"
										>
											<svg
												viewBox="0 0 24 24"
												fill="none"
												width="18"
												height="18"
											>
												<path
													d="M18 6L6 18M6 6l12 12"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
												/>
											</svg>
										</button>
									)}
								</div>
							</div>
						))}
					</div>

					<button
						onClick={addIngredient}
						className={styles.addButton}
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							width="20"
							height="20"
						>
							<path
								d="M12 5v14M5 12h14"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
						<span>Add another ingredient</span>
					</button>
				</section>

				<button
					onClick={handleSuggest}
					className={styles.suggestButton}
					disabled={filledCount === 0 || isLoading}
				>
					<span className={styles.buttonText}>
						{isLoading ? "Thinking..." : "Suggest a dish"}
					</span>
					{!isLoading && (
						<svg
							viewBox="0 0 24 24"
							fill="none"
							width="20"
							height="20"
							className={styles.buttonIcon}
						>
							<path
								d="M5 12h14M12 5l7 7-7 7"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					)}
				</button>

				{error && <div className={styles.error}>{error}</div>}

				{suggestedDish && (
					<section className={styles.dish}>
						<h2 className={styles.dish__name}>
							{suggestedDish.name}
						</h2>
						<p className={styles.dish__description}>
							{suggestedDish.description}
						</p>
						<div className={styles.dish__ingredientsSection}>
							<span className={styles.dish__ingredientsLabel}>
								Ingredients:
							</span>
							<ul className={styles.dish__ingredientsList}>
								{suggestedDish.ingredients.map(
									(ingredient, index) => (
										<li
											key={index}
											className={`${styles.dish__ingredient} ${
												ingredient.type === "main"
													? styles[
															"dish__ingredient--main"
														]
													: styles[
															"dish__ingredient--staple"
														]
											}`}
										>
											{ingredient.name}
										</li>
									),
								)}
							</ul>
						</div>
						<div className={styles.dish__actions}>
							<span className={styles.dish__question}>
								Did you make this dish?
							</span>
							<div className={styles.dish__buttons}>
								<button
									onClick={handleMarkAsCooked}
									className={styles.dish__checkButton}
									aria-label="Yes, I made this dish"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										width="20"
										height="20"
									>
										<path
											d="M20 6L9 17l-5-5"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
								<button
									onClick={handleDismissDish}
									className={styles.dish__dismissButton}
									aria-label="No, dismiss this dish"
								>
									<svg
										viewBox="0 0 24 24"
										fill="none"
										width="20"
										height="20"
									>
										<path
											d="M18 6L6 18M6 6l12 12"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
										/>
									</svg>
								</button>
							</div>
						</div>
					</section>
				)}

				{!isLoadingDishes && cookedDishes.length > 0 && (
					<section className={styles.cookedDishesSection}>
						<div className={styles.sectionHeader}>
							<span className={styles.sectionLabel}>
								Your cooked dishes
							</span>
							<span className={styles.counter}>
								{cookedDishes.length} dishes
							</span>
						</div>
						<div className={styles.cookedDishesList}>
							{cookedDishes.map((dish) => (
								<Link
									key={dish.id}
									href={`/cooked-dishes/${dish.id}`}
									className={styles.cookedDishCardLink}
								>
									<article className={styles.cookedDishCard}>
										<h3
											className={
												styles.cookedDishCard__name
											}
										>
											{dish.name}
										</h3>
										<p
											className={
												styles.cookedDishCard__description
											}
										>
											{dish.description}
										</p>
										<ul
											className={
												styles.cookedDishCard__ingredients
											}
										>
											{dish.ingredients.map(
												(ingredient, index) => (
													<li
														key={index}
														className={`${styles.dish__ingredient} ${
															ingredient.type ===
															"main"
																? styles[
																		"dish__ingredient--main"
																	]
																: styles[
																		"dish__ingredient--staple"
																	]
														}`}
													>
														{ingredient.name}
													</li>
												),
											)}
										</ul>
									</article>
								</Link>
							))}
						</div>
					</section>
				)}

				<footer className={styles.footer}>
					<p>Powered by Codely & Local AI…</p>
				</footer>
			</div>
		</main>
	);
}
