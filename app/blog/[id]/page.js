'use client'

import NavWrapper from '@/components/blog/NavWrapper'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'

export default function BlogPostPage() {
  const path = usePathname()
  const router = useRouter()

  let data = `前言
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


這時候會獲得一個網址，請將它複製起來，它就是前端要使用的網址：`

  return (
    <div className='w-screen h-[100dvh] flex justify-center relative overflow-y-scroll overscroll-none '>
      <NavWrapper />
      <div className='w-[700px] h-[calc(100%-60px)] mt-[60px]   py-[50px] px-[10px] flex  flex-col'>
        <p className='text-[40px] NotoSansB tracking-tight'>
          【 Google 】讓 Google Sheet 成為你的資料庫
        </p>
        <p className='text-[13px] NotoSansM text-mainGrey-100 mt-[20px]'>
          MAR 5, 2024
        </p>
        <div className='w-full relative flex flex-col mt-[20px]'>
          <div className='relative w-full h-0 pb-[58.25%]'>
            <Image
              src='/images/test.webp'
              alt='logo'
              layout='fill'
              className='object-contain'
            />
          </div>
          <p className='text-center text-[13px] NotoSansM text-mainGrey-100 mt-[20px]'>
            Photo by Joshua Aragon on Unsplash
          </p>
        </div>
        <p className=' whitespace-pre-wrap mt-[50px] text-[20px] NotoSerifR pb-[20%]'>
          {data}
        </p>
      </div>
    </div>
  )
}
