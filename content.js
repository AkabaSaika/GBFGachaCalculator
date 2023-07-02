function getTextFromClass(className) {
  const elements = Array.from(document.getElementsByClassName(className));
  return elements.map(element => {
    const match = element.textContent.trim().match(/\d+/);
    return match ? match[0] : '0';
  });
}

function calculateDraws(stones, tenDrawTickets, singleDrawTickets) {
  const stonesDraws = Math.floor(stones / 300);
  return stonesDraws + parseInt(tenDrawTickets) * 10 + parseInt(singleDrawTickets);
}
