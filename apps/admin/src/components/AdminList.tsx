"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useState } from "react";

type Post = {
	id: number;
	urlId: string;
	title: string;
	content: string;
	imageUrl: string;
	date: string;
	category: string;
	tags: string;
	active: boolean;
};

type SortBy = "date-desc" | "date-asc" | "title-asc" | "title-desc";
type Visibility = "all" | "active" | "inactive";

function parseDateFilter(input: string): Date | null {
	const digits = input.replace(/\D/g, "");
	if (digits.length !== 8) {
		return null;
	}

	const day = Number(digits.slice(0, 2));
	const month = Number(digits.slice(2, 4));
	const year = Number(digits.slice(4, 8));
	const date = new Date(year, month - 1, day);

	if (
		Number.isNaN(date.getTime()) ||
		date.getDate() !== day ||
		date.getMonth() !== month - 1 ||
		date.getFullYear() !== year
	) {
		return null;
	}

	return date;
}

function formatDate(dateString: string) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	}).format(new Date(dateString));
}

function formatTags(tags: string) {
	return tags
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean)
		.map((tag) => `#${tag}`)
		.join(", ");
}

export function AdminList({ posts }: { posts: Post[] }) {
	const [contentFilter, setContentFilter] = useState("");
	const [tagFilter, setTagFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [visibilityFilter, setVisibilityFilter] =
		useState<Visibility>("all");
	const [sortBy, setSortBy] = useState<SortBy>("date-desc");
	const [statusMessage, setStatusMessage] = useState<Record<number, string>>({});

	const router = useRouter();

	const handleToggleActive = async (id: number, currentStatus: boolean) => {
		const response = await fetch(`api/posts/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ active: !currentStatus }),
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			router.refresh();
		} else {
			alert("Failed to update post status");
		}
	}

	const filteredPosts = useMemo(() => {
		const parsedDate = parseDateFilter(dateFilter);
		const query = contentFilter.trim().toLowerCase();
		const tag = tagFilter.trim().toLowerCase();

		const filtered = posts.filter((post) => {
			const postDate = new Date(post.date);
			const contentMatch =
				query.length === 0 ||
				post.title.toLowerCase().includes(query) ||
				post.content.toLowerCase().includes(query);
			const tagMatch = tag.length === 0 || post.tags.toLowerCase().includes(tag);
			const dateMatch = !parsedDate || postDate >= parsedDate;
			const visibilityMatch =
				visibilityFilter === "all" ||
				(visibilityFilter === "active" ? post.active : !post.active);

			return contentMatch && tagMatch && dateMatch && visibilityMatch;
		});

		filtered.sort((a, b) => {
			if (sortBy === "title-asc") {
				return a.title.localeCompare(b.title);
			}
			if (sortBy === "title-desc") {
				return b.title.localeCompare(a.title);
			}
			if (sortBy === "date-asc") {
				return new Date(a.date).getTime() - new Date(b.date).getTime();
			}
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});

		return filtered;
	}, [posts, contentFilter, tagFilter, dateFilter, visibilityFilter, sortBy]);

	return (
		<section className="w-full max-w-5xl space-y-5">
			<div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
				<div>
					<label htmlFor="content-filter" className="mb-1 block text-sm font-medium">
						Filter by Content:
					</label>
					<input
						id="content-filter"
						type="text"
						value={contentFilter}
						onChange={(event) => setContentFilter(event.target.value)}
						className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
					/>
				</div>

				<div>
					<label htmlFor="tag-filter" className="mb-1 block text-sm font-medium">
						Filter by Tag:
					</label>
					<input
						id="tag-filter"
						type="text"
						value={tagFilter}
						onChange={(event) => setTagFilter(event.target.value)}
						className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
					/>
				</div>

				<div>
					<label htmlFor="date-filter" className="mb-1 block text-sm font-medium">
						Filter by Date Created:
					</label>
					<input
						id="date-filter"
						type="text"
						value={dateFilter}
						onChange={(event) => setDateFilter(event.target.value)}
						placeholder="DDMMYYYY"
						className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
					/>
				</div>

				<div>
					<label htmlFor="visibility-filter" className="mb-1 block text-sm font-medium">
						Filter by Visibility:
					</label>
					<select
						id="visibility-filter"
						value={visibilityFilter}
						onChange={(event) => setVisibilityFilter(event.target.value as Visibility)}
						className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
					>
						<option value="all">All</option>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>

				<div>
					<label htmlFor="sort-by" className="mb-1 block text-sm font-medium">
						Sort By:
					</label>
					<select
						id="sort-by"
						value={sortBy}
						onChange={(event) => setSortBy(event.target.value as SortBy)}
						className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
					>
						<option value="title-asc">title-asc</option>
						<option value="title-desc">title-desc</option>
						<option value="date-asc">date-asc</option>
						<option value="date-desc">date-desc</option>
					</select>
				</div>

				<div className="flex items-end">
					<Link
						href="/posts/create"
						className="inline-flex w-full items-center justify-center rounded bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
					>
						Create Post
					</Link>
				</div>
			</div>

			<div className="space-y-4">
				{filteredPosts.map((post) => (
					<article
						key={post.id}
						className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-[140px_1fr]"
					>
						<img
							src={post.imageUrl}
							alt={post.title}
							className="h-24 w-full rounded object-cover"
						/>

						<div className="space-y-2">
							<h2 className="text-lg font-semibold text-slate-900">
								<Link href={`/post/${post.urlId}`}>{post.title}</Link>
							</h2>
							<p className="text-sm text-slate-600">{formatTags(post.tags)}</p>
							<p className="text-sm text-slate-600">Posted on {formatDate(post.date)}</p>
							<p className="text-sm text-slate-600">{post.category}</p>

							<button
								type="button"
								onClick={() => handleToggleActive(post.id, post.active)}
								className={`rounded px-3 py-1 text-sm font-medium ${
									post.active
										? "bg-emerald-100 text-emerald-800"
										: "bg-slate-200 text-slate-700"
								}`}
							>
								{post.active ? "Active" : "Inactive"}
							</button>

							{statusMessage[post.id] ? (
								<p className="text-xs text-slate-500">{statusMessage[post.id]}</p>
							) : null}
						</div>
					</article>
				))}
			</div>
		</section>
	);
}
