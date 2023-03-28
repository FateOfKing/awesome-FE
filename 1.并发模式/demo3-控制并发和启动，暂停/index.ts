/** 依次顺序执行一系列任务
 * 所有任务完成后可以得到每个任务的执行结果
 * 需要两个返回方法，start用于启动任务，pause用于停止任务
 * 每个任务具有原子性，不可中断，只能在两个任务之间中断
 * @param tasks 任务列表，每个任务无参数，返回Promise  
 */
type Task<T = any> = ()=> Promise<T>;

function processTasks(...tasks:Task[]){
    let isRunning = false;
    let i = 0;
    const result: any[] = [];
    let prom: Promise<any> | null = null;
    return {
        start:  ()=>{
           return new Promise(async(resolve,reject)=>{
            if (prom) {
                prom.then(resolve,reject)
                return;
            }
            if (isRunning) {
                return;
            }
            isRunning = true;
            while (i < tasks.length){
                try {
                    console.log('ing')
                    result.push(await tasks[i]());
                    console.log('end')

                } catch (error) {

                    isRunning = false
                    reject(error)
                    prom = Promise.reject(error)
                    return
                }
                i++;
                if(!isRunning && i < tasks.length -1){
                    console.log('中断')

                    return;
                }
            }
            isRunning = false
            resolve(result)
            prom = Promise.resolve(result)
           })
        },
        pause:()=>{
            isRunning = false;
        }
    }
}
const task:Task = () => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            console.log('task1');
            resolve();
        }, 2000);
    }
    );
}
const {start,pause} = processTasks(task,task,task,task,task)
start()
setTimeout(() => {
    pause()
}, 4000);