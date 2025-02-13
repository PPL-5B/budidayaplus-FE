export type Task = {
	id: string
	task_type: string
	date: Date
	status: string
	cycle_id: string
	assignee: string
	pond: {
		pond_id: string
		name: string
	}
}
