'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TimelineEvent, TimelineScale, TimelineState } from '@/types/timeline';

interface TimelineContextType {
	state: TimelineState;
	addEvent: (event: Omit<TimelineEvent, 'id'>) => void;
	updateEvent: (id: string, event: Partial<TimelineEvent>) => void;
	deleteEvent: (id: string) => void;
	setScale: (scale: TimelineScale) => void;
	setCurrentDate: (date: Date) => void;
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export function TimelineProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<TimelineState>({
		events: [],
		scale: 'year',
		currentDate: new Date(),
	});

	// Load events from localStorage on mount
	useEffect(() => {
		const savedEvents = localStorage.getItem('timelineEvents');
		if (savedEvents) {
			const parsedEvents = JSON.parse(savedEvents).map((event: any) => ({
				...event,
				startDate: new Date(event.startDate),
				endDate: event.endDate ? new Date(event.endDate) : undefined,
			}));
			setState(prev => ({ ...prev, events: parsedEvents }));
		}
	}, []);

	// Save events to localStorage when they change
	useEffect(() => {
		localStorage.setItem('timelineEvents', JSON.stringify(state.events));
	}, [state.events]);

	const addEvent = (event: Omit<TimelineEvent, 'id'>) => {
		const newEvent: TimelineEvent = {
			...event,
			id: crypto.randomUUID(),
		};
		setState(prev => ({
			...prev,
			events: [...prev.events, newEvent],
		}));
	};

	const updateEvent = (id: string, updates: Partial<TimelineEvent>) => {
		setState(prev => ({
			...prev,
			events: prev.events.map(event =>
				event.id === id ? { ...event, ...updates } : event
			),
		}));
	};

	const deleteEvent = (id: string) => {
		setState(prev => ({
			...prev,
			events: prev.events.filter(event => event.id !== id),
		}));
	};

	const setScale = (scale: TimelineScale) => {
		setState(prev => ({ ...prev, scale }));
	};

	const setCurrentDate = (date: Date) => {
		setState(prev => ({ ...prev, currentDate: date }));
	};

	return (
		<TimelineContext.Provider
			value={{
				state,
				addEvent,
				updateEvent,
				deleteEvent,
				setScale,
				setCurrentDate,
			}}
		>
			{children}
		</TimelineContext.Provider>
	);
}

export function useTimeline() {
	const context = useContext(TimelineContext);
	if (context === undefined) {
		throw new Error('useTimeline must be used within a TimelineProvider');
	}
	return context;
} 