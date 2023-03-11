import jwtDecode from "jwt-decode";

export const isTokenExpired = (token) => {
  if (token) {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decodedToken.exp < currentTime;
  }
  return true;
};
export function RemoveDuplicateDivs(query, indicatorQuery) {
  setTimeout(() => {
    var divs = document.querySelectorAll(query);
    // console.log("divs",divs)
    var indicatorDiv = document.querySelectorAll(indicatorQuery);
    // console.log("indicatorDiv",indicatorDiv)
    if (indicatorDiv.length > 0) {
      var uniqueDivs = [];
      for (var i = 0; i < divs.length; i++) {
        var isDuplicate = false;
        for (var j = 0; j < uniqueDivs.length; j++) {
          if (divs[i].innerHTML === uniqueDivs[j].innerHTML) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          uniqueDivs.push(divs[i]);
        }
      }
      for (var i = 0; i < divs.length; i++) {
        if (!uniqueDivs.includes(divs[i])) {
          // divs[i].parentNode.removeChild(divs[i]);
          divs[i].parentNode.style.display='none'
          // magic lỏd
        }
      }
    }
  }, 0);
}
export function RemoveBlankDivs() {
  setTimeout(() => {
    const blankDivs = document.querySelectorAll("div");
    blankDivs.forEach((div) => {
      if (!div.textContent.trim() && !div.hasAttributes()) {
        console.log("blankDivs", div);
        div.remove();
      }
    });
  }, 0);
}
export const Helper = {
  isTokenExpired,RemoveBlankDivs,RemoveDuplicateDivs
};
