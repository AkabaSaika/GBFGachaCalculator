function updateInfo(result) {
    const info = result[0].result;
    console.log(info)
    document.getElementById('stoneInfo').textContent = `Stones: ${info.stones}`;
    document.getElementById('singleTicketInfo').textContent = `Single Draw Tickets: ${info.singleDrawTickets}`;
    document.getElementById('tenTicketInfo').textContent = `Ten Draw Tickets: ${info.tenDrawTickets}`;
    document.getElementById('drawInfo').textContent = `Total Draws: ${info.draws}`;
  }
  
  chrome.storage.local.get(["currentDraws"], function(value) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(tabs[0]){
        const url = new URL(tabs[0].url);
        if(url.href==='https://game.granbluefantasy.jp/#gacha'){
          chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: fetchContent
          }, updateInfo);
        }
        else{
          let dataToPass = value;
          chrome.scripting.executeScript({
            target:{tabId:tabs[0].id},
            function: function(data) {
              // 在这里，你可以在页面上下文中使用 data
              return data.currentDraws;
            },
            args: [dataToPass]  // 把从chrome.storage.local.get得到的数据传递给页面脚本
          },updateInfo);
        }
      }
    });
  });

  function fetchLocalStorage(){
   chrome.storage.local.get(["currentDraws"],function (value) {
        console.log(value)
      })
  }


  // Fetch data from content.js
  function fetchContent() {
    const stoneText = getTextFromClass('prt-stone');
    const ticketTexts = getTextFromClass('prt-gacha-obtain ticket legend');
    const singleDrawTicketsText = getTextFromXPath('//*[@id="gacha-legend"]/div[1]/div[2]/div[2]/div[2]/div[1]');
    const stones = parseInt(stoneText[0], 10) || 0;
    const singleDrawTickets = parseInt(singleDrawTicketsText, 10) || 0;
    // const tenDrawTickets = parseInt(ticketTexts[0], 10) || 0;
    const tenDrawTickets = 0;
    const draws = calculateDraws(stones, tenDrawTickets, singleDrawTickets);
  
    function getTextFromClass(className) {
      const elements = Array.from(document.getElementsByClassName(className));
      return elements.map(element => {
        const match = element.textContent.trim().match(/\d+/);
        return match ? match[0] : '0';
      });
    }

    function getTextFromXPath(xPath) {
      const element = document.evaluate(xPath,document).iterateNext();
      const match = element.textContent.trim().match(/\d+/);
      return match?match:"0";
    }
  
    function calculateDraws(stones, tenDrawTickets, singleDrawTickets) {
      const stonesDraws = Math.floor(stones / 300);
      return stonesDraws + tenDrawTickets * 10 + singleDrawTickets;
    }

    const result = {
      "stones": stones,
      "singleDrawTickets": singleDrawTickets,
      "tenDrawTickets": tenDrawTickets,
      "draws": draws
    }
    chrome.storage.local.set({"currentDraws":result});

    // localStorage.setItem("currentDraws",JSON.stringify(result));
   
    // Return the result
    return result;
  }
  
  