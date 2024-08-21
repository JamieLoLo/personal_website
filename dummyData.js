export const dummyData = [
  {
    id: 1,
    title: `【 Google 】讓 Google Sheet 成為你的資料庫`,
    content: `前言
在工作上遇到了需要將前端收集到的資料整合給客戶的需求，最一開始是看了這篇 - Google sheet 試算表表單串接api，但因為版本的更新，使用此篇做法會遇上 CORS 的問題，以下紀錄 2023 實測作法，大致操作與參考文章相同，主要的差別在於前端存取資料的部分。

官方文件在這裡

Google Apps Script
1 . 建立一個新的 Google Sheet。
2 . 進入 Google 雲端硬碟頁面點選左上角的新增。
3 . 點選更多 ⇒ Google Apps Script


4 . 以下為範例程式碼，請依實際需求修改資料格式：

function doGet(e) {
  let name = e.parameters.name;
  let age = e.parameters.age;

  // 選擇 Google Sheet
  let spreadsheet = SpreadsheetApp.openById("填入Google Sheet ID");
  
  // 取得第一個表單
  let sheet = spreadsheet.getSheets()[0];
  // 目前的最後一行
  let lastRow = sheet.getLastRow();

  // 寫入資料，選擇 (行, 欄)。
  sheet.getRange(lastRow + 1, 1).setValue(name);
  sheet.getRange(lastRow + 1, 2).setValue(age);

  // result 裡面可以放入文字 debug，若成功送出請求，dev tools 將會打印出 result。
  let result = "";
  let callback = e.parameters.callback;
  let response = callback + "(" + JSON.stringify(result) + ")";
  return ContentService
    .createTextOutput(response)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
Google Sheet 網址會有一段 ID，即下圖底線紅色的部分，請將上方程式碼中的 “填入Google Sheet ID” 改為你自己的 Google Sheet ID：


直接把程式碼寫在 gs 檔案裡：


5 . 部署：點擊右上方的新增部署作業，每一次有更動都需要重新部署。


選取類型選擇網頁應用程式：


將存取權設為所有人：


點擊部署之後會出現以下畫面，點擊授予存取權：


接著會出現登入頁面，登入之後會看到下方畫面：


請點擊左下角的 Advanced，然後前往專案，一路按允許確認：


這時候會獲得一個網址，請將它複製起來，它就是前端要使用的網址：`,
  },
  {
    id: 2,
    title: `【 React 】Reducer 與 Context 的搭配使用`,
    content: `本篇筆記摘錄自官方文件 Scaling Up with Reducer and Context

Reducer 讓你可以統一控管元件的狀態更新，Context 讓你可以將資訊傳到位於結構較深處的元件，而你可以透過結合 reducer 與 context 來管理較複雜的狀態。

Combining a reducer with context
先前在 Reducer 入門篇時，我們有用過 reducer 來管理狀態，reducer 函式包含了所有的狀態更新邏輯：

( 將左側拉桿向右移動，可以看見程式碼的部分，拉開後點擊左上角三條線漢堡圖示可以看見完整檔案，右邊則為輸出結果。 )


reducer 可以讓事件處理器更加簡潔，然而，隨著專案的成長，你可能會遇到其他的困難，目前tasks狀態以及dispatch函式只能在TaskApp元件的最頂層取得，如果想讓其他元件也能閱讀或是改變，我們必須明確地將當前狀態以及事件處理器以 props 的方式傳遞下去。

舉例來說，TaskApp傳遞任務清單與事件處理器到TaskList：

<TaskList
  tasks={tasks}
  onChangeTask={handleChangeTask}
  onDeleteTask={handleDeleteTask}
/>
接著，TaskList再將事件處理器傳遞給Task：

<Task
  task={task}
  onChange={onChangeTask}
  onDelete={onDeleteTask}
/>
在這種小型的範例裡，這樣的做法是可以的，但如果中間必須穿越數十或數百個元件，這個方法將會非常的可怕。

這就是為什麼我們要將tasks狀態以及dispatch函式放進 context，使用這個方法，在TaskApp樹狀結構以下的所有元件都將能讀取tasks，以及進行dispatch actions，且不會產生 “prop drilling” 的情形。

我們可以透過以下幾個步驟來結合 reducer 與 context：

建立 context
將狀態與 dispatch 放入 context
在該樹狀結構以下的任意地方使用 context
步驟一：建立 context
useReducer會回傳當前的tasks與dispatch函式讓我們可以進行更新：

const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
為了傳遞它們，你需要創建兩個分開的 context：

TasksContext提供目前的任務清單
TasksDispatchContext提供讓元件可以執行 dispatch actions 的函式
分別匯出它們，之後就可以在其他的檔案匯入它們：


在這邊我們使用了null當作預設值，實際的值將會由TaskApp元件提供。

步驟二：將狀態與 dispatch 放入 context
把兩個 context 匯入TaskApp元件，並使用useReducer來 returntasks與dispatch，再將它們提供 ( provide ) 給該樹狀結構以下的所有元件：

import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
  // ...
  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        ...
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
目前我們同時透過 props 與 context 來傳遞資訊，下個步驟我們將會把 props 傳遞的部分移除：


步驟三：在該樹狀結構以下的任意地方使用 context
現在我們不再需要往下傳送任務清單或事件處理器：
( 這邊指的是傳到AddTask與TaskList)

<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    <h1>Day off in Kyoto</h1>
    <AddTask />
    <TaskList />
  </TasksDispatchContext.Provider>
</TasksContext.Provider>
直接在需要任務清單的元件內讀取TaskContext：

export default function TaskList() {
  const tasks = useContext(TasksContext);
  // ...
元件可以讀取dispatch函式，並且透過呼叫它們來更新任務清單：

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useContext(TasksDispatchContext);
  // ...
  return (
    // ...
    <button onClick={() => {
      setText('');
      dispatch({
        type: 'added',
        id: nextId++,
        text: text,
      });
    }}>Add</button>
    // ...
TaskApp 元件沒有向下傳遞任何事件處理器，而TaskList也沒有向Task傳遞任何事件處理器，它們各自透過 context 取得所需：


狀態依舊會 “存活” 在TaskApp元件的頂層，並且使用useReducer來管理。
但是該樹狀結構以下的所有元件可以透過匯入以及使用 context，取得tasks與dispatch。

Moving all wiring into a single file
你不一定要這麼做，但你可以透過將 reducer 以及 context 移至單一檔案來進一步整理元件。

目前TaskContext.js檔案只包含了兩個 context 的宣告：

import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
我們要將 reducer 一起移來這個檔案，接著在這個檔案宣告一個TasksProvider元件，這個元件將會連接起以下這些部分：

它將會使用 reducer 來管理狀態。
它將會提供 context 給其他元件。
它會接收childrenprop，讓 JSX 可以傳遞進元件。
export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
以下為整理過後的程式碼：


你也可以匯出函式，讓其他元件使用TaskContext.js裡的 context：

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
如果其他的元件需要讀取 context 就可以透過函式取得：

const tasks = useTasks();
const dispatch = useTasksDispatch();
現在所有的 context 與reducer 都已經在TaskContext.js整理好，這樣可以讓元件的內容更加乾淨、簡潔，更加專注於它們所要展示的，而不是資料的來源：


TasksProvider知道該如何處理這些任務們，useTasks用來讀取資訊，而useTasksDispatch用來更新該樹狀結構以下的任何元件。

像是useTasks以及useTasksDispatch這樣的函式被稱為 Custom Hooks，沒錯，就是字面上的那個意思 - 自定義的 Hook。

如果你的函式使用use為命名開頭，將會被視為一個自定義 Hook，這讓你可以在內部使用其他的 Hooks，像是useContext。

隨著專案的成長，會有越來越多像這樣的 reducer 與 context 的搭配組合，不論想要取得資料的元件本身處於多深處的結構，這個方法讓我們可以不用透過過多的流程，就能達到 lift state up 的效果。`,
  },
  {
    id: 3,
    title: `【 Google 】讓 Google Sheet 成為你的資料庫`,
    content: `前言
在工作上遇到了需要將前端收集到的資料整合給客戶的需求，最一開始是看了這篇 - Google sheet 試算表表單串接api，但因為版本的更新，使用此篇做法會遇上 CORS 的問題，以下紀錄 2023 實測作法，大致操作與參考文章相同，主要的差別在於前端存取資料的部分。

官方文件在這裡

Google Apps Script
1 . 建立一個新的 Google Sheet。
2 . 進入 Google 雲端硬碟頁面點選左上角的新增。
3 . 點選更多 ⇒ Google Apps Script


4 . 以下為範例程式碼，請依實際需求修改資料格式：

function doGet(e) {
  let name = e.parameters.name;
  let age = e.parameters.age;

  // 選擇 Google Sheet
  let spreadsheet = SpreadsheetApp.openById("填入Google Sheet ID");
  
  // 取得第一個表單
  let sheet = spreadsheet.getSheets()[0];
  // 目前的最後一行
  let lastRow = sheet.getLastRow();

  // 寫入資料，選擇 (行, 欄)。
  sheet.getRange(lastRow + 1, 1).setValue(name);
  sheet.getRange(lastRow + 1, 2).setValue(age);

  // result 裡面可以放入文字 debug，若成功送出請求，dev tools 將會打印出 result。
  let result = "";
  let callback = e.parameters.callback;
  let response = callback + "(" + JSON.stringify(result) + ")";
  return ContentService
    .createTextOutput(response)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
Google Sheet 網址會有一段 ID，即下圖底線紅色的部分，請將上方程式碼中的 “填入Google Sheet ID” 改為你自己的 Google Sheet ID：


直接把程式碼寫在 gs 檔案裡：


5 . 部署：點擊右上方的新增部署作業，每一次有更動都需要重新部署。


選取類型選擇網頁應用程式：


將存取權設為所有人：


點擊部署之後會出現以下畫面，點擊授予存取權：


接著會出現登入頁面，登入之後會看到下方畫面：


請點擊左下角的 Advanced，然後前往專案，一路按允許確認：


這時候會獲得一個網址，請將它複製起來，它就是前端要使用的網址：`,
  },
]
