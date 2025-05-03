export interface TimelineEvent {
	id: string;
	title: string;
	startDate: Date;
	endDate?: Date;
	description: string;
	tags: string[];
	emotionalImpact?: number;
	color?: string;
}

export type TimelineScale = 'year' | 'month' | 'week' | 'day';

export interface TimelineState {
	events: TimelineEvent[];
	scale: TimelineScale;
	currentDate: Date;
} 