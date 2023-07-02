function updateInfo(result) {
    const info = result[0].result;
    document.getElementById('stoneInfo').textContent = `Stones: ${info.stones}`;
    document.getElementById('singleTicketInfo').textContent = `Single Draw Tickets: ${info.singleDrawTickets}`;
    document.getElementById('tenTicketInfo').textContent = `Ten Draw Tickets: ${info.tenDrawTickets}`;
    document.getElementById('drawInfo').textContent = `Total Draws: ${info.draws}`;
  }
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: fetchContent
    }, updateInfo);
  });
  
  // Fetch data from content.js
  function fetchContent() {
    const stoneText = getTextFromClass('prt-stone');
    const ticketTexts = getTextFromClass('prt-gacha-obtain ticket legend');
    const stones = parseInt(stoneText[0], 10) || 0;
    const singleDrawTickets = parseInt(ticketTexts[1], 10) || 0;
    const tenDrawTickets = parseInt(ticketTexts[0], 10) || 0;
    const draws = calculateDraws(stones, tenDrawTickets, singleDrawTickets);
  
    function getTextFromClass(className) {
      const elements = Array.from(document.getElementsByClassName(className));
      return elements.map(element => {
        const match = element.textContent.trim().match(/\d+/);
        return match ? match[0] : '0';
      });
    }
  
    function calculateDraws(stones, tenDrawTickets, singleDrawTickets) {
      const stonesDraws = Math.floor(stones / 300);
      return stonesDraws + tenDrawTickets * 10 + singleDrawTickets;
    }
  
    // Return the result
    return {
      stones: stones,
      singleDrawTickets: singleDrawTickets,
      tenDrawTickets: tenDrawTickets,
      draws: draws
    };
  }
  
  