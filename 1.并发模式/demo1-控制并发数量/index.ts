// 实现一个dispatch函数，接受多个函数作为参数
// 每个函数作为一个‘任务’，并返回一个Promise
// 限制同时执行任务数量
type Task<T = any> = ()=> Promise<T>;

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

function createTaskDispatch(max = 5):Dispatch{
    const untouchedTasks:Task[] = [];
    // 清空未处理数组
    const drainUntouchedTasks = debounce(()=>{
       while(max > 0 && untouchedTasks.length > 0){
        const task = untouchedTasks.shift()!;
        max--;
        task().finally(()=>{
            max++;
            drainUntouchedTasks()
        });
       }
    }
    ,0);
    return function dispatch(...task:Task[]):void{
        untouchedTasks.push(...task)
        drainUntouchedTasks();
    };
}

// 测试
const dispatch = createTaskDispatch(2);

// q: 我怎么修改下面的类型报错


const task1:Task = () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log('task1');
            resolve();
        }, 2000);
    }
    );
}
const task2 = () => new Promise<void>((resolve) => {
    setTimeout(() => {
        console.log('task2');
        resolve();
    }, 2000);
    }
);
const task3 = () => new Promise<void>((resolve) => {
    setTimeout(() => {
        console.log('task3');
        resolve();
    }, 3000);
    }
);

dispatch(task1,task2,task3,task1,task1,task1);