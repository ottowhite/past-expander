'use client';

import React, { useState } from 'react';
import { useTimeline } from '@/context/TimelineContext';
import { TimelineEvent } from '@/types/timeline';

export default function AddEventForm() {
	const { addEvent } = useTimeline();
	const [isOpen, setIsOpen] = useState(false);
	const [dateString, setDateString] = useState(new Date().toISOString().split('T')[0]);
	const [formData, setFormData] = useState<Omit<TimelineEvent, 'id'>>({
		title: '',
		startDate: new Date(),
		description: '',
		tags: [],
		emotionalImpact: undefined,
		color: '#4F46E5',
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addEvent(formData);
		const newDate = new Date();
		setDateString(newDate.toISOString().split('T')[0]);
		setFormData({
			title: '',
			startDate: newDate,
			description: '',
			tags: [],
			emotionalImpact: undefined,
			color: '#4F46E5',
		});
		setIsOpen(false);
	};

	const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && e.currentTarget.value.trim()) {
			e.preventDefault();
			setFormData(prev => ({
				...prev,
				tags: [...prev.tags, e.currentTarget.value.trim()],
			}));
			e.currentTarget.value = '';
		}
	};

	const removeTag = (tagToRemove: string) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove),
		}));
	};

	return (
		<div className="fixed bottom-4 right-4">
			{isOpen ? (
				<div className="bg-white p-4 rounded-lg shadow-lg w-80">
					<h2 className="text-lg font-semibold mb-4 text-black">Add New Event</h2>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Title
							</label>
							<input
								type="text"
								value={formData.title}
								onChange={e =>
									setFormData(prev => ({ ...prev, title: e.target.value }))
								}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Start Date
							</label>
							<input
								type="date"
								value={dateString}
								onChange={e => {
									setDateString(e.target.value);
									setFormData(prev => ({
										...prev,
										startDate: new Date(e.target.value),
									}));
								}}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={e =>
									setFormData(prev => ({ ...prev, description: e.target.value }))
								}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
								rows={3}
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Tags (press Enter to add)
							</label>
							<input
								type="text"
								onKeyDown={handleTagInput}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
							/>
							<div className="mt-2 flex flex-wrap gap-2">
								{formData.tags.map(tag => (
									<span
										key={tag}
										className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
									>
										{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="ml-1 text-gray-500 hover:text-gray-700"
										>
											×
										</button>
									</span>
								))}
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Emotional Impact (1-10)
							</label>
							<input
								type="number"
								min="1"
								max="10"
								value={formData.emotionalImpact || ''}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										emotionalImpact: parseInt(e.target.value) || undefined,
									}))
								}
								className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Color
							</label>
							<input
								type="color"
								value={formData.color}
								onChange={e =>
									setFormData(prev => ({ ...prev, color: e.target.value }))
								}
								className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
							/>
						</div>

						<div className="flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
							>
								Add Event
							</button>
						</div>
					</form>
				</div>
			) : (
				<button
					onClick={() => setIsOpen(true)}
					className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 flex items-center justify-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 4v16m8-8H4"
						/>
					</svg>
				</button>
			)}
		</div>
	);
} 