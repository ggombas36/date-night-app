export interface DatePlan {
    id: string;
    title: string;
    date: string;
    description: string;
    activities: string[];
    is_deleted?: boolean;
}

export interface DatePlanInput extends Omit<DatePlan, 'id'> {
    id?: string;
}