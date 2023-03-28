/** 依次顺序执行一系列任务
 * 所有任务完成后可以得到每个任务的执行结果
 * 需要两个返回方法，start用于启动任务，pause用于停止任务
 * 每个任务具有原子性，不可中断，只能在两个任务之间中断
 * @param tasks 任务列表，每个任务无参数，返回Promise
 */
//定义了一个泛型函数类型Task，该函数返回一个Promise，可以传入一个泛型T的参数
type Task<T = any> = () => Promise<T>;

//定义processTasks函数，可以接受任意数量的Task参数，并返回一个对象，
//start方法返回一个Promise，进行异步操作，pause方法直接修改isRunning的状态来中断任务。
function processTasks(...tasks: Task[]) {
  let isRunning = false; //标记任务是否正在运行
  let i = 0; //记录已经完成的任务的数目
  const result: any[] = []; //存储每个任务执行的结果
  let prom: Promise<any> | null = null; //记录当前的Promise对象
  return {
    start: () => {
      return new Promise(async (resolve, reject) => {
        if (prom) {
          // 如果前一个Promise还没有结束，则使用新的Promise等待它的结束
          prom.then(resolve, reject);
          return;
        }
        if (isRunning) {
          // 如果正在运行，则不往下执行。
          return;
        }
        isRunning = true;
        while (i < tasks.length) {
          // 循环执行所有任务
          try {
            console.log("ing");
            result.push(await tasks[i]()); // 执行并存储结果
            console.log("end");
          } catch (error) {
            isRunning = false;
            reject(error); // 任务失败，reject出错信息
            prom = Promise.reject(error); // 记录当前Promise对象
            return;
          }
          i++;
          if (!isRunning && i < tasks.length - 1) {
            // 如果任务被暂停，则直接返回
            console.log("中断");

            return;
          }
        }
        isRunning = false;
        resolve(result); // 所有任务执行完成，resolve结果数组
        prom = Promise.resolve(result); // 记录当前Promise对象
      });
    },
    pause: () => {
      isRunning = false; // 修改状态，中断任务
    },
  };
}

//定义一个Task函数task，模拟一个异步的操作，该操作将在2秒后输出一条信息，并resolve。
const task: Task = () => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("task1");
      resolve();
    }, 2000);
  });
};

//调用processTasks方法，并传入5个相同的Task函数，得到start和pause方法，然后调用start方法开始异步执行所有任务，之后在4秒后调用pause方法，暂停任务。
const { start, pause } = processTasks(task, task, task, task, task);
start();
setTimeout(() => {
  pause();
}, 4000);
