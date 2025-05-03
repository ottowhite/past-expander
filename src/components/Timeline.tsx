'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTimeline } from '@/context/TimelineContext';
import { TimelineScale } from '@/types/timeline';

const SCALE_OPTIONS: TimelineScale[] = ['year', 'month', 'week', 'day'];
const MIN_PIXELS_PER_DAY = 0.1; // Allow zooming out to 0.1 pixels per day
const MAX_PIXELS_PER_DAY = 50;
const MIN_PIN_SIZE = 8;
const MAX_PIN_SIZE = 24;

export default function Timeline() {
	const { state, setScale, setCurrentDate } = useTimeline();
	const { events, scale, currentDate } = state;
	const timelineRef = useRef<HTMLDivElement>(null);
	const [pixelsPerDay, setPixelsPerDay] = useState(10);

	// Calculate timeline range based on events
	const { startDate, endDate, totalDays } = useMemo(() => {
		if (events.length === 0) {
			const today = new Date();
			return {
				startDate: today,
				endDate: today,
				totalDays: 1,
			};
		}

		const dates = events.map(event => event.startDate.getTime());
		const startDate = new Date(Math.min(...dates));
		const endDate = new Date(Math.max(...dates));
		const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

		return { startDate, endDate, totalDays };
	}, [events]);

	const handleScaleChange = (newScale: TimelineScale) => {
		setScale(newScale);
		// Reset zoom level when changing scale
		setPixelsPerDay(10);
	};

	const handleWheel = (e: React.WheelEvent) => {
		e.preventDefault();
		const delta = e.deltaY > 0 ? -0.1 : 0.1; // Smaller zoom steps
		const newPixelsPerDay = Math.max(
			MIN_PIXELS_PER_DAY,
			Math.min(MAX_PIXELS_PER_DAY, pixelsPerDay + delta)
		);
		setPixelsPerDay(newPixelsPerDay);
	};

	const getEventPosition = (eventDate: Date) => {
		const diffInDays = Math.floor(
			(eventDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
		);
		return diffInDays * pixelsPerDay;
	};

	const getPinSize = (emotionalImpact?: number) => {
		if (!emotionalImpact) return MIN_PIN_SIZE;
		// Ensure minimum pin size when zoomed out
		const baseSize = MIN_PIN_SIZE + (emotionalImpact / 10) * (MAX_PIN_SIZE - MIN_PIN_SIZE);
		return Math.max(4, baseSize * Math.min(1, pixelsPerDay)); // Don't let pins get too small
	};

	const formatDateLabel = (date: Date) => {
		switch (scale) {
			case 'year':
				return date.getFullYear();
			case 'month':
				return date.toLocaleString('default', { month: 'short', year: 'numeric' });
			case 'week':
				return `Week ${Math.ceil(date.getDate() / 7)}`;
			case 'day':
				return date.toLocaleDateString();
		}
	};

	// Generate date markers based on scale and zoom level
	const dateMarkers = useMemo(() => {
		const markers = [];
		const increment = {
			year: 365,
			month: 30,
			week: 7,
			day: 1,
		}[scale];

		// Adjust increment based on zoom level to prevent overcrowding
		const adjustedIncrement = Math.max(
			increment,
			Math.ceil(100 / pixelsPerDay) // Ensure at least 100px between markers
		);

		let currentDate = new Date(startDate);
		while (currentDate <= endDate) {
			markers.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + adjustedIncrement);
		}
		return markers;
	}, [scale, startDate, endDate, pixelsPerDay]);

	return (
		<div className="flex flex-col h-screen">
			<div className="flex justify-between p-4 bg-gray-100">
				<div className="flex gap-2">
					{SCALE_OPTIONS.map((option) => (
						<button
							key={option}
							onClick={() => handleScaleChange(option)}
							className={`px-3 py-1 rounded ${scale === option
								? 'bg-blue-500 text-white'
								: 'bg-white text-gray-700'
								}`}
						>
							{option.charAt(0).toUpperCase() + option.slice(1)}
						</button>
					))}
				</div>
				<div className="text-gray-700">
					{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
					<span className="ml-2 text-sm text-gray-500">
						(Zoom: {pixelsPerDay.toFixed(1)}px/day)
					</span>
				</div>
			</div>

			<div
				className="flex-1 overflow-x-auto bg-white relative"
				ref={timelineRef}
				onWheel={handleWheel}
			>
				<div
					className="absolute h-full"
					style={{
						width: `${totalDays * pixelsPerDay}px`,
						minWidth: '100%' // Ensure timeline is at least as wide as the viewport
					}}
				>
					{/* Timeline axis */}
					<div className="absolute top-0 left-0 right-0 h-8 bg-gray-50 border-b border-gray-200">
						<div className="flex h-full">
							{dateMarkers.map((date, i) => (
								<div
									key={i}
									className="flex-1 border-r border-gray-200 text-center text-sm text-gray-500"
								>
									{formatDateLabel(date)}
								</div>
							))}
						</div>
					</div>

					{/* Timeline line */}
					<div className="absolute top-8 left-0 right-0 h-0.5 bg-gray-300" />

					{/* Event pins */}
					<div className="absolute top-8 left-0 right-0">
						{events.map((event) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 20 }}
								className="absolute flex flex-col items-center"
								style={{
									left: `${getEventPosition(event.startDate)}px`,
									transform: 'translateX(-50%)',
								}}
							>
								<div
									className="rounded-full cursor-pointer hover:scale-110 transition-transform"
									style={{
										width: `${getPinSize(event.emotionalImpact)}px`,
										height: `${getPinSize(event.emotionalImpact)}px`,
										backgroundColor: event.color || '#4F46E5',
									}}
									title={`${event.title}\n${event.description}`}
								/>
								{pixelsPerDay > 2 && (
									<div className="mt-1 text-xs text-gray-500">
										{event.title}
									</div>
								)}
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
} 