'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TimelineEvent } from '@/types/timeline';

interface EventCardProps {
	event: TimelineEvent;
}

export default function EventCard({ event }: EventCardProps) {
	const formatDate = (date: Date) => {
		return date.toLocaleDateString();
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="w-64 p-3 rounded-lg shadow-md bg-white"
			style={{ borderLeft: `4px solid ${event.color || '#4F46E5'}` }}
		>
			<div className="flex flex-col gap-2">
				<div>
					<h3 className="text-sm font-semibold text-gray-800">{event.title}</h3>
					<p className="text-xs text-gray-500">
						{formatDate(event.startDate)}
						{event.endDate && ` - ${formatDate(event.endDate)}`}
					</p>
				</div>
				<p className="text-xs text-gray-600 line-clamp-2">{event.description}</p>
				{event.emotionalImpact && (
					<div className="flex items-center">
						<span className="text-xs text-gray-500 mr-2">Impact:</span>
						<div className="w-16 h-1.5 bg-gray-200 rounded-full">
							<div
								className="h-full rounded-full bg-blue-500"
								style={{ width: `${(event.emotionalImpact / 10) * 100}%` }}
							/>
						</div>
					</div>
				)}
				{event.tags.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{event.tags.map((tag) => (
							<span
								key={tag}
								className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
} 