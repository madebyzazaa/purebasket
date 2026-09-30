//streak
//name storage
//stats(3)
//calendar(31/30, save&display: object)

document.getElementsByClassName('backdrop').item(0).addEventListener('click', ()=>{
// Vibrates the phone for 200 milliseconds
  if (navigator.vibrate) {
    navigator.vibrate(100);
    console.log('vibrated')
  } else {
    console.log("Vibration API is not supported on this device/browser.");
  }

})

let data = JSON.parse(localStorage.getItem('storeddata'))
console.log(data)
if(!data){data={
  streak: {
    date: '04/15/2025',
    slength: 0
  },
  max_streak: 0,
  saved_month: '04',
  saved_year: '2025',
  last_upload: null,
  injury_start: null,
  injury_stop: null
}}
let monthdata = JSON.parse(localStorage.getItem('monthdata'))
if(!monthdata){monthdata={}}
let injury = JSON.parse(localStorage.getItem('injurydata'))
if(!injury){injury={}}

let AttachedDate = 0
const input = document.getElementById('input')
const form = document.getElementById('form')
const username = localStorage.getItem('username')
const date = new Date()
const monthno = date.getMonth()
const month = date.toLocaleString('default', {month: 'short'})
const day = date.getDate()
const daysInCurrentMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); 
let stat = 'report'

document.getElementById('add').addEventListener("click", (e)=>{document.getElementById('form').style.display='flex'; 
e.stopPropagation(); AttachedDate=day
input.placeholder=`for ${AttachedDate}`})
document.addEventListener("click", ()=>{document.getElementById('form').style.display='none'})
document.getElementById('form').addEventListener("click", (e)=>{e.stopPropagation()})

console.log(`${month} ${monthno} ${day} ${daysInCurrentMonth} ${date}`)
console.log(injury)

document.getElementById('username').addEventListener('click', ()=>{
const newname = window.prompt('new username')
localStorage.setItem('username', newname)
document.getElementById('username').innerHTML=newname
})

//load data
function load(){
if(username){document.getElementById('username').innerHTML=username}
document.getElementById('month').innerHTML=month.slice(0, 3)
document.getElementById('streak-txt').innerHTML=`streak: ${data.streak.slength}days 🔥`
const streak = data.streak
const streakdate = new Date(streak.date)
const differenceInMs = date-streakdate
const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
console.log(differenceInDays)
if(differenceInDays>1){document.getElementById('streak-txt').innerHTML=`streak: 0days 🔥`}
document.getElementById('streak-value').innerHTML=`${data.max_streak} days`
const value = Object.values(monthdata)
const TotalBasket =  value.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)
const AvgBasket = Math.round(TotalBasket/value.length)
document.getElementById('tbtm-value').innerHTML=`${TotalBasket}`
if(!Number.isNaN(AvgBasket)){document.getElementById('da-value').innerHTML=`${AvgBasket}`}

document.getElementById('record-value').innerHTML=`${value.length} - ${day} days`
input.placeholder=`for ${day}`
}
load()

for (let index = 0; index < daysInCurrentMonth; index++) {
const box = document.createElement('div')
const tag = document.createElement('div')
box.className = 'box'
tag.className = 'tag'
tag.innerHTML='00'
box.append(tag)
box.addEventListener('click', ()=>{
tag.style.display='block'
setTimeout(() => {
tag.style.display='none'
}, 1000);
})

box.addEventListener('dblclick', ()=>{
if(index<day && index>=day-3){
form.style.display='flex'; AttachedDate=index+1; 
input.placeholder=`for ${AttachedDate}` }
})
document.getElementsByClassName('grid').item(0).append(box)
}

//contribution tracking
function track(){
const entry = Object.entries(monthdata)
const injuryentry = Object.entries(injury)

injuryentry.forEach(([key, value])=>{
const start = new Date(key)
const end = new Date(value)
const differenceInMs = end-start
const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
const month = start.getMonth()
const year = start.getFullYear()
const endmonth = end.getMonth()
const endyear = end.getFullYear()
if(month==monthno && year==date.getFullYear()){
for (let index = 0; index < differenceInDays; index++) {
const convert = (start.getDate())+index

if(convert<=day){
document.getElementsByClassName('box').item(convert-1).style.backgroundColor='#2F3640'
}
}}
else if(endmonth==monthno && endyear==date.getFullYear()){
for (let index = 0; index < end.getDate(); index++) {
const convert = (end.getDate())-index

if(convert<=day){
document.getElementsByClassName('box').item(convert-1).style.backgroundColor='#2F3640'
}
}
}
else{
delete injury[key];
}

localStorage.setItem('injurydata', JSON.stringify(injury))
})


entry.forEach(([key, value])=>{
let color = value*0.007
if(color<0.7){color=0.7}
else if(color>1){color=1}
document.getElementsByClassName('box').item(key-1).style.backgroundColor=`rgb(240, 136, 17, ${color})`
document.getElementsByClassName('tag').item(key-1).innerHTML=value
})  

const value = Object.values(monthdata)
const TotalBasket =  value.reduce((accumulator, currentValue) => Number(accumulator) + Number(currentValue), 0)
const AvgBasket = Math.round(TotalBasket/value.length)
document.getElementById('tbtm-value').innerHTML=`${TotalBasket}`
if(!Number.isNaN(AvgBasket)){document.getElementById('da-value').innerHTML=`${AvgBasket}`}
document.getElementById('record-value').innerHTML=`${value.length} - ${day} days`
}
track()

