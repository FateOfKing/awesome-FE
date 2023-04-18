/** 控制同时并发的任务数量
 * 所有任务完成后可以得到每个任务的执行结果
 * 需要两个返回方法，start用于启动任务，pause用于停止任务
 * 每个任务具有原子性，不可中断，只能在两个任务之间中断
 * @param tasks 任务列表，每个任务无参数，返回Promise
 */
// 声明一个泛型函数类型Task
type Task<T = any> = () => Promise<T>;

// 声明一个任务列表totalTaskList，用于存储所有待执行的任务
const totalTaskList: Task[] = [];

// 声明一个标记isRunning，表示任务处理器是否正在运行，初始值为false
let isRunning = false;

// 声明一个标记isPause，表示任务处理器是否处于暂停状态，初始值为false
let isPause = false;

// 声明一个maxNum变量和currentNum变量，
// maxNum表示任务处理器能够同时处理的最大任务数量，currentNum表示当前正在执行的任务数量，
// 初始值为undefined和3
let maxNum: number,
  currentNum = 3;

// 声明一个结果数组result，用于保存任务执行结果
const result: any[] = [];

// addProcessTask函数用于向任务列表中添加任务
function addProcessTask(task: Task, autoStart = true) {
  totalTaskList.push(task);
  // 如果autoStart为true，则调用start函数启动任务处理器
  if (autoStart) {
    setTimeout(() => {
      start();
    }, 0);
  }
}

// setMaxNum函数用于设置最大并发数，并分别将其赋值给maxNum和currentNum变量
function setMaxNum(num: number) {
  maxNum = currentNum = num;
}

// start函数是任务处理器的核心逻辑，用于启动任务处理器
const start = () => {
  // 如果任务处理器处于暂停状态且已经完成所有任务，则输出中断信息，将isPause标记设为false并返回
  if (isPause && currentNum === maxNum) {
    console.log("中断");
    isPause = false;
    return;
  }
  // 如果任务处理器处于暂停状态但还有任务在进行中，则输出提示信息并返回
  if (isPause && currentNum !== maxNum) {
    console.log("已经暂停，但还有任务在进行中");
    return;
  }
  // 如果任务处理器正在运行，则直接返回
  if (isRunning) {
    return;
  }
  // 将isRunning标记设为true
  isRunning = true;
  // 循环遍历任务列表，处理未完成的任务
  while (totalTaskList.length > 0 && currentNum > 0) {
    currentNum--;
    // 取出一个任务并执行
    const task = totalTaskList.shift()!;
    task()
      .then((e) => {
        // 当任务执行结束时，将任务执行结果存储到result数组中，将当前正在执行的任务数量加1，再次调用start函数继续处理下一个任务
        console.log("end");

        result.push(e);
        currentNum++;
        start();
      })
      .catch((error) => {
        // 如果在任务执行过程中发生了错误，则将当前正在执行的任务数量加1，再次调用start函数继续处理下一个任务
        currentNum++;
        start();
      });
  }
  // 将isRunning标记设为false
  isRunning = false;
};

// pause函数用于暂停任务处理器，将isPause标记设为true
const pause = () => {
  isPause = true;
};

// 向任务列表中添加10个任务
for (let i = 0; i < 10; i++) {
  addProcessTask(() => {
    return new Promise((resolve) => {
      // 使用setTimeout模拟异步任务，2秒后返回结果
      setTimeout(() => {
        console.log("task" + i);
        resolve(i);
      }, 2000);
    });
  });
}

// 设置最大并发数为2
setMaxNum(2);

//4s后暂停任务处理器
// setTimeout(() => {
//   pause();
// }, 4000);
