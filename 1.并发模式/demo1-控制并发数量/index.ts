// 实现一个dispatch函数，接受多个函数作为参数
// 每个函数作为一个‘任务’，并返回一个Promise
// 限制同时执行任务数量
type Task<T = any> = ()=> Promise<T>;
// 定义一个 Dispatch 类型，表示任务分发器函数类型
type Dispatch = (...task:Task[]) =>void;
// q: 请写出lodash中的防抖
// a: https://www.lodashjs.com/docs/lodash.debounce
function debounce(func:Function,wait:number){
    let timer:number;
    return function(...args:any[]){
        if(timer){
            clearTimeout(timer);
        }
        timer = setTimeout(()=>{
            func(...args);
        }
        ,wait);
    }
}



/**
 * 创建一个任务分发器函数，用于控制同时执行的最大任务数
 * @param max 最大任务数，默认为 5
 * @returns 返回一个 Dispatch 函数
 */
function createTaskDispatch(max = 5): Dispatch {
    const untouchedTasks: Task[] = []; // 存储未处理的任务列表

    // 创建一个防抖函数，用于清空未处理的任务列表
    const drainUntouchedTasks = debounce(() => {
        while (max > 0 && untouchedTasks.length > 0) {

            // 取出第一个任务，并将已处理的任务数加一
            const task = untouchedTasks.shift()!;
            max--;

            // 执行任务，无论成功或失败都将已处理的任务数减一，并递归调用 clearTasks
            task().finally(() => {
                max++;
                drainUntouchedTasks()
            });
        }
    }, 0);

    // 返回一个 Dispatch 函数，用于向任务列表中添加新的任务
    return function dispatch(...task: Task[]): void {
        untouchedTasks.push(...task);
        drainUntouchedTasks();
    };
}

// 测试
const dispatch = createTaskDispatch(2);

// 定义三个异步任务
const task1: Task = () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log('task1');
            resolve();
        }, 2000);
    });
}
const task2 = () => new Promise<void>((resolve) => {
    setTimeout(() => {
        console.log('task2');
        resolve();
    }, 2000);
});
const task3 = () => new Promise<void>((resolve) => {
    setTimeout(() => {
        console.log('task3');
        resolve();
    }, 3000);
});

// 向任务分发器中添加多个异步任务
dispatch(task1, task2, task3, task1, task1, task1);