//create new record
function CreateRecord(){
if(input.value && Number(input.value)){
monthdata[AttachedDate]=input.value
console.log(monthdata)
form.style.display='none'
localStorage.setItem('monthdata', JSON.stringify(monthdata))
track()

if(AttachedDate==day){
const streak = data.streak
const streakdate = new Date(streak.date)
const differenceInMs = date-streakdate
const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
console.log(differenceInDays)
if(differenceInDays>1){ streak.slength=1}
else if(differenceInDays==1){streak.slength++; 
if(streak.slength > data.max_streak){
data.max_streak=streak.slength
}}
streak.date = date.toLocaleString('en-US')
localStorage.setItem('storeddata', JSON.stringify(data))
console.log(streak, differenceInDays)
document.getElementById('streak-txt').innerHTML=`streak: ${data.streak.slength}days 🔥`
document.getElementById('streak-value').innerHTML=`${data.max_streak} days`
}
}
}
function InjuryReport(){
if(AttachedDate==day){
const start = date.toLocaleString('en-US')
const newdate = new Date
const end = newdate.setDate(newdate.getDate() + Number(input.value))
const enddate = new Date(end)
injury[start] = enddate.toLocaleString('en-US')
console.log(injury)
localStorage.setItem('injurydata', JSON.stringify(injury))
}
}
document.getElementById('save').addEventListener('click', ()=>{
  if(stat=='report'){CreateRecord()}
  else{InjuryReport()}
}) 

//reset data
function reset(){
// 1. Get the current date info
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0 to 11

// 2. Fetch the last visited month/year from localStorage (or default to current)
const lastSavedYear = data.saved_year
const lastSavedMonth = data.saved_month
// 3. CALCULATE THE DIFFERENCE IN MONTHS
const monthDifference = (currentYear - lastSavedYear) * 12 + (currentMonth - lastSavedMonth);

// 4. TRIGGER THE RESET LOGIC
if (monthDifference >= 1) {
  console.log(`A new month has reached! Month difference: ${monthDifference}. Resetting data...`);

monthdata={}
// 5. CRUCIAL: Save the current month and year so it doesn't reset on the next page refresh!
data.saved_month=currentMonth
data.saved_year=currentYear
localStorage.setItem('storeddata', JSON.stringify(data));
localStorage.setItem('monthdata', JSON.stringify(monthdata));
location.reload()}

}
reset()


document.getElementById('sync').addEventListener('click', ()=>{
if(data.last_upload){
if(data.last_upload==day){window.alert('already synced'); return}
let key = Object.keys(monthdata)
let task= {}
const point = key.indexOf(data.last_upload)
key = key.slice(point+1, )
key.forEach((key)=>{
task[key] = monthdata[key]
})
exportTasksToCalendar(task)
data.last_upload=String(day)
localStorage.setItem('storeddata', JSON.stringify(data))
}
else{
task=monthdata
console.log(task)
exportTasksToCalendar(task)
data.last_upload=String(day)
localStorage.setItem('storeddata', JSON.stringify(data))
}

window.alert('synced check your downloads')
form.style.display='none'
})

function exportTasksToCalendar(taskobj) {
    // 2. Initialize the core calendar structure
    const icsLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Your Web App//Custom Task Object Exporter v1.0//EN",
        "CALSCALE:GREGORIAN"
    ];

    // Helper function to format JavaScript dates into clean UTC strings (YYYYMMDDTHHmmSSZ)
    const formatICS = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.') + 'Z';
    };

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = January, 11 = December

    // 3. Loop through the object keys (the days)
    Object.keys(taskobj).forEach((dayKey, index) => {
        const taskTitle = String(taskobj[dayKey]); // e.g., "100", "200"
        const dayNumber = parseInt(dayKey, 10);

        // Create a specific date object for that day at 09:00 AM local time
        const startTime = new Date(currentYear, currentMonth, dayNumber, 9, 0, 0);
        // Set the task to end 1 hour later at 10:00 AM
        const endTime = new Date(currentYear, currentMonth, dayNumber, 10, 0, 0);

        // Generate a unique ID for every separate event block
        const uniqueId = `task-${currentYear}-${currentMonth}-${dayNumber}-${index}@yourwebapp.com`;

        // Append this specific event metadata to our file layout
        icsLines.push("BEGIN:VEVENT");
        icsLines.push(`UID:${uniqueId}`);
        icsLines.push(`DTSTAMP:${formatICS(now)}`);
        icsLines.push(`DTSTART:${formatICS(startTime)}`);
        icsLines.push(`DTEND:${formatICS(endTime)}`);
        icsLines.push(`SUMMARY:${taskTitle}`); // Results in "Task 100", "Task 200", etc.
        icsLines.push(`DESCRIPTION:Automated calendar import for value ${taskTitle} assigned to day ${dayNumber}.`);
        icsLines.push("END:VEVENT");
    });

    // 4. Close the calendar payload framework
    icsLines.push("END:VCALENDAR");
    const icsContent = icsLines.join("\r\n");

    // 5. Convert text buffer into a processing download blob
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // 6. Programmatically trigger a direct browser engine download file layout
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "monthly_tasks.ics");
    document.body.appendChild(link);
    
    link.click(); // Spawns the local device native storage/calendar open action prompt
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

//injury record adds a date entry to data for start date and end date calculates date range and applies color and tag
document.getElementById('select').addEventListener('input', ()=>{
stat=document.getElementById('select').value
if(stat=='injury'){input.placeholder='duration'}
else{input.placeholder=`for ${day}`}
console.log(stat)
})
