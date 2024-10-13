import {cronTasks} from "./cronTasks";

export const cronJobs = [
    {
        status : false,
        schedule: "*/10 * * * * *",     // 10 seconds
        task: cronTasks.HelloTask,
    }
]
