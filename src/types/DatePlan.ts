export interface DatePlan {
  id: string;
  title: string;
  /** "YYYY.MM.DD" */
  date: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
  /** Short teaser shown while the invitation is sealed. */
  hint?: string;
  /** Local date and time ("YYYY-MM-DDTHH:mm") before which the seal cannot be broken. */
  opensAt?: string;
}
